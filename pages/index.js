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

      {/* Photo of the Day Section - Light amber background */}
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

      {/* Contests Sections - White background with decorative elements */}
      <section className="w-full bg-white relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200"></div>
        
        {/* Daily Contests */}
        <div className="container mx-auto px-8 py-24">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-bold text-amber-700">Daily Contests</h2>
            <div className="h-px flex-grow bg-gradient-to-r from-amber-200 to-transparent"></div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="group bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-amber-700 mr-2" />
                <h3 className="text-xl font-bold text-amber-700">Beginner Arena</h3>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">Perfect for newcomers. Simple prompts with guided assistance.</p>
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Prize Pool</span>
                  <span className="text-lg font-bold text-amber-700">0.5 ETH</span>
                </div>
                <button className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors group-hover:shadow-lg">
                  Enter Now
                </button>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <Flame className="h-6 w-6 text-amber-700 mr-2" />
                <h3 className="text-xl font-bold text-amber-700">Advanced Challenge</h3>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">For experienced artists. Complex prompts with specific requirements.</p>
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Prize Pool</span>
                  <span className="text-lg font-bold text-amber-700">1.0 ETH</span>
                </div>
                <button className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors group-hover:shadow-lg">
                  Enter Now
                </button>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <Trophy className="h-6 w-6 text-amber-700 mr-2" />
                <h3 className="text-xl font-bold text-amber-700">Pro League</h3>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">Elite competition. Master-level prompts for the best creators.</p>
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Prize Pool</span>
                  <span className="text-lg font-bold text-amber-700">2.0 ETH</span>
                </div>
                <button className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors group-hover:shadow-lg">
                  Enter Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Special Contests */}
        <div className="container mx-auto px-8 pb-24">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-bold text-amber-700">Special Contests</h2>
            <div className="h-px flex-grow bg-gradient-to-r from-amber-200 to-transparent"></div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="group bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full relative">
              <div className="absolute -top-3 right-6">
                <div className="flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full shadow-[0_4px_10px_rgb(0,0,0,0.08)] border border-gray-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-medium text-gray-700 tracking-wide uppercase">Highest Return</span>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <Swords className="h-6 w-6 text-amber-700 mr-2" />
                <h3 className="text-xl font-bold text-amber-700">1v1 Battle</h3>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">Challenge another player directly in a head-to-head battle.</p>
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Prize Pool</span>
                  <span className="text-lg font-bold text-amber-700">1.5 ETH</span>
                </div>
                <button className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors group-hover:shadow-lg">
                  Enter Now
                </button>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <EyeOff className="h-6 w-6 text-amber-700 mr-2" />
                <h3 className="text-xl font-bold text-amber-700">Blind Prompt</h3>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">Generate images without seeing other submissions until reveal.</p>
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Prize Pool</span>
                  <span className="text-lg font-bold text-amber-700">1.0 ETH</span>
                </div>
                <button className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors group-hover:shadow-lg">
                  Enter Now
                </button>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full relative">
              <div className="absolute -top-3 right-6">
                <div className="flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full shadow-[0_4px_10px_rgb(0,0,0,0.08)] border border-gray-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-medium text-gray-700 tracking-wide uppercase">Community Choice</span>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <Code className="h-6 w-6 text-amber-700 mr-2" />
                <h3 className="text-xl font-bold text-amber-700">Open Source</h3>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">Community-driven contests with custom rulesets.</p>
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Prize Pool</span>
                  <span className="text-lg font-bold text-amber-700">Varies</span>
                </div>
                <button className="w-full bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors group-hover:shadow-lg">
                  Enter Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Light gray background */}
      <section className="w-full bg-gray-50/80" id="faq">
        <div className="container mx-auto px-8 mt-24 mb-16">
          <h2 className="text-3xl font-bold mb-12 text-amber-700">Frequently Asked Questions</h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                question: "How are contest winners determined?",
                answer: "Winners are selected through a combination of community voting and AI similarity scoring. The generated image that most closely matches the daily prompt while maintaining artistic quality receives the highest score."
              },
              {
                question: "What happens if I lose my staked tokens?",
                answer: "Staked tokens are held in a smart contract and are only deducted if you violate contest rules or engage in malicious behavior. Otherwise, they're automatically returned after the contest period ends."
              },
              {
                question: "Can I participate in multiple contests simultaneously?",
                answer: "Yes! You can participate in as many contests as you'd like, as long as you meet the entry requirements and have sufficient tokens staked for each contest."
              },
              {
                question: "How often do contest prompts refresh?",
                answer: "Daily contests refresh every 24 hours at 00:00 UTC. Special contests have varying durations, which are clearly indicated on their respective pages."
              },
              {
                question: "What AI models are supported for image generation?",
                answer: "We currently support major AI image generation models including Midjourney, DALL-E, and Stable Diffusion. The specific models available may vary by contest type."
              },
              {
                question: "How do I withdraw my winnings?",
                answer: "Winnings are automatically sent to your connected wallet within 24 hours of contest completion. You can track your earnings and pending withdrawals in your dashboard."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-left text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openFaq === index && (
                  <div className="px-6 py-4 text-gray-600 border-t border-gray-100 bg-gray-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

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
