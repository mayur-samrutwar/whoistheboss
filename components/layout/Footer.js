import Link from 'next/link';
import {
    Twitter,
    Github,
    Mail,
    MessageCircle
  } from "lucide-react";

export default function Footer(){
    return (
    <footer className="w-full bg-amber-50">
        <div className="container mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-900">WhoIsTheBoss</h3>
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
                © 2024 WhoIsTheBoss. All rights reserved.
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
    )
}