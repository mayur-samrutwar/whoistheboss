import { Target, Flame, Trophy } from "lucide-react";

export default function DailyContests() {
  const dailyContests = [
    {
      icon: Target,
      title: "Beginner Arena",
      description: "Perfect for newcomers. Simple images with guided assistance.",
      entryFee: "0.0001 ETH",
      reward: "0.0002 ETH",
    },
    {
      icon: Flame,
      title: "Advanced Challenge",
      description: "For experienced artists. Complex images with specific requirements.",
      entryFee: "0.0002 ETH",
      reward: "0.0005 ETH",
    },
    {
      icon: Trophy,
      title: "Pro League",
      description: "Elite competition. Master-level images for the best creators.",
      entryFee: "0.001 ETH",
      reward: "0.005 ETH",
      tag: {
        text: "5x Return",
        color: "bg-amber-500"
      }
    },
  ];

  return (
    <div className="container mx-auto px-8 py-24">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-4xl font-bold text-amber-700">Daily Contests</h2>
        <div className="h-px flex-grow bg-gradient-to-r from-amber-200 to-transparent"></div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {dailyContests.map((contest, index) => (
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
                  <span className="text-sm font-medium text-gray-500">Reward</span>
                  <span className="text-base font-bold text-green-600">{contest.reward}</span>
                </div>
              </div>
              <button className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors group-hover:shadow-lg">
                Enter Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}