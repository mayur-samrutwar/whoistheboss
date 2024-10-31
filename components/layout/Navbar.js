import { useState } from 'react';
import Link from 'next/link';
import WalletAuth from '../WalletAuth';
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 mx-4 my-2 bg-amber-100 bg-opacity-80 backdrop-filter backdrop-blur-lg text-amber-900 p-4 rounded-2xl z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold font-mono">
          <Link href="/">
            WhoIsTheBoss
          </Link>
        </div>

        <ul className="flex space-x-6">
        <li>
            <Link href="#faq" className="hover:text-amber-700 transition-colors">
              FAQs
            </Link>
          </li>
          <li>
            <Link href="/contests" className="hover:text-amber-700 transition-colors">
              Contests
            </Link>
          </li>
          <li>
            <Link href="/leaderboard" className="hover:text-amber-700 transition-colors">
              Leaderboard
            </Link>
          </li>
        </ul>
        <WalletAuth />
      </div>
    </nav>
  );
};

export default Navbar;
