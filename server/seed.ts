import { db } from "./db";
import { storage } from "./storage";
import { users, sections, heroStats, projects, services, testimonials } from "@shared/schema";
import * as bcrypt from "bcryptjs";

// Initial sample data
const initialSections = [
  {
    sectionId: "hero",
    title: "Building Tomorrow's Digital Solutions Today",
    subtitle: "We deliver cutting-edge web and mobile applications with pixel-perfect designs",
    content: {
      description: "We deliver cutting-edge web and mobile applications with pixel-perfect designs that drive business growth."
    }
  },
  {
    sectionId: "about",
    title: "About RaketDev",
    subtitle: "Creative Digital Agency",
    content: {
      mainText: "RaketDev is a dynamic tech startup founded by a team of passionate developers and designers who believe in creating digital solutions that make a difference. With our combined expertise in various technologies and design principles, we bring your ideas to life with efficiency and excellence.",
      values: [
        {
          icon: "fas fa-lightbulb",
          title: "Innovation",
          description: "We stay ahead of industry trends to deliver cutting-edge solutions."
        },
        {
          icon: "fas fa-users",
          title: "Collaboration",
          description: "We work closely with our clients to ensure their vision becomes reality."
        },
        {
          icon: "fas fa-check-circle",
          title: "Quality",
          description: "We are committed to excellence in every aspect of our work."
        }
      ]
    }
  },
  {
    sectionId: "services",
    title: "Our Services",
    subtitle: "What We Offer",
    content: {
      description: "We provide comprehensive digital solutions tailored to your specific needs and goals."
    }
  },
  {
    sectionId: "process",
    title: "Our Process",
    subtitle: "How We Work",
    content: {
      description: "Our streamlined process ensures efficient delivery of high-quality solutions.",
      steps: [
        {
          number: 1,
          title: "Discovery",
          description: "We start by understanding your business, goals, and requirements in detail."
        },
        {
          number: 2,
          title: "Planning",
          description: "We create a strategic plan and roadmap for your project."
        },
        {
          number: 3,
          title: "Design",
          description: "Our designers create user-friendly interfaces and compelling visuals."
        },
        {
          number: 4,
          title: "Development",
          description: "Our developers bring the designs to life with clean, efficient code."
        },
        {
          number: 5,
          title: "Testing",
          description: "We thoroughly test to ensure quality and performance."
        },
        {
          number: 6,
          title: "Launch",
          description: "We deploy your project and provide ongoing support."
        }
      ]
    }
  },
  {
    sectionId: "portfolio",
    title: "Our Portfolio",
    subtitle: "Recent Projects",
    content: {
      description: "Take a look at some of our recent work that showcases our expertise and creativity."
    }
  },
  {
    sectionId: "testimonials",
    title: "Testimonials",
    subtitle: "What Our Clients Say",
    content: {
      description: "Don't just take our word for it. Here's what our clients have to say about working with us."
    }
  },
  {
    sectionId: "contact",
    title: "Get In Touch",
    subtitle: "Contact Us",
    content: {
      description: "Ready to bring your digital vision to life? Contact us today to discuss how RaketDev can help create custom solutions tailored to your specific needs and goals.",
      contactInfo: [
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
      ]
    }
  }
];

const initialHeroStats = [
  { value: "6+", label: "Years Experience", order: 1 },
  { value: "50+", label: "Projects Completed", order: 2 },
  { value: "30+", label: "Happy Clients", order: 3 },
  { value: "4", label: "Service Categories", order: 4 }
];

const initialServices = [
  {
    title: "Web App Development",
    icon: "fas fa-laptop-code",
    description: "Custom web applications designed to enhance your online presence and streamline business operations.",
    details: [
      "Responsive single-page applications",
      "Progressive web apps (PWAs)",
      "E-commerce solutions",
      "Custom CMS development",
      "API integration and development"
    ],
    order: 1
  },
  {
    title: "Mobile App Development",
    icon: "fas fa-mobile-alt",
    description: "Native and cross-platform mobile applications that deliver seamless user experiences across devices.",
    details: [
      "iOS and Android app development",
      "React Native cross-platform solutions",
      "App Store optimization",
      "Mobile UI/UX design",
      "Ongoing maintenance and updates"
    ],
    order: 2
  },
  {
    title: "Graphic Design",
    icon: "fas fa-palette",
    description: "Creative visual solutions that communicate your brand message effectively and leave a lasting impression.",
    details: [
      "Brand identity design",
      "Logo creation and refinement",
      "Marketing materials",
      "Social media graphics",
      "Print design"
    ],
    order: 3
  },
  {
    title: "Layout & UI/UX Design",
    icon: "fas fa-pencil-ruler",
    description: "User-centered interface designs that enhance usability and create engaging digital experiences.",
    details: [
      "User experience (UX) research",
      "Wireframing and prototyping",
      "Interface (UI) design",
      "Usability testing",
      "Design systems"
    ],
    order: 4
  }
];

const initialProjects = [
  {
    title: "Fitness Tracker App",
    category: "Mobile App",
    image: "/images/portfolio/project1.jpg",
    link: "https://example.com/project1",
    description: "A comprehensive fitness tracking application with workout plans, progress tracking, and social features.",
    order: 1
  },
  {
    title: "E-commerce Platform",
    category: "Web App",
    image: "/images/portfolio/project2.jpg",
    link: "https://example.com/project2",
    description: "A full-featured online store with product management, payments, and customer accounts.",
    order: 2
  },
  {
    title: "Restaurant Brand Identity",
    category: "Graphic Design",
    image: "/images/portfolio/project3.jpg",
    link: "https://example.com/project3",
    description: "Complete brand identity design for a high-end restaurant, including logo, menus, and marketing materials.",
    order: 3
  },
  {
    title: "Real Estate Listing Platform",
    category: "Web App",
    image: "/images/portfolio/project4.jpg",
    link: "https://example.com/project4",
    description: "A property listing website with advanced search features, virtual tours, and agent portals.",
    order: 4
  },
  {
    title: "Productivity Dashboard",
    category: "UI/UX Design",
    image: "/images/portfolio/project5.jpg",
    link: "https://example.com/project5",
    description: "A clean, intuitive dashboard design for a productivity application with task management and analytics.",
    order: 5
  },
  {
    title: "Financial Planning App",
    category: "Mobile App",
    image: "/images/portfolio/project6.jpg",
    link: "https://example.com/project6",
    description: "A mobile application for personal finance management with budgeting tools and investment tracking.",
    order: 6
  }
];

const initialTestimonials = [
  {
    name: "Sarah J.",
    position: "CEO at TechStart",
    content: "Working with RaketDev was a game-changer for our business. Their team delivered a custom web application that has streamlined our operations and improved our customer experience significantly.",
    order: 1
  },
  {
    name: "Michael R.",
    position: "Marketing Director",
    content: "The mobile app that RaketDev created for us exceeded our expectations. They truly understood our vision and translated it into an intuitive, feature-rich application that our users love.",
    order: 2
  },
  {
    name: "Elena T.",
    position: "Startup Founder",
    content: "RaketDev's design team gave our brand a complete makeover. The new identity perfectly reflects our values and has helped us connect better with our target audience.",
    order: 3
  },
  {
    name: "David L.",
    position: "Product Manager",
    content: "Their attention to detail and commitment to quality is impressive. The team at RaketDev delivered our project on time and on budget, and they were a pleasure to work with throughout the process.",
    order: 4
  }
];

// Seed the database
export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");
    
    // Check if admin user exists
    const existingUser = await storage.getUserByUsername("raketdev");
    
    if (!existingUser) {
      console.log("Creating default admin user...");
      await storage.createUser({
        username: "raketdev",
        password: "RaketDev2025!",
        isAdmin: true
      });
      console.log("Default admin user created.");
    } else {
      console.log("Admin user already exists, skipping user creation.");
    }
    
    // Seed sections
    for (const section of initialSections) {
      const existingSection = await storage.getSection(section.sectionId);
      
      if (!existingSection) {
        console.log(`Creating section: ${section.sectionId}`);
        await storage.createSection({
          sectionId: section.sectionId,
          title: section.title,
          subtitle: section.subtitle,
          content: section.content
        }, 1); // Default admin ID
      } else {
        console.log(`Section ${section.sectionId} already exists, skipping.`);
      }
    }
    
    // Seed hero stats
    const existingStats = await storage.getHeroStats();
    
    if (existingStats.length === 0) {
      console.log("Creating hero stats...");
      for (const stat of initialHeroStats) {
        await storage.createHeroStat(stat.value, stat.label, stat.order);
      }
      console.log("Hero stats created.");
    } else {
      console.log("Hero stats already exist, skipping.");
    }
    
    // Seed services
    const existingServices = await storage.getServices();
    
    if (existingServices.length === 0) {
      console.log("Creating services...");
      for (const service of initialServices) {
        await storage.createService(
          service.title,
          service.icon,
          service.description,
          service.details,
          service.order
        );
      }
      console.log("Services created.");
    } else {
      console.log("Services already exist, skipping.");
    }
    
    // Seed projects
    const existingProjects = await storage.getProjects();
    
    if (existingProjects.length === 0) {
      console.log("Creating projects...");
      for (const project of initialProjects) {
        await storage.createProject(
          project.title,
          project.category,
          project.image,
          project.link,
          project.description,
          project.order
        );
      }
      console.log("Projects created.");
    } else {
      console.log("Projects already exist, skipping.");
    }
    
    // Seed testimonials
    const existingTestimonials = await storage.getTestimonials();
    
    if (existingTestimonials.length === 0) {
      console.log("Creating testimonials...");
      for (const testimonial of initialTestimonials) {
        await storage.createTestimonial(
          testimonial.name,
          testimonial.position,
          testimonial.content,
          testimonial.order
        );
      }
      console.log("Testimonials created.");
    } else {
      console.log("Testimonials already exist, skipping.");
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};