import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-amber-100 text-amber-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold font-mono">
          <Link href="/">
            WhoIsTheBoss
          </Link>
        </div>
        
        <ul className="flex space-x-6">
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
          <li>
            <Link href="/profile" className="hover:text-amber-700 transition-colors">
              Profile
            </Link>
          </li>
        </ul>
        
        <button className="bg-amber-700 text-amber-100 px-4 py-2 rounded-md hover:bg-amber-800 transition-colors">
          Connect Wallet
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
