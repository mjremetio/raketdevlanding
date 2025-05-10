import { useQuery } from "@tanstack/react-query";
import { Section } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface CustomSectionProps {
  sectionId: string;
}

export function CustomSection({ sectionId }: CustomSectionProps) {
  const { data: section, isLoading, isError } = useQuery<Section>({
    queryKey: [`/api/sections/${sectionId}`],
  });

  if (isLoading) {
    return (
      <section id={sectionId} className="py-16 px-4 sm:px-6 md:py-24">
        <div className="container mx-auto flex justify-center items-center min-h-[300px]">
          <Spinner className="h-8 w-8" />
        </div>
      </section>
    );
  }

  if (isError || !section) {
    return (
      <section id={sectionId} className="py-16 px-4 sm:px-6 md:py-24">
        <div className="container mx-auto">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Section content could not be loaded.
          </p>
        </div>
      </section>
    );
  }

  const { title, subtitle, content } = section;
  const sectionContent = content as any;
  
  return (
    <section 
      id={sectionId} 
      className={cn(
        "py-16 px-4 sm:px-6 md:py-24",
        sectionContent.backgroundColor ? `bg-[${sectionContent.backgroundColor}]` : ""
      )}
    >
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">{title}</h2>
          {subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300">{subtitle}</p>
          )}
        </div>
        
        <div 
          className="prose prose-lg dark:prose-invert mx-auto mt-8"
          dangerouslySetInnerHTML={{ __html: sectionContent.html || "" }}
        />
        
        {sectionContent.items && sectionContent.items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {sectionContent.items.map((item: any, index: number) => (
              <div 
                key={index} 
                className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
              >
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title || `Item ${index + 1}`} 
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                {item.title && (
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">{item.title}</h3>
                )}
                {item.description && (
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}