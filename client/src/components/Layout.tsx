import React from "react";
import Navbar from "./Navbar";
import { Footer } from "@/sections/Footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      {/* Chat Support Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          className="w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:bg-opacity-90 transition-all" 
          onClick={() => alert("Chat support feature will be implemented in the future!")}
          aria-label="Chat support"
        >
          <i className="fas fa-comment-dots text-2xl"></i>
        </button>
      </div>
    </>
  );
};

export default Layout;
