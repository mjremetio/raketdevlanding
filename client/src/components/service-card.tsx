import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ServiceDetail = {
  id: number;
  icon: string;
  title: string;
  description: string;
  details: string[];
};

type ServiceCardProps = {
  service: ServiceDetail;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className="bg-muted dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="p-5 sm:p-6 cursor-pointer"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        <div className="flex flex-col sm:flex-row sm:items-start">
          <div className="text-accent text-3xl mb-3 sm:mb-0 sm:mr-4 flex sm:block justify-center">
            <i className={service.icon}></i>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 dark:text-white text-center sm:text-left">{service.title}</h3>
            <p className="dark:text-gray-300 text-center sm:text-left">{service.description}</p>
          </div>
          <div className="hidden sm:block ml-auto">
            <motion.i 
              className="fas fa-chevron-down text-accent"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            ></motion.i>
          </div>
        </div>
        <div className="flex justify-center sm:hidden mt-3">
          <motion.i 
            className="fas fa-chevron-down text-accent"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          ></motion.i>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 sm:px-6 pb-5 sm:pb-6 bg-white dark:bg-gray-800"
          >
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <ul className="space-y-2 dark:text-gray-300">
                {service.details.map((detail, index) => (
                  <li key={index} className="flex">
                    <span className="text-accent mr-2 flex-shrink-0">•</span> 
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
