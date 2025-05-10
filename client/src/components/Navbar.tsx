import { useState, useEffect } from "react";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header 
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        scrollPosition > 50 ? "bg-background shadow-md py-3" : "py-4"
      )}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold">
          <span className="text-foreground">Raket</span>
          <span className="text-accent">Dev</span>
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="hover:text-accent transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a 
            href="#contact" 
            className="px-5 py-2 rounded-md bg-accent text-accent-foreground hover:bg-opacity-90 transition-all font-medium"
          >
            Contact Us
          </a>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <div className="flex items-center md:hidden">
          <button 
            className="text-foreground mr-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
          </button>
          <ThemeToggle />
        </div>
        
        {/* Desktop Theme Toggle */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden bg-background shadow-lg absolute w-full transition-all duration-300 ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="container mx-auto px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="block hover:text-accent transition-colors"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <a 
            href="#contact" 
            className="block px-5 py-2 rounded-md bg-accent text-accent-foreground hover:bg-opacity-90 transition-all font-medium w-full text-center"
            onClick={closeMenu}
          >
            Contact Us
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
