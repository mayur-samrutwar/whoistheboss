import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAppKit } from '@reown/appkit/react';

export default function WalletAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { data: session } = useSession();
  const { open } = useAppKit();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isConnected && !session) {
      handleAuth();
    }
  }, [isConnected]);

  const handleAuth = async () => {
    try {
      const message = `Sign this message to prove you own this wallet. Nonce: ${Date.now()}`;
      const signature = await signMessageAsync({ message });

      const response = await signIn('credentials', {
        address,
        signature,
        redirect: false,
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      console.log('Authenticated!');

      // Check if user exists in the database and add if not
      await ensureUserInDatabase(address);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleSignOut = async () => {
    await disconnect();
    await signOut();
  };

  const handleConnect = () => {
    open();
  };

  const buttonText = () => {
    if (session) {
      if (isHovering) {
        return 'Sign Out';
      }
      return `${session.address?.substring(0, 3)}...${session.address?.substring(session.address.length - 3)}`;
    }
    if (isConnected) {
      return 'Sign In';
    }
    return 'Connect Wallet';
  };

  return (
    <button
      className="relative inline-block group"
      onClick={session ? handleSignOut : isConnected ? handleAuth : handleConnect}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className="relative z-10 px-3.5 py-2 overflow-hidden font-medium leading-tight flex items-center justify-center text-amber-600 transition-colors duration-300 ease-out border-2 border-amber-600 rounded-lg group-hover:text-white group-hover:bg-amber-600">
        <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg"></span>
        <span className="absolute left-0 w-40 h-40 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-white group-hover:-rotate-180 ease"></span>
        <span className="relative text-base font-semibold">{buttonText()}</span>
      </span>
      <span
        className="absolute bottom-0 right-0 w-full h-9 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-amber-600 rounded-lg group-hover:mb-0 group-hover:mr-0"
        data-rounded="rounded-lg"
      ></span>
    </button>
  );
}

// Add this new function at the end of the file
async function ensureUserInDatabase(address) {
  try {
    const response = await fetch('/api/users/ensure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });
    if (!response.ok) {
      throw new Error('Failed to ensure user in database');
    }
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('Error ensuring user in database:', error);
  }
}
