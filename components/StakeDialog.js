import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function StakeDialog({ isOpen, onClose, onSuccess }) {
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = async () => {
    setIsStaking(true);
    try {
      const simulatedStakeSuccess = true;

      if (simulatedStakeSuccess) {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const response = await fetch('/api/update-user-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contestId: today,
            staked: true,
          }),
        });

        if (response.ok) {
          onSuccess();
        } else {
          throw new Error('Failed to update user status');
        }
      } else {
        throw new Error('Staking failed');
      }
    } catch (error) {
      console.error('Error during staking process:', error);
      alert("An error occurred during the staking process. Please try again.");
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Stake to Play</DialogTitle>
          <DialogDescription>
            You need to stake tokens to participate in today&apos;s contest.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Button
            onClick={handleStake}
            disabled={isStaking}
            className="bg-amber-700 text-white hover:bg-amber-600"
          >
            {isStaking ? 'Staking...' : 'Stake Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
