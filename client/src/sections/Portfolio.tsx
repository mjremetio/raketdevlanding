import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { motion } from "framer-motion";
import { PortfolioItem } from "@/components/portfolio-item";

export function Portfolio() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1 });
  
  const projects = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      title: "TechBazaar",
      category: "E-commerce Platform",
      link: "#"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      title: "FitTrack",
      category: "Fitness Mobile App",
      link: "#"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      title: "DataVision",
      category: "Analytics Dashboard",
      link: "#"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      title: "SavorBites",
      category: "Restaurant Website",
      link: "#"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1580130732478-4e339fb6836f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      title: "EcoMotion",
      category: "Brand Identity",
      link: "#"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      title: "LearnSync",
      category: "Education Platform",
      link: "#"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="portfolio" className="py-16 md:py-20 bg-background dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-8 md:mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          Recent Projects
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {projects.map((project) => (
            <PortfolioItem key={project.id} project={project} />
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-8 md:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a 
            href="#" 
            className="px-6 py-3 bg-foreground dark:bg-accent text-background dark:text-accent-foreground font-semibold rounded-md hover:bg-opacity-90 transition-all inline-block shadow-md hover:shadow-lg"
          >
            View All Projects
          </a>
        </motion.div>
      </div>
    </section>
  );
}
