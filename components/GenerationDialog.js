import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import witbABI from '../contracts/abi/witb.json';

// Contract configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
if (!CONTRACT_ADDRESS) {
  throw new Error('Contract address not configured in environment variables');
}

export default function GenerationDialog({ isOpen, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [todaysImage, setTodaysImage] = useState("");
  const [promptsRemaining, setPromptsRemaining] = useState(0);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { address } = useAccount();

  const { writeContract, data: hash, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [todaysImageRes, contestDataRes, userStatusRes] = await Promise.all([
          fetch('/api/get-todays-image'),
          fetch('/api/get-user-contest-data'),
          axios.get('/api/get-user-status')
        ]);

        // Handle today's image
        if (todaysImageRes.ok) {
          const { imageUrl } = await todaysImageRes.json();
          setTodaysImage(imageUrl);
        } else {
          setTodaysImage("https://picsum.photos/800/800");
        }

        // Handle contest data
        if (contestDataRes.ok) {
          const data = await contestDataRes.json();
          setPromptsRemaining(data.promptsRemaining);
          setGeneratedImages(data.prompts.map(prompt => ({
            src: prompt.imageUrl,
            closenessPercentage: prompt.closenessScore
          })));
          setScoreSubmitted(data.scoreSubmitted);
        } else if (contestDataRes.status === 404) {
          setPromptsRemaining(3);
          setGeneratedImages([]);
          setScoreSubmitted(false);
        }

        // Handle user status
        const { data: userStatus } = userStatusRes;
        setPromptsRemaining(userStatus.promptsRemaining);
        setScoreSubmitted(userStatus.scoreSubmitted);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setPromptsRemaining(3);
        setGeneratedImages([]);
      }
    };

    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      const submitScoreToAPI = async () => {
        try {
          const response = await axios.post('/api/submit-score');
          if (response.status === 200) {
            setHasSubmittedScore(true);
            setSubmitError("");
          }
        } catch (error) {
          setSubmitError("Score submitted on blockchain, but failed to update our database. Please contact support.");
          console.error('API Error:', error);
        }
      };
      submitScoreToAPI();
    }
  }, [isConfirmed, hash]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      console.error('Contract Write Error:', writeError);
      setSubmitError(writeError.message || "Failed to submit score to blockchain");
    }
  }, [writeError]);

  const handleGenerate = async () => {
    if (promptsRemaining <= 0 || !prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate image');

      const data = await response.json();
      const newImage = {
        src: data.imageUrl,
        closenessPercentage: data.closenessScore
      };
      
      setGeneratedImages(prev => [...prev, newImage]);
      setPromptsRemaining(data.promptsRemaining);
      setPrompt("");
    } catch (error) {
      console.error('Generation Error:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitScore = async () => {
    if (promptsRemaining > 0 || hasSubmittedScore || !generatedImages.length) return;

    try {
      setSubmitError("");
      
      // Generate contest ID (DDMMYYYY format) based on GMT
      const today = new Date();
      const contestId = parseInt(
        today.getUTCDate().toString().padStart(2, '0') +
        (today.getUTCMonth() + 1).toString().padStart(2, '0') +
        today.getUTCFullYear()
      );

      // Find highest scoring prompt
      const highestScorePrompt = generatedImages.reduce((prev, current) => 
        (current.closenessPercentage > prev.closenessPercentage) ? current : prev
      );

      // Round the score without multiplying by 100
      const scoreForContract = BigInt(Math.round(highestScorePrompt.closenessPercentage));

      // Submit to blockchain
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: witbABI,
        functionName: 'submitScore',
        args: [BigInt(contestId), scoreForContract, highestScorePrompt.src],
        // Add gas limit if needed
        // gas: 200000n,
      });

      setScoreSubmitted(true);

    } catch (error) {
      console.error('Submit Score Error:', error);
      setSubmitError(error.message || "Failed to submit score");
      if (error.code) console.error('Error code:', error.code);
      if (error.data) console.error('Error data:', error.data);
    }
  };

  const handleClose = () => {
    onClose();
    setIsGenerating(false);
    setGeneratedImages([]);
    setPrompt("");
    setSubmitError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white z-50 overflow-auto"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-amber-700 hover:text-amber-600"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="container mx-auto px-8 py-12 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-amber-700 mb-12">Prove your prompt skills, shwty</h2>
            <div className="flex w-full">
              <div className="w-1/2 pr-8">
                <div className="relative mb-8 mt-12">
                  <div className="absolute top-2 left-2 w-[384px] h-[384px] border-4 border-amber-700 rounded-lg"></div>
                  <img
                    src={todaysImage}
                    alt="Photo of the Day"
                    width={380}
                    height={380}
                    className="relative z-10 rounded-lg shadow-lg border-4 border-amber-700"
                  />
                </div>
              </div>
              <div className="w-1/2 pl-8 flex flex-col justify-center">
                <div className="mb-4 text-amber-700 font-bold">
                  Tries left: {promptsRemaining}
                </div>
                <div className="relative mb-4 flex space-x-4">
                  {generatedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.src}
                        alt={`Generated Image ${index + 1}`}
                        className="w-[200px] h-[200px] rounded-lg"
                      />
                      <div className="absolute bottom-2 left-2 bg-white text-amber-700 px-2 py-1 rounded-full text-xs">
                        {Math.round(image.closenessPercentage)}% Close
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-lg"></div>
                  )}
                </div>
                
                {submitError && (
                  <div className="mb-4 text-red-500 text-sm">
                    {submitError}
                  </div>
                )}

                {promptsRemaining > 0 && (
                  <>
                    <textarea
                      className="w-full h-40 p-4 mb-4 border-2 border-amber-700 rounded-lg resize-none"
                      placeholder="Enter your prompt here..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    ></textarea>
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className={`bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 ${
                        !isGenerating && prompt.trim() ? 'hover:bg-amber-600' : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                  </>
                )}

                {promptsRemaining === 0 && !scoreSubmitted && (
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={handleSubmitScore}
                      disabled={isConfirming || promptsRemaining > 0 || scoreSubmitted}
                      className={`bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 ${
                        (isConfirming || promptsRemaining > 0 || scoreSubmitted) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-600'
                      }`}
                    >
                      {isConfirming ? 'Submitting...' : 'Submit Score'}
                    </button>
                    <p className="text-amber-700 text-sm">The app submits the best score among 3 tries.</p>
                  </div>
                )}

                {promptsRemaining === 0 && !scoreSubmitted && (
                  <p className="mt-2 text-red-500">No more tries left. Submit your score!</p>
                )}

                {scoreSubmitted && (
                  <p className="mt-2 text-amber-700 font-bold">Your score has been submitted. See you tomorrow, Shwty!!</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
