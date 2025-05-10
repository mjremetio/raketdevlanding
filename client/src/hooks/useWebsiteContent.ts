import { useQuery } from "@tanstack/react-query";

export interface Section {
  id: number;
  sectionId: string;
  title: string;
  subtitle: string | null;
  content: any;
  updatedAt: string;
}

export interface HeroStat {
  id: number;
  value: string;
  label: string;
  order: number;
}

export interface Service {
  id: number;
  title: string;
  icon: string;
  description: string;
  details: string[];
  order: number;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  link: string | null;
  description: string | null;
  order: number;
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  content: string;
  order: number;
}

export interface WebsiteContent {
  sections: Record<string, Section>;
  heroStats: HeroStat[];
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
}

// Hook for fetching all website content
export function useWebsiteContent() {
  // Fetch sections
  const { data: sectionsData = [], isLoading: sectionsLoading } = useQuery<Section[]>({
    queryKey: ["/api/sections"],
  });

  // Format sections data into a more usable format
  const sections = sectionsData.reduce<Record<string, Section>>((acc, section) => {
    acc[section.sectionId] = section;
    return acc;
  }, {});

  // Fetch hero stats
  const { data: heroStats = [], isLoading: statsLoading } = useQuery<HeroStat[]>({
    queryKey: ["/api/hero-stats"],
  });

  // Fetch services
  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Fetch testimonials
  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const isLoading = 
    sectionsLoading || 
    statsLoading || 
    servicesLoading || 
    projectsLoading || 
    testimonialsLoading;

  return {
    content: {
      sections,
      heroStats,
      services,
      projects,
      testimonials
    } as WebsiteContent,
    isLoading
  };
}

// Hook for fetching a specific section
export function useSection(sectionId: string) {
  return useQuery<Section>({
    queryKey: [`/api/sections/${sectionId}`],
  });
}