import { motion } from 'framer-motion';
import { useState } from 'react';

type ProjectDetail = {
  id: number;
  image: string;
  title: string;
  category: string;
  link: string;
};

type PortfolioItemProps = {
  project: ProjectDetail;
};

export function PortfolioItem({ project }: PortfolioItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <motion.div 
      className="project-card overflow-hidden rounded-lg shadow-md group relative h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Placeholder while image loads */}
      {!isLoaded && (
        <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      )}
      
      <img 
        src={project.image} 
        alt={`${project.title} - ${project.category}`} 
        className={`w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110 ${isLoaded ? 'block' : 'hidden'}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Overlay that appears on hover - for touch devices, appears on tap */}
      <div className="absolute inset-0 bg-primary bg-opacity-80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-center p-4">
          <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-white">{project.title}</h3>
          <p className="text-accent mb-2 sm:mb-3 text-sm sm:text-base">{project.category}</p>
          <a 
            href={project.link} 
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-accent text-accent hover:bg-accent hover:text-primary transition-colors inline-block text-xs sm:text-sm rounded"
            aria-label={`View ${project.title} project details`}
          >
            View Project
          </a>
        </div>
      </div>
    </motion.div>
  );
}
