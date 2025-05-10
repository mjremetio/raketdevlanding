import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { TestimonialEditor } from "@/components/admin/TestimonialEditor";
import { NewSectionEditor } from "@/components/admin/NewSectionEditor";
import { AccessibilitySettings } from "@/components/admin/AccessibilitySettings";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThemeToggleButton } from "@/components/admin/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Settings, Palette, Moon, Sun } from "lucide-react";

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

interface Section {
  id: number;
  sectionId: string;
  title: string;
  subtitle: string | null;
  content: any;
  updatedAt: string;
}

interface HeroStat {
  id: number;
  value: string;
  label: string;
  order: number;
}

interface Service {
  id: number;
  title: string;
  icon: string;
  description: string;
  details: string[];
  order: number;
}

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  link: string | null;
  description: string | null;
  order: number;
}

interface Testimonial {
  id: number;
  name: string;
  position: string;
  content: string;
  order: number;
}

// Admin Login Form Component
const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response;
    },
    onSuccess: () => {
      onLogin();
    },
    onError: (error) => {
      console.error("Login error:", error);
      setError("Invalid username or password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">RaketDev Admin Login</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-100">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 font-medium dark:text-white">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 font-medium dark:text-white">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-md hover:bg-opacity-90 transition-all"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
        
        <div className="mt-4 text-center">
          <Link href="/" className="text-accent hover:underline">
            Back to Website
          </Link>
        </div>
      </form>
    </div>
  );
};

// Admin Dashboard Component
const Dashboard = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("sections");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showNewSectionForm, setShowNewSectionForm] = useState<boolean>(false);
  const [newService, setNewService] = useState<Service | null>(null);
  const [newProject, setNewProject] = useState<Project | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<Testimonial | null>(null);
  const [newHeroStat, setNewHeroStat] = useState<HeroStat | null>(null);
  
  // Fetch sections
  const { data: sections = [], isLoading: sectionsLoading } = useQuery<Section[]>({
    queryKey: ["/api/sections"],
    enabled: activeTab === "sections",
  });

  // Fetch hero stats
  const { data: heroStats = [], isLoading: statsLoading } = useQuery<HeroStat[]>({
    queryKey: ["/api/hero-stats"],
    enabled: activeTab === "heroStats",
  });

  // Fetch services
  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    enabled: activeTab === "services",
  });

  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: activeTab === "projects",
  });

  // Fetch testimonials
  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    enabled: activeTab === "testimonials",
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return response;
    },
    onSuccess: () => {
      onLogout();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Delete section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      return await apiRequest("DELETE", `/api/sections/${sectionId}`);
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      
      toast({
        title: "Section Deleted",
        description: "The section has been deleted successfully",
      });
      
      // Reset active tab to sections if we were viewing the deleted section
      if (activeTab === activeSectionId) {
        setActiveTab("sections");
        setActiveSectionId(null);
      }
    },
    onError: (error: any) => {
      console.error("Error deleting section:", error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the section. It may be a core section that cannot be removed.",
        variant: "destructive",
      });
    }
  });
  
  const handleDeleteSection = (sectionId: string) => {
    if (confirm(`Are you sure you want to delete this section? This action cannot be undone.`)) {
      deleteSectionMutation.mutate(sectionId);
    }
  };

  // Create functions for adding new items
  const addNewService = () => {
    const newServiceData: Service = {
      id: 0, // Will be assigned by server
      title: "New Service",
      icon: "Code",
      description: "Service description",
      details: ["Detail 1", "Detail 2"],
      order: services.length + 1
    };
    setNewService(newServiceData);
    document.getElementById('new-service-modal')?.classList.remove('hidden');
  };

  const addNewProject = () => {
    const newProjectData: Project = {
      id: 0,
      title: "New Project",
      category: "Web Development",
      image: "",
      link: null,
      description: null,
      order: projects.length + 1
    };
    setNewProject(newProjectData);
    document.getElementById('new-project-modal')?.classList.remove('hidden');
  };

  const addNewTestimonial = () => {
    const newTestimonialData: Testimonial = {
      id: 0,
      name: "Client Name",
      position: "Client Position",
      content: "Client testimonial content",
      order: testimonials.length + 1
    };
    setNewTestimonial(newTestimonialData);
    document.getElementById('new-testimonial-modal')?.classList.remove('hidden');
  };

  const addNewHeroStat = () => {
    const newHeroStatData: HeroStat = {
      id: 0,
      value: "0+",
      label: "New Stat",
      order: heroStats.length + 1
    };
    setNewHeroStat(newHeroStatData);
    document.getElementById('new-hero-stat-modal')?.classList.remove('hidden');
  };

  const closeModal = (modalId: string) => {
    document.getElementById(modalId)?.classList.add('hidden');
  };

  // Render the appropriate content based on active tab
  const renderContent = () => {
    // If active tab is a custom section ID
    if (activeSectionId && !["sections", "heroStats", "services", "projects", "testimonials", "accessibility"].includes(activeTab)) {
      const section = sections.find(s => s.sectionId === activeSectionId);
      if (section) {
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">
                {section.title} <span className="text-sm text-gray-500 font-normal">Custom Section</span>
              </h2>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handleDeleteSection(section.sectionId)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Section
              </Button>
            </div>
            
            <div className="space-y-6">
              <SectionEditor key={section.id} section={section} />
            </div>
          </div>
        );
      }
    }
    
    // Standard tabs
    switch (activeTab) {
      case "sections":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">Website Sections</h2>
              <Button 
                onClick={() => setShowNewSectionForm(true)}
                className="bg-accent text-accent-foreground flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Section
              </Button>
            </div>

            {showNewSectionForm && (
              <div className="mb-8">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                  <NewSectionEditor 
                    onClose={() => setShowNewSectionForm(false)} 
                  />
                </div>
              </div>
            )}
            
            {sectionsLoading ? (
              <div className="flex justify-center p-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map((section) => (
                  <SectionEditor 
                    key={section.id} 
                    section={section} 
                  />
                ))}
              </div>
            )}
          </div>
        );

      case "heroStats":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Hero Statistics</h2>
            <div className="flex justify-end mb-4">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                onClick={addNewHeroStat}
              >
                <Plus className="h-4 w-4" />
                Add New Stat
              </Button>
            </div>
            
            {statsLoading ? (
              <div className="flex justify-center p-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <div className="space-y-4">
                {heroStats.map((stat) => (
                  <div key={stat.id} className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium dark:text-white">{stat.value}</h3>
                        <p className="dark:text-gray-300">{stat.label}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            if (confirm(`Delete stat ${stat.value}?`)) {
                              apiRequest("DELETE", `/api/hero-stats/${stat.id}`).then(() => {
                                queryClient.invalidateQueries({ queryKey: ["/api/hero-stats"] });
                                toast({
                                  title: "Stat deleted",
                                  description: "The stat has been deleted successfully"
                                });
                              });
                            }
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => {
                            // Show edit modal
                            setNewHeroStat(stat);
                            document.getElementById('new-hero-stat-modal')?.classList.remove('hidden');
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Modal for adding/editing hero stat */}
            <div id="new-hero-stat-modal" className="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">
                  {newHeroStat && newHeroStat.id ? 'Edit Stat' : 'Add New Stat'}
                </h3>
                
                {newHeroStat && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-white">Value</label>
                      <input 
                        type="text" 
                        value={newHeroStat.value}
                        onChange={(e) => setNewHeroStat({...newHeroStat, value: e.target.value})}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-white">Label</label>
                      <input 
                        type="text" 
                        value={newHeroStat.label}
                        onChange={(e) => setNewHeroStat({...newHeroStat, label: e.target.value})}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-white">Order</label>
                      <input 
                        type="number" 
                        value={newHeroStat.order}
                        onChange={(e) => setNewHeroStat({...newHeroStat, order: parseInt(e.target.value)})}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => closeModal('new-hero-stat-modal')}
                      >
                        Cancel
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const isNew = !newHeroStat.id;
                          const method = isNew ? "POST" : "PUT";
                          const url = isNew ? "/api/hero-stats" : `/api/hero-stats/${newHeroStat.id}`;
                          
                          apiRequest(method, url, {
                            value: newHeroStat.value,
                            label: newHeroStat.label,
                            order: newHeroStat.order
                          }).then(() => {
                            queryClient.invalidateQueries({ queryKey: ["/api/hero-stats"] });
                            toast({
                              title: isNew ? "Stat created" : "Stat updated",
                              description: `The stat has been ${isNew ? 'created' : 'updated'} successfully`
                            });
                            closeModal('new-hero-stat-modal');
                          }).catch(err => {
                            console.error("Error saving stat:", err);
                            toast({
                              title: "Error",
                              description: "Failed to save the stat",
                              variant: "destructive"
                            });
                          });
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "services":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Services</h2>
            <div className="flex justify-end mb-4">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                onClick={addNewService}
              >
                <Plus className="h-4 w-4" />
                Add New Service
              </Button>
            </div>
            
            {servicesLoading ? (
              <div className="flex justify-center p-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <div className="space-y-6">
                {services.map((service) => (
                  <ServiceEditor 
                    key={service.id} 
                    service={service}
                  />
                ))}
              </div>
            )}
            
            {/* Modal for adding new service */}
            <div id="new-service-modal" className="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold dark:text-white">Add New Service</h3>
                  <button 
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => closeModal('new-service-modal')}
                  >
                    ✕
                  </button>
                </div>
                
                {newService && (
                  <ServiceEditor 
                    service={newService} 
                    isNew={true} 
                    onDelete={() => closeModal('new-service-modal')}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Portfolio Projects</h2>
            <div className="flex justify-end mb-4">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                onClick={addNewProject}
              >
                <Plus className="h-4 w-4" />
                Add New Project
              </Button>
            </div>
            
            {projectsLoading ? (
              <div className="flex justify-center p-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((project) => (
                  <ProjectEditor
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            )}
            
            {/* Modal for adding new project */}
            <div id="new-project-modal" className="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold dark:text-white">Add New Project</h3>
                  <button 
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => closeModal('new-project-modal')}
                  >
                    ✕
                  </button>
                </div>
                
                {newProject && (
                  <ProjectEditor 
                    project={newProject} 
                    isNew={true} 
                    onDelete={() => closeModal('new-project-modal')}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Testimonials</h2>
            <div className="flex justify-end mb-4">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                onClick={addNewTestimonial}
              >
                <Plus className="h-4 w-4" />
                Add New Testimonial
              </Button>
            </div>
            
            {testimonialsLoading ? (
              <div className="flex justify-center p-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <div className="space-y-6">
                {testimonials.map((testimonial) => (
                  <TestimonialEditor
                    key={testimonial.id}
                    testimonial={testimonial}
                  />
                ))}
              </div>
            )}
            
            {/* Modal for adding new testimonial */}
            <div id="new-testimonial-modal" className="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold dark:text-white">Add New Testimonial</h3>
                  <button 
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => closeModal('new-testimonial-modal')}
                  >
                    ✕
                  </button>
                </div>
                
                {newTestimonial && (
                  <TestimonialEditor 
                    testimonial={newTestimonial} 
                    isNew={true} 
                    onDelete={() => closeModal('new-testimonial-modal')}
                  />
                )}
              </div>
            </div>
          </div>
        );
        
      case "accessibility":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">Accessibility Settings</h2>
            </div>
            <AccessibilitySettings />
          </div>
        );

      default:
        return <div>Select a tab to manage content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">RaketDev Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Logged in as: {user.username}
            </p>
          </div>
          <div className="flex space-x-4 items-center">
            <ThemeToggle />
            <Link href="/" className="px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:text-white">
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-opacity-90"
            >
              Logout
            </button>
          </div>
        </header>
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-100 dark:bg-gray-700">
                <h2 className="font-semibold dark:text-white">Dashboard Navigation</h2>
              </div>
              <div className="p-2">
                <nav className="space-y-4">
                  {/* Main Sections */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2 px-4">
                      General
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setActiveTab("sections")}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeTab === "sections"
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        }`}
                      >
                        All Sections
                      </button>
                      <button
                        onClick={() => setActiveTab("heroStats")}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeTab === "heroStats"
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        }`}
                      >
                        Hero Stats
                      </button>
                    </div>
                  </div>
                  
                  {/* Content Sections */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2 px-4">
                      Content
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setActiveTab("services")}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeTab === "services"
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        }`}
                      >
                        Services
                      </button>
                      <button
                        onClick={() => setActiveTab("projects")}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeTab === "projects"
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        }`}
                      >
                        Projects
                      </button>
                      <button
                        onClick={() => setActiveTab("testimonials")}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeTab === "testimonials"
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        }`}
                      >
                        Testimonials
                      </button>
                    </div>
                  </div>
                  
                  {/* Settings */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2 px-4">
                      Settings
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setActiveTab("accessibility")}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                          activeTab === "accessibility"
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                        }`}
                      >
                        <Palette className="h-4 w-4" />
                        Accessibility
                      </button>
                    </div>
                  </div>
                  
                  {/* Custom Sections */}
                  {sections.filter(section => !['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact'].includes(section.sectionId)).length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2 px-4">
                        Custom Sections
                      </h3>
                      <div className="space-y-1">
                        {sections
                          .filter(section => !['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact'].includes(section.sectionId))
                          .map(section => (
                            <div key={section.sectionId} className="flex items-center">
                              <button
                                onClick={() => {
                                  setActiveTab(section.sectionId);
                                  setActiveSectionId(section.sectionId);
                                }}
                                className={`flex-1 text-left px-4 py-2 rounded-md transition-colors ${
                                  activeTab === section.sectionId
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                                }`}
                              >
                                {section.title}
                              </button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 ml-1 text-gray-500 hover:text-red-500 dark:text-gray-400 hover:bg-transparent"
                                onClick={() => handleDeleteSection(section.sectionId)}
                                title="Delete Section"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Admin Component
export default function Admin() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is logged in
  const { data: user, refetch } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    throwOnError: false,
  });

  useEffect(() => {
    setIsLoading(false);
  }, [user]);

  const handleLogin = () => {
    refetch();
  };

  const handleLogout = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}