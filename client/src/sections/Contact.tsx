import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact-form";
import { SocialIcons } from "@/components/SocialIcons";

export function Contact() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1 });

  const contactInfo = [
    {
      icon: "fas fa-envelope",
      title: "Email Us",
      detail: "hello@raketdev.com"
    },
    {
      icon: "fas fa-phone-alt",
      title: "Call Us",
      detail: "+1 (555) 123-4567"
    },
    {
      icon: "fas fa-map-marker-alt",
      title: "Location",
      detail: "Manila, Philippines"
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto" ref={ref}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <motion.h3 
              className="text-2xl font-semibold mb-6 text-foreground"
              variants={itemVariants}
            >
              Let's Discuss Your Project
            </motion.h3>

            <motion.p 
              className="mb-8 dark:text-gray-300"
              variants={itemVariants}
            >
              Ready to bring your digital vision to life? Contact us today to discuss how RaketDev can help create custom solutions tailored to your specific needs and goals.
            </motion.p>
            
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
            >
              {contactInfo.map((info, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <div className="text-accent text-xl mt-1 w-8">
                    <i className={info.icon}></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{info.title}</h4>
                    <p className="dark:text-gray-300">{info.detail}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <SocialIcons />
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
