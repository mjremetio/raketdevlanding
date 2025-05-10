import { useQuery } from "@tanstack/react-query";
import { Section } from "@shared/schema";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Services } from "@/sections/Services";
import { Process } from "@/sections/Process";
import { Portfolio } from "@/sections/Portfolio";
import { Testimonials } from "@/sections/Testimonials";
import { Contact } from "@/sections/Contact";
import { CustomSection } from "@/sections/CustomSection";

export default function Home() {
  // Fetch all sections to identify custom ones
  const { data: sections = [] } = useQuery<Section[]>({
    queryKey: ["/api/sections"],
  });

  // Find all custom sections (not part of default sections)
  const customSections = sections.filter(section => 
    !['hero', 'about', 'services', 'process', 'portfolio', 'testimonials', 'contact'].includes(section.sectionId)
  );

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      {customSections.map(section => (
        <CustomSection key={section.sectionId} sectionId={section.sectionId} />
      ))}
      <Contact />
    </>
  );
}
