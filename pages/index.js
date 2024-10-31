import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import {
  ArrowRight,
  BicepsFlexed,
  Swords,
  Star,
  EyeOff,
  Code,
  Flame,
  Trophy,
  Target,
  ChevronDown,
  Twitter,
  Github,
  Mail,
  MessageCircle
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import GenerationDialog from "../components/GenerationDialog";
import StakeDialog from "../components/StakeDialog";
import DailyContests from '@/components/DailyContests';
import SpecialContests from '@/components/SpecialContests';
import FAQ from '@/components/FAQ';

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);
  const [todaysImage, setTodaysImage] = useState("");
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [dialogMode, setDialogMode] = useState('generate');
  const { data: session } = useSession();
  const [timeRemaining, setTimeRemaining] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const openStakeDialog = () => setIsStakeDialogOpen(true);
  const closeStakeDialog = () => setIsStakeDialogOpen(false);

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

    fetchTodaysImage();

    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
      const diff = endOfDay - now;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkEligibility = async () => {
    setIsCheckingEligibility(true);
    try {
      const response = await fetch('/api/get-user-status', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user status');
      }
      const data = await response.json();
      if (data.needsToStake) {
        openStakeDialog();
      } else if (data.canPlay) {
        setDialogMode('generate');
        openDialog();
      } else if (data.needsToSubmitScore) {
        setDialogMode('submit');
        openDialog();
      } else {
        alert("You've already submitted your score for today's contest.");
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
      alert("An error occurred while checking eligibility.");
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handleStakeSuccess = () => {
    closeStakeDialog();
    openDialog();
  };

  return (
    <div className="relative min-h-screen flex flex-col scroll-smooth">
      <Navbar />

      {/* Photo of the Day Section with updated fees/rewards */}
      <section className="w-full bg-amber-50/50 py-24">
        <div className="container mx-auto px-8 flex justify-between">
          <div className="flex -space-x-48">
            <div className="flex flex-col text-5xl font-bold mb-8 text-amber-700 -rotate-90">
              <span className="font-black text-8xl">PHOTO</span>
              <span className="font-normal">Of The Day</span>
            </div>
            <div className="relative mb-8 mt-12">
              <div className="absolute top-2 left-2 w-[384px] h-[384px] border-4 border-amber-700 rounded-lg"></div>
              <img
                src={todaysImage}
                alt="Photo of the Day"
                width={380}
                height={380}
                className="relative z-10 rounded-lg shadow-lg border-4 border-amber-700 w-[380px] h-[380px]"
              />
              <div className="absolute bottom-[-50px] left-0 right-0 text-center text-amber-700 font-bold">
                Time remaining: {timeRemaining}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            {session ? (
              <>
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-sm font-medium text-gray-500">Entry Fee</span>
                    <span className="text-lg font-bold text-amber-700">0.05 ETH</span>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-sm font-medium text-gray-500">Daily Reward</span>
                    <span className="text-lg font-bold text-green-600">1.0 ETH</span>
                  </div>
                </div>
                <button
                  onClick={checkEligibility}
                  disabled={isCheckingEligibility}
                  className={`bg-amber-700 text-white text-xl font-bold px-8 py-4 rounded-full shadow-lg transition-colors duration-300 flex items-center mb-2 ${
                    isCheckingEligibility ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-600'
                  }`}
                >
                  {isCheckingEligibility ? 'Checking...' : (
                    <>
                      <BicepsFlexed className="mr-4 h-6 w-6" />
                      I am the boss, shwty
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="text-amber-700 text-xl font-bold">
                Please connect your wallet to play
              </div>
            )}
            <div className="text-amber-700 text-center mt-4">
              Generate the closest image using AI and win
            </div>
          </div>
        </div>
      </section>

      {/* Contests Section */}
      <section className="w-full bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200"></div>
        <DailyContests />
        <SpecialContests />
      </section>

      <FAQ />
      
      {/* Footer */}
      <footer className="w-full bg-amber-50">
        <div className="container mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-900">AI Battle Arena</h3>
              <p className="text-amber-700/80 text-sm leading-relaxed">
                The ultimate platform for AI image generation competitions. 
                Join the community and showcase your prompting skills.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-amber-700 hover:text-amber-900 transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-amber-700 hover:text-amber-900 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-amber-700 hover:text-amber-900 transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-amber-700 hover:text-amber-900 transition-colors">
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-amber-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'Contests', 'Leaderboard', 'Marketplace', 'Documentation'].map((item) => (
                  <li key={item}>
                    <Link 
                      href="#" 
                      className="text-amber-700/80 hover:text-amber-900 text-sm transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-amber-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Blog', 'Tutorials', 'FAQ', 'Support', 'Terms of Service', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <Link 
                      href="#" 
                      className="text-amber-700/80 hover:text-amber-900 text-sm transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-amber-900 mb-4">Stay Updated</h4>
              <p className="text-amber-700/80 text-sm mb-4">
                Subscribe to our newsletter for the latest updates and contests.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-l-lg border-y border-l border-amber-200 focus:outline-none focus:border-amber-400 flex-grow text-sm"
                />
                <button className="bg-amber-700 text-white px-4 py-2 rounded-r-lg hover:bg-amber-800 transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-amber-200/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-amber-700/60 text-sm">
                © 2024 AI Battle Arena. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <Link 
                  href="#" 
                  className="text-amber-700/60 hover:text-amber-900 text-sm transition-colors"
                >
                  Terms
                </Link>
                <Link 
                  href="#" 
                  className="text-amber-700/60 hover:text-amber-900 text-sm transition-colors"
                >
                  Privacy
                </Link>
                <Link 
                  href="#" 
                  className="text-amber-700/60 hover:text-amber-900 text-sm transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <GenerationDialog isOpen={isDialogOpen} onClose={closeDialog} mode={dialogMode} />
      <StakeDialog isOpen={isStakeDialogOpen} onClose={closeStakeDialog} onSuccess={handleStakeSuccess} />
    </div>
  );
}
