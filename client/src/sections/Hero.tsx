import { motion } from "framer-motion";
import { PatternBackground } from "@/components/ui/pattern-background";
import { useWebsiteContent, useSection } from "@/hooks/useWebsiteContent";

export function Hero() {
  // Fetch hero section content from database
  const { data: section, isLoading: sectionLoading } = useSection("hero");
  
  // Fetch hero stats from database
  const { content, isLoading: contentLoading } = useWebsiteContent();
  
  const isLoading = sectionLoading || contentLoading;
  
  // Default values in case data is still loading
  const title = section?.title || "Building Tomorrow's Digital Solutions Today";
  const description = section?.content?.description || 
    "We deliver cutting-edge web and mobile applications with pixel-perfect designs that drive business growth.";
  
  const heroStats = content.heroStats || [];

  return (
    <section id="hero" className="pt-24 md:pt-32 pb-16 md:pb-20 min-h-[90vh] md:min-h-screen flex items-center relative overflow-hidden">
      <PatternBackground />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="mb-6 md:mb-8 flex justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-foreground dark:text-white">Raket</span>
              <span className="text-accent">Dev</span>
            </h1>
          </motion.div>
          
          <motion.h2 
            className="text-xl sm:text-2xl md:text-3xl font-medium mb-4 md:mb-6 text-foreground dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className="text-base sm:text-lg mb-8 md:mb-10 text-foreground/80 dark:text-gray-300 px-4 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <a 
              href="#services" 
              className="px-6 sm:px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-md hover:bg-opacity-90 transition-all inline-block shadow-md hover:shadow-lg button-hover-effect"
            >
              Explore Our Services
            </a>
          </motion.div>
          
          {/* Hero Stats from database */}
          {heroStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0 }}
              className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {heroStats.map((stat) => (
                <div key={stat.id} className="text-center p-3 sm:p-4 rounded-lg bg-background dark:bg-primary/40 backdrop-blur-sm shadow-sm">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-accent mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm md:text-base text-foreground dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
