import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
  const [activeTab, setActiveTab] = useState<string>("sections");
  
  // Fetch sections
  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ["/api/sections"],
    enabled: activeTab === "sections",
  });

  // Fetch hero stats
  const { data: heroStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/hero-stats"],
    enabled: activeTab === "heroStats",
  });

  // Fetch services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
    enabled: activeTab === "services",
  });

  // Fetch projects
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: activeTab === "projects",
  });

  // Fetch testimonials
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
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

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "sections":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Website Sections</h2>
            {sectionsLoading ? (
              <p className="dark:text-gray-300">Loading sections...</p>
            ) : (
              <div className="grid gap-4">
                {sections?.map((section: Section) => (
                  <div key={section.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <h3 className="text-lg font-medium mb-2 dark:text-white">{section.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Section ID: {section.sectionId}
                    </p>
                    {section.subtitle && (
                      <p className="dark:text-gray-300">Subtitle: {section.subtitle}</p>
                    )}
                    <div className="mt-2">
                      <button
                        className="px-3 py-1 bg-accent text-accent-foreground rounded-md text-sm hover:bg-opacity-90"
                        onClick={() => alert("Edit functionality will be implemented soon!")}
                      >
                        Edit Section
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "heroStats":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Hero Statistics</h2>
            {statsLoading ? (
              <p className="dark:text-gray-300">Loading hero stats...</p>
            ) : (
              <div className="grid gap-4">
                {heroStats?.map((stat: HeroStat) => (
                  <div key={stat.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium dark:text-white">{stat.value}</h3>
                        <p className="dark:text-gray-300">{stat.label}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-accent text-accent-foreground rounded-md text-sm hover:bg-opacity-90"
                          onClick={() => alert("Edit functionality will be implemented soon!")}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-opacity-90"
                          onClick={() => alert("Delete functionality will be implemented soon!")}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-opacity-90 w-full"
                  onClick={() => alert("Add functionality will be implemented soon!")}
                >
                  Add New Stat
                </button>
              </div>
            )}
          </div>
        );

      case "services":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Services</h2>
            {servicesLoading ? (
              <p className="dark:text-gray-300">Loading services...</p>
            ) : (
              <div className="grid gap-4">
                {services?.map((service: Service) => (
                  <div key={service.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium dark:text-white">{service.title}</h3>
                        <p className="dark:text-gray-300 mb-2">{service.description}</p>
                        <div className="space-y-1">
                          {service.details.map((detail, i) => (
                            <p key={i} className="text-sm dark:text-gray-400">• {detail}</p>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-accent text-accent-foreground rounded-md text-sm hover:bg-opacity-90"
                          onClick={() => alert("Edit functionality will be implemented soon!")}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-opacity-90"
                          onClick={() => alert("Delete functionality will be implemented soon!")}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-opacity-90 w-full"
                  onClick={() => alert("Add functionality will be implemented soon!")}
                >
                  Add New Service
                </button>
              </div>
            )}
          </div>
        );

      case "projects":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Portfolio Projects</h2>
            {projectsLoading ? (
              <p className="dark:text-gray-300">Loading projects...</p>
            ) : (
              <div className="grid gap-4">
                {projects?.map((project: Project) => (
                  <div key={project.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium dark:text-white">{project.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Category: {project.category}
                        </p>
                        {project.description && (
                          <p className="dark:text-gray-300 mt-2">{project.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-accent text-accent-foreground rounded-md text-sm hover:bg-opacity-90"
                          onClick={() => alert("Edit functionality will be implemented soon!")}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-opacity-90"
                          onClick={() => alert("Delete functionality will be implemented soon!")}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-opacity-90 w-full"
                  onClick={() => alert("Add functionality will be implemented soon!")}
                >
                  Add New Project
                </button>
              </div>
            )}
          </div>
        );

      case "testimonials":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Testimonials</h2>
            {testimonialsLoading ? (
              <p className="dark:text-gray-300">Loading testimonials...</p>
            ) : (
              <div className="grid gap-4">
                {testimonials?.map((testimonial: Testimonial) => (
                  <div key={testimonial.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium dark:text-white">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.position}
                        </p>
                        <p className="dark:text-gray-300 mt-2">"{testimonial.content}"</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-accent text-accent-foreground rounded-md text-sm hover:bg-opacity-90"
                          onClick={() => alert("Edit functionality will be implemented soon!")}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-opacity-90"
                          onClick={() => alert("Delete functionality will be implemented soon!")}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-opacity-90 w-full"
                  onClick={() => alert("Add functionality will be implemented soon!")}
                >
                  Add New Testimonial
                </button>
              </div>
            )}
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
          <div className="flex space-x-4">
            <Link href="/" className="px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:text-white">
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-opacity-90"
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <nav className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab("sections")}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "sections"
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    }`}
                  >
                    Sections
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("heroStats")}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "heroStats"
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    }`}
                  >
                    Hero Stats
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("services")}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "services"
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    }`}
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "projects"
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    }`}
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("testimonials")}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === "testimonials"
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    }`}
                  >
                    Testimonials
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
        <p className="text-lg dark:text-white">Loading...</p>
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