import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";

const dummyData = [
  {
    id: 2,
    date: '2023-04-15',
    winner: { address: '0x1234...5678', prompt: 'A futuristic cityscape', image: 'https://picsum.photos/300/300?random=1', score: 95 },
  },
  {
    id: 1,
    date: '2023-04-14',
    winner: { address: '0x4567...8901', prompt: 'A steampunk airship', image: 'https://picsum.photos/300/300?random=4', score: 98 },
  }
];

const todaysLeaderboard = {
  date: new Date().toISOString().split('T')[0],
  winner: { address: '0x7890...1234', image: 'https://picsum.photos/300/300?random=7', score: 89 },
};

export default function Leaderboard() {
  const [expandedContests, setExpandedContests] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});

  const toggleContest = (id) => {
    setExpandedContests(prev => 
      prev.includes(id) ? prev.filter(contestId => contestId !== id) : [...prev, id]
    );
  };

  const toggleFlip = (contestId) => {
    setFlippedCards(prev => ({
      ...prev,
      [contestId]: !prev[contestId]
    }));
  };

  return (
    <div className="relative bg-white">
      <Navbar />
      <main className="min-h-screen w-screen flex flex-col items-center pt-24">
        <div className="container mx-auto px-8 py-12 flex flex-col items-center">
          <h2 className="text-4xl font-bold text-amber-800 mb-12">Leaderboard</h2>
          
          <div className="w-full mb-12">
            <h3 className="text-3xl font-semibold text-amber-700 mb-6 text-center">Today</h3>
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-amber-600">#1</span>
                <span className="text-sm font-medium text-amber-500">0xfd2A...4e22B</span>
              </div>
              <div className="relative w-full pb-[100%] mb-4">
                <img src="https://obj-store.livepeer.cloud/livepeer-cloud-ai-images/04efc97f/6b3681fa.png" alt="Generated" className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md" />
              </div>
              <div className="text-center">
                <span className="text-2xl font-semibold text-amber-700">43 points</span>
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-semibold text-amber-700 mb-6">Past Contests</h3>
          {dummyData.map((contest) => (
            <div key={contest.id} className="w-full mb-8 bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <button 
                onClick={() => toggleContest(contest.id)}
                className="w-full flex justify-between items-center text-amber-800 font-semibold text-2xl mb-4 hover:text-amber-600 transition-colors duration-300"
              >
                <span>Contest #{contest.id} - {contest.date}</span>
                {expandedContests.includes(contest.id) ? <ChevronUp className="h-8 w-8" /> : <ChevronDown className="h-8 w-8" />}
              </button>
              <AnimatePresence>
                {expandedContests.includes(contest.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 overflow-hidden"
                  >
                    <div className="group h-[450px] w-full [perspective:1000px]">
                      <div 
                        className={`relative h-full w-full rounded-lg shadow-md transition-all duration-500 [transform-style:preserve-3d] ${
                          flippedCards[contest.id] ? '[transform:rotateY(180deg)]' : ''
                        }`}
                        onClick={() => toggleFlip(contest.id)}
                      >
                        {/* Front face */}
                        <div className="absolute inset-0 h-full w-full rounded-lg bg-amber-50 p-6 [backface-visibility:hidden]">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl font-bold text-amber-600">#1</span>
                            <span className="text-sm font-medium text-amber-500">{contest.winner.address}</span>
                          </div>
                          <div className="relative w-full h-[300px] mb-4">
                            <img src={contest.winner.image} alt="Generated" className="w-full h-full object-cover rounded-lg shadow-md" />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                              <span className="text-white text-lg font-semibold">Click to see prompt</span>
                            </div>
                          </div>
                          <div className="text-center mb-4">
                            <span className="text-2xl font-semibold text-amber-700">{contest.winner.score} points</span>
                          </div>
                        </div>
                        
                        {/* Back face */}
                        <div className="absolute inset-0 h-full w-full rounded-lg bg-white p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] flex items-center justify-center">
                          <p className="text-amber-800 text-center">{contest.winner.prompt}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 text-center">
                      <button
                        disabled
                        className="bg-amber-600 text-white px-8 py-3 rounded-lg opacity-50 cursor-not-allowed text-lg font-semibold"
                      >
                        Claim Prize
                      </button>
                      <p className="text-sm text-amber-600 mt-2">You are not the winner of this contest.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
