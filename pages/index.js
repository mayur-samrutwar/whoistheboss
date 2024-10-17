import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Image from "next/image";
import {Info, ArrowRight, BicepsFlexed, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [triesLeft, setTriesLeft] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
    setTriesLeft(3);
    setIsGenerating(false);
    setGeneratedImages([]);
  };

  const handleGenerate = () => {
    if (triesLeft > 0) {
      setTriesLeft(prevTries => prevTries - 1);
      setIsGenerating(true);
      // Add your generation logic here
      // When generation is complete, set setIsGenerating(false)
      // For demonstration, we'll set a random closeness percentage
      setTimeout(() => {
        setIsGenerating(false);
        const newImage = {
          src: `https://picsum.photos/200/200?random=${generatedImages.length}`,
          closenessPercentage: Math.floor(Math.random() * 101)
        };
        setGeneratedImages(prevImages => [...prevImages, newImage]);
      }, 2000);
    }
  };

  return (
    <div className="relative">
      <Navbar />

      <main className="bg-amber-100 min-h-screen w-screen flex flex-col items-center pt-24">

        <div className="container mx-auto px-8 flex justify-between">
          <div className="flex -space-x-48">
            <div className="flex flex-col text-5xl font-bold mb-8 text-amber-700 -rotate-90">
              <span className="font-black text-8xl">PHOTO</span>
              <span className="font-normal">Of The Day</span>
            </div>
            <div className="relative mb-8 mt-12">
              <div className="absolute top-2 left-2 w-[384px] h-[384px] border-4 border-amber-700 rounded-lg"></div>
              <img
                src="https://picsum.photos/800/800"
                alt="Photo of the Day"
                width={380}
                height={380}
                className="relative z-10 rounded-lg shadow-lg border-4 border-amber-700"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold mb-4 text-amber-700">Top Bosses</h2>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="relative">
                  <img
                    src={`https://picsum.photos/200/200?random=${index}`}
                    alt={`Stock Image ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="absolute bottom-2 left-2 text-white font-semibold text-sm">
                    @user{index + 1}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 self-end bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-300 flex items-center">
              Show All
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

      </main>
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <button
          onClick={openDialog}
          className="bg-amber-700 text-white text-xl font-bold px-8 py-4 rounded-full shadow-lg hover:bg-amber-600 transition-colors duration-300 flex items-center mb-2"
        >
          <BicepsFlexed className="mr-4 h-6 w-6" />
          I'm the boss, shwty
        </button>
        <div className="flex bg- text-amber-700 text-center py-2 px-6 rounded">
          Generate the closest image using AI and win
        </div>
      </div>
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-50 overflow-auto"
          >
            <button
              onClick={closeDialog}
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
                      src="https://picsum.photos/800/800"
                      alt="Photo of the Day"
                      width={380}
                      height={380}
                      className="relative z-10 rounded-lg shadow-lg border-4 border-amber-700"
                    />
                  </div>
                </div>
                <div className="w-1/2 pl-8 flex flex-col justify-center">
                  <div className="mb-4 text-amber-700 font-bold">
                    Tries left: {triesLeft}
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
                  <textarea
                    className="w-full h-40 p-4 mb-4 border-2 border-amber-700 rounded-lg resize-none"
                    placeholder="Enter your prompt here..."
                  ></textarea>
                  <button 
                    onClick={handleGenerate}
                    disabled={triesLeft === 0 || isGenerating}
                    className={`bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 ${
                      triesLeft > 0 && !isGenerating ? 'hover:bg-amber-600' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </button>
                  {triesLeft === 0 && (
                    <p className="mt-2 text-red-500">No more tries left. See you tomorrow, Shwty!!</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
