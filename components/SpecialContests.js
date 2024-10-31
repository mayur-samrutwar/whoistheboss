import { Swords, EyeOff, Code } from "lucide-react";

export default function SpecialContests() {
  const specialContests = [
    {
      icon: Swords,
      title: "1v1 Battle",
      description: "Challenge another player directly in a head-to-head battle.",
      entryFee: "0.001 ETH",
      reward: "0.0015 ETH",
      tag: {
        text: "Most Played",
        color: "bg-amber-500"
      },
      buttonText: "Enter Now",
      buttonClass: "bg-amber-700 hover:bg-amber-800"
    },
    {
      icon: EyeOff,
      title: "Blind Prompt",
      description: "Generate images without seeing the given image, only with clues",
      entryFee: "0.001 ETH",
      reward: "Top 3 share 0.01 ETH",
      buttonText: "Coming Soon",
      buttonClass: "bg-gray-400 cursor-not-allowed"
    },
    {
      icon: Code,
      title: "Open Source",
      description: "Help AI grow for the betterment of humanity.",
      entryFee: "Free",
      reward: "Community Pool",
      tag: {
        text: "Community Choice",
        color: "bg-blue-500"
      },
      buttonText: "Coming Soon",
      buttonClass: "bg-gray-400 cursor-not-allowed"
    }
  ];

  return (
    <div className="container mx-auto px-8 pb-24">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-4xl font-bold text-amber-700">Special Contests</h2>
        <div className="h-px flex-grow bg-gradient-to-r from-amber-200 to-transparent"></div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {specialContests.map((contest, index) => (
          <div 
            key={index}
            className="group bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full relative"
          >
            {contest.tag && (
              <div className="absolute -top-3 right-6">
                <div className="flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full shadow-[0_4px_10px_rgb(0,0,0,0.08)] border border-gray-50">
                  <div className={`w-1.5 h-1.5 rounded-full ${contest.tag.color}`}></div>
                  <span className="text-xs font-medium text-gray-700 tracking-wide uppercase">
                    {contest.tag.text}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center mb-4">
              <contest.icon className="h-6 w-6 text-amber-700 mr-2" />
              <h3 className="text-xl font-bold text-amber-700">{contest.title}</h3>
            </div>
            <p className="text-gray-600 mb-4 flex-grow">{contest.description}</p>
            <div className="mt-auto space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Entry Fee</span>
                  <span className="text-base font-bold text-amber-700">{contest.entryFee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Reward Structure</span>
                  <span className="text-base font-bold text-green-600">{contest.reward}</span>
                </div>
              </div>
              <button className={`w-full ${contest.buttonClass} text-white py-3 rounded-xl font-medium transition-colors group-hover:shadow-lg`}>
                {contest.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
