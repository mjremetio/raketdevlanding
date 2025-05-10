import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { motion } from "framer-motion";

type ProcessStepProps = {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
};

const ProcessStep = ({ number, title, description, isLast = false }: ProcessStepProps) => (
  <div className="flex mb-12">
    <div className="flex-none">
      <div className="w-14 h-14 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xl font-bold z-10 relative">
        {number}
      </div>
      {!isLast && (
        <div className="h-full w-0.5 bg-accent ml-7 -mt-2 hidden md:block"></div>
      )}
    </div>
    <div className="ml-6">
      <h3 className="text-xl font-semibold mb-3 dark:text-white">{title}</h3>
      <p className="dark:text-gray-300">{description}</p>
    </div>
  </div>
);

export function Process() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1 });
  
  const steps = [
    {
      number: 1,
      title: "Discover",
      description: "We begin by understanding your business goals, target audience, and project requirements. Through collaborative discovery sessions, we define success metrics and project scope."
    },
    {
      number: 2,
      title: "Design",
      description: "Our design team creates wireframes and prototypes, refining the user experience and visual identity. We iterate based on your feedback until the design perfectly aligns with your vision."
    },
    {
      number: 3,
      title: "Develop",
      description: "Our development team builds your solution using modern technologies and best practices. Regular updates and quality assurance ensure the product meets all requirements."
    },
    {
      number: 4,
      title: "Deploy",
      description: "We launch your project with thorough testing and optimization. Our support doesn't end at deployment—we provide maintenance, updates, and guidance to ensure long-term success."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="process" className="py-20 bg-muted dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          Our Process
        </motion.h2>
        
        <div className="max-w-5xl mx-auto" ref={ref}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full">
              <motion.div 
                className="relative process-steps"
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                {steps.map((step, index) => (
                  <motion.div key={step.number} variants={itemVariants}>
                    <ProcessStep 
                      number={step.number} 
                      title={step.title} 
                      description={step.description} 
                      isLast={index === steps.length - 1}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
