import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { motion } from "framer-motion";
import { TestimonialCard } from "@/components/testimonial-card";

export function Testimonials() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1 });
  
  const testimonials = [
    {
      id: 1,
      content: "RaketDev transformed our outdated website into a modern, user-friendly platform that's driven a 40% increase in user engagement. Their team was responsive, creative, and delivered exactly what we needed.",
      name: "Elena Rodriguez",
      position: "Marketing Director, TechSolutions Inc."
    },
    {
      id: 2,
      content: "The mobile app RaketDev built for us has received outstanding reviews from our customers. Their attention to detail and focus on user experience sets them apart from other development teams we've worked with.",
      name: "Marcus Chen",
      position: "CEO, FitLife Dynamics"
    },
    {
      id: 3,
      content: "RaketDev's branding and design work helped us stand out in a crowded market. Their team took the time to understand our vision and translated it into a visual identity that perfectly represents our company values.",
      name: "Sophia Williams",
      position: "Founder, EcoMotion"
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

  return (
    <section id="testimonials" className="py-20 bg-muted dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          What Our Clients Say
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
