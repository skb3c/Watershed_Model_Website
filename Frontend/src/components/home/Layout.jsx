import { React, memo } from 'react'
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import Navbar from './Navbar';
import { Sidebar } from './Sidebar';
import Footer from './Footer';
import ChatBot from './ChatBot';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <SignedIn> */}
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 relative">
            <Sidebar />
            {/* <main className="flex-1 transition-all duration-300 pt-16"> */}
            <main className="flex-grow transition-all duration-300 pt-16">

              {children}
            </main>
          </div>
          <Footer />
          <ChatBot />
        </div>
      {/* </SignedIn> */}
      {/* <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <SignInButton />
        </div>
      </SignedOut> */}
    </div>
  )
}

export default memo(Layout);
