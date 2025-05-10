import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { useEffect } from "react";

function App() {
  // Initialize theme once when app starts
  useEffect(() => {
    // Check if user has already set a preference
    const userTheme = localStorage.getItem("theme");
    
    if (userTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (userTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // Check system preference if no user preference is set
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Home />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
