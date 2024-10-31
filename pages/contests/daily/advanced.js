import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BicepsFlexed } from "lucide-react";
import GenerationDialog from "@/components/GenerationDialog";
import StakeDialog from "@/components/StakeDialog";

export default function Advanced() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);
  const [todaysImage, setTodaysImage] = useState("");
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [dialogMode, setDialogMode] = useState('generate');
  const { data: session } = useSession();
  const [timeRemaining, setTimeRemaining] = useState('');

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
    <div className="relative min-h-screen flex flex-col">
      <div className="flex-1 pt-24">
        <section className="w-full bg-amber-50/50 py-24">
          <div className="container mx-auto px-8 flex justify-between">
            <div className="flex flex-col items-center">
              <div className="text-center text-amber-700 font-bold mb-4">
                Time remaining: {timeRemaining}
              </div>
              <div className="relative mb-8">
                <img
                  src={todaysImage}
                  alt="Photo of the Day"
                  width={380}
                  height={380}
                  className="relative z-10 rounded-lg shadow-lg border-4 border-amber-700 w-[380px] h-[380px]"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center max-w-md">
              {/* Contest Title and Description */}
              <h2 className="text-3xl font-bold text-amber-700 mb-3">Advanced Challenge</h2>
              <p className="text-gray-600 text-center mb-6">
                For experienced artists. Complex images with specific requirements.
              </p>

              {/* Tags */}
              <div className="flex gap-3 mb-8">
                <div className="flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full shadow-[0_4px_10px_rgb(0,0,0,0.08)] border border-gray-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-medium text-gray-700 tracking-wide uppercase">
                    Advanced
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full shadow-[0_4px_10px_rgb(0,0,0,0.08)] border border-gray-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-medium text-gray-700 tracking-wide uppercase">
                    Complex
                  </span>
                </div>
              </div>
              
              {/* Prize Pool Card */}
              <div className="w-full bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Entry Fee</span>
                    <span className="text-lg font-bold text-amber-700">0.002 ETH</span>
                  </div>
                  <div className="h-px bg-gray-100"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Daily Reward</span>
                    <span className="text-lg font-bold text-green-600">0.005 ETH</span>
                  </div>
                </div>
              </div>

              {session ? (
                <button
                  onClick={checkEligibility}
                  disabled={isCheckingEligibility}
                  className={`w-full bg-amber-600 text-white text-xl font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                    isCheckingEligibility 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-amber-700 hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isCheckingEligibility ? 'Checking...' : (
                    <>
                      <BicepsFlexed className="mr-4 h-6 w-6" />
                      I&apos;m the Boss
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center">
                  <div className="text-amber-700 text-xl font-bold mb-2">
                    Please connect your wallet
                  </div>
                  <p className="text-gray-600 text-sm">
                    Connect your wallet to start your AI image generation journey
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <GenerationDialog isOpen={isDialogOpen} onClose={closeDialog} mode={dialogMode} />
      <StakeDialog isOpen={isStakeDialogOpen} onClose={closeStakeDialog} onSuccess={handleStakeSuccess} />
    </div>
  );
}