import { SocialIcons } from "@/components/SocialIcons";

export function Footer() {
  const quickLinks = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#contact", label: "Contact" }
  ];

  const serviceLinks = [
    { href: "#", label: "Web Development" },
    { href: "#", label: "Mobile Apps" },
    { href: "#", label: "Graphic Design" },
    { href: "#", label: "UI/UX Design" }
  ];

  return (
    <footer className="bg-gray-900 text-white py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center sm:text-left">
            <a href="#" className="text-xl md:text-2xl font-bold inline-block">
              <span className="text-white">Raket</span><span className="text-accent">Dev</span>
            </a>
            <p className="mt-3 md:mt-4 text-gray-300 text-sm md:text-base">
              Building tomorrow's digital solutions today with efficiency and excellence.
            </p>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Quick Links</h4>
            <ul className="space-y-1 md:space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-accent transition-colors text-sm md:text-base"
                    aria-label={`Go to ${link.label} section`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Services</h4>
            <ul className="space-y-1 md:space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-accent transition-colors text-sm md:text-base"
                    aria-label={`Learn more about ${link.label}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Connect</h4>
            <div className="mb-3 md:mb-4 flex justify-center sm:justify-start">
              <SocialIcons variant="footer" />
            </div>
            <p className="text-gray-300 text-sm md:text-base">
              hello@raketdev.com<br />
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} RaketDev. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4 md:space-x-6 flex">
            <a href="#" className="text-gray-400 hover:text-accent transition-colors text-xs md:text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-accent transition-colors text-xs md:text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
