import React from 'react';
import { Inter } from "next/font/google";
import ContextProvider from '@/context';
import Navbar from './Navbar';
import Footer from './Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <ContextProvider>{children}</ContextProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
