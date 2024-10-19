import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function GenerationDialog({ isOpen, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [todaysImage, setTodaysImage] = useState("");
  const [promptsRemaining, setPromptsRemaining] = useState(0);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);

  useEffect(() => {
    const fetchTodaysImage = async () => {
      try {
        const response = await fetch('/api/get-todays-image');
        if (!response.ok) {
          throw new Error('Failed to fetch today\'s image');
        }
        const data = await response.json();
        setTodaysImage(data.imageUrl);
      } catch (error) {
        console.error('Error fetching today\'s image:', error);
        setTodaysImage("https://picsum.photos/800/800");
      }
    };

    const fetchUserContestData = async () => {
      try {
        const today = new Date().toLocaleString('en-GB', { timeZone: 'GMT', day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('');
        const response = await fetch(`/api/get-user-contest-data`);
        if (!response.ok) {
          if (response.status === 404) {
            // No contest found for today, set default values
            setPromptsRemaining(3);
            setGeneratedImages([]);
          } else {
            throw new Error('Failed to fetch user contest data');
          }
        } else {
          const data = await response.json();
          setPromptsRemaining(data.promptsRemaining);
          setGeneratedImages(data.prompts.map(prompt => ({
            src: prompt.imageUrl,
            closenessPercentage: prompt.closenessScore
          })));
        }
      } catch (error) {
        console.error('Error fetching user contest data:', error);
        // Set default values in case of error
        setPromptsRemaining(3);
        setGeneratedImages([]);
      }
    };

    const fetchUserStatus = async () => {
      try {
        const response = await axios.get('/api/get-user-status');
        const data = response.data;
        setPromptsRemaining(data.promptsRemaining);
        setHasSubmittedScore(data.hasSubmittedScore);
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };

    fetchTodaysImage();
    fetchUserContestData();
    fetchUserStatus();
  }, [isOpen]);

  const handleGenerate = async () => {
    if (promptsRemaining > 0 && prompt.trim() !== "") {
      setIsGenerating(true);
      
      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate image');
        }

        const data = await response.json();
        const newImage = {
          src: data.imageUrl,
          closenessPercentage: data.closenessScore
        };
        setGeneratedImages(prevImages => [...prevImages, newImage]);
        setPromptsRemaining(data.promptsRemaining);
      } catch (error) {
        console.error('Error generating image:', error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleClose = () => {
    onClose();
    setIsGenerating(false);
    setGeneratedImages([]);
    setPrompt("");
  };

  const handleSubmitScore = async () => {
    try {
      const response = await axios.post('/api/submit-score');
      if (response.status === 200) {
        setHasSubmittedScore(true);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    }
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
                        {image.closenessPercentage}% Close
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-lg"></div>
                  )}
                </div>
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
                      disabled={isGenerating || prompt.trim() === ""}
                      className={`bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 ${
                        !isGenerating && prompt.trim() !== "" ? 'hover:bg-amber-600' : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                  </>
                )}
                {promptsRemaining === 0 && !hasSubmittedScore && (
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={handleSubmitScore}
                      className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-300"
                    >
                      Submit Score
                    </button>
                    <p className="text-amber-700 text-sm">The app submits the best score among 3 tries.</p>
                  </div>
                )}
                {promptsRemaining === 0 && !hasSubmittedScore && (
                  <p className="mt-2 text-red-500">No more tries left. Submit your score!</p>
                )}
                {hasSubmittedScore && (
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
