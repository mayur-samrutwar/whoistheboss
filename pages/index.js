import Navbar from "../components/layout/Navbar";
import Image from "next/image";
import { ArrowRight, BicepsFlexed } from "lucide-react";

export default function Home() {
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
      <button className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-amber-700 text-white text-xl font-bold px-8 py-4 rounded-full shadow-lg hover:bg-amber-600 transition-colors duration-300 flex items-center">
        <BicepsFlexed className="mr-4 h-6 w-6" />
        I'm the boss, shwty
      </button>
    </div>
  );
}
