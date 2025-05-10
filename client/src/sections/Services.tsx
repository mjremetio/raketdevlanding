import { useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { motion } from "framer-motion";
import { ServiceCard } from "@/components/service-card";

export function Services() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1 });
  
  const services = [
    {
      id: 1,
      icon: "fas fa-laptop-code",
      title: "Web App Development",
      description: "Custom, responsive web applications built with modern frameworks and best practices.",
      details: [
        "Frontend development with React, Vue, and Angular",
        "Backend services with Node.js, Python, or PHP",
        "API development and integration",
        "Progressive Web Applications (PWAs)",
        "E-commerce solutions"
      ]
    },
    {
      id: 2,
      icon: "fas fa-mobile-alt",
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android.",
      details: [
        "React Native and Flutter development",
        "Native iOS (Swift) and Android (Kotlin) development",
        "App Store and Google Play submission assistance",
        "Push notifications and real-time features",
        "Mobile app maintenance and updates"
      ]
    },
    {
      id: 3,
      icon: "fas fa-paint-brush",
      title: "Graphic Design",
      description: "Eye-catching visuals that strengthen your brand identity and messaging.",
      details: [
        "Logo design and brand identity",
        "Marketing materials and social media content",
        "Infographics and data visualization",
        "Illustrations and icons",
        "Print and digital advertising"
      ]
    },
    {
      id: 4,
      icon: "fas fa-layer-group",
      title: "Layout & UI/UX Design",
      description: "Intuitive, user-centered interfaces that deliver exceptional user experiences.",
      details: [
        "User research and persona development",
        "Wireframing and prototyping",
        "Responsive web and mobile app design",
        "Design systems creation",
        "Usability testing and iteration"
      ]
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
    <section id="services" className="py-16 md:py-20 bg-background dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-8 md:mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          Our Services
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
