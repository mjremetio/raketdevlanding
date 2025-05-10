import { motion } from 'framer-motion';

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
  return (
    <motion.div 
      className="project-card overflow-hidden rounded-lg shadow-md group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img 
        src={project.image} 
        alt={`${project.title} - ${project.category}`} 
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-primary bg-opacity-80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-center p-4">
          <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
          <p className="text-accent mb-3">{project.category}</p>
          <a 
            href={project.link} 
            className="px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-primary transition-colors inline-block text-sm rounded"
          >
            View Project
          </a>
        </div>
      </div>
    </motion.div>
  );
}
