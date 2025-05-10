import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { motion } from "framer-motion";

type ValueCardProps = {
  icon: string;
  title: string;
  description: string;
};

const ValueCard = ({ icon, title, description }: ValueCardProps) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center transition-all hover:shadow-lg">
    <div className="text-accent text-3xl mb-4">
      <i className={icon}></i>
    </div>
    <h3 className="text-xl font-semibold mb-3 dark:text-white">{title}</h3>
    <p className="dark:text-gray-300">{description}</p>
  </div>
);

export function About() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1 });

  const values = [
    {
      icon: "fas fa-rocket",
      title: "Innovation",
      description: "We constantly explore new technologies and approaches to deliver cutting-edge solutions."
    },
    {
      icon: "fas fa-check-circle",
      title: "Quality",
      description: "We maintain the highest standards in every line of code and pixel of design."
    },
    {
      icon: "fas fa-bolt",
      title: "Efficiency",
      description: "We work smart and fast, optimizing processes to deliver value within timelines."
    },
    {
      icon: "fas fa-users",
      title: "Collaboration",
      description: "We partner closely with clients, ensuring their vision drives everything we create."
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="about" className="py-20 bg-muted dark:bg-background dark:bg-opacity-95">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto" ref={ref}>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            The RaketDev Difference
          </motion.h2>
          
          <motion.p 
            className="text-lg mb-12 text-center dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            RaketDev comes from the Filipino word "raket" — signifying the hustle and resourcefulness that drives us. We bring this energy to every project, combining technical excellence with creative problem-solving to deliver exceptional digital solutions efficiently and effectively.
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ValueCard 
                  icon={value.icon} 
                  title={value.title} 
                  description={value.description} 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
