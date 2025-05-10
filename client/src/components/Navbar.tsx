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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('nav') && !target.closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu when a link is clicked and scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        scrollPosition > 50 ? "bg-background dark:bg-primary shadow-md py-2 sm:py-3" : "py-3 sm:py-4"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a href="#" className="text-xl sm:text-2xl font-bold">
          <span className="text-foreground dark:text-white">Raket</span>
          <span className="text-accent">Dev</span>
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="hover:text-accent transition-colors dark:text-gray-200 dark:hover:text-accent"
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
          <ThemeToggle />
        </div>
        
        {/* Mobile Navigation Toggle */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button 
            className="text-foreground dark:text-white ml-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
          </button>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={`mobile-menu md:hidden bg-background dark:bg-primary shadow-lg absolute w-full transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 invisible"
        } overflow-hidden`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="block hover:text-accent transition-colors dark:text-gray-200"
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
