import { motion } from "framer-motion";
import { PatternBackground } from "@/components/ui/pattern-background";

export function Hero() {
  return (
    <section id="hero" className="pt-32 pb-20 min-h-screen flex items-center relative bg-pattern dark:bg-opacity-5">
      <PatternBackground />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="text-foreground">Raket</span>
              <span className="text-accent">Dev</span>
            </h1>
          </motion.div>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-medium mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Building Tomorrow's Digital Solutions Today
          </motion.h2>
          
          <motion.p 
            className="text-lg mb-10 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            We deliver cutting-edge web and mobile applications with pixel-perfect designs that drive business growth.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <a 
              href="#services" 
              className="px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-md hover:bg-opacity-90 transition-all inline-block"
            >
              Explore Our Services
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
