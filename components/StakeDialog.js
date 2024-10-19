import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import witbABI from '../contracts/abi/witb.json'

// Assuming you have the contract address in an environment variable or config file
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

export default function StakeDialog({ isOpen, onClose, onSuccess }) {
  const [isStaking, setIsStaking] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const { address } = useAccount()

  const { writeContract, data: hash } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const handleStake = async () => {
    setIsStaking(true);
    try {
      const today = new Date().toLocaleString('en-GB', { timeZone: 'GMT', day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('');
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: witbABI,
        functionName: 'participate',
        args: [BigInt(today)],
        value: parseEther('0.01'), // Assuming STAKE_AMOUNT is 0.01 ETH
      })
    } catch (error) {
      console.error('Error during staking process:', error);
      alert("An error occurred during the staking process. Please try again.");
      setIsStaking(false);
    }
  };

  useEffect(() => {
    if (isConfirmed && !transactionComplete) {
      setTransactionComplete(true);
      updateUserStatus();
    }
  }, [isConfirmed]);

  const updateUserStatus = async () => {
    try {
      const today = new Date().toLocaleString('en-GB', { timeZone: 'GMT', day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('');
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
        onClose();
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert("Staking was successful, but there was an error updating your status. Please contact support.");
    } finally {
      setIsStaking(false);
      setTransactionComplete(false);
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
            disabled={isStaking || isConfirming}
            className="bg-amber-700 text-white hover:bg-amber-600"
          >
            {isStaking || isConfirming ? 'Staking...' : 'Stake Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
