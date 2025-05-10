import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { useEffect } from "react";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import NotFound from "./pages/not-found";
import { SiteSettingsProvider } from "./components/SiteSettingsProvider";

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
        <SiteSettingsProvider />
        <Switch>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/">
            <Layout>
              <Home />
            </Layout>
          </Route>
          <Route>
            <Layout>
              <NotFound />
            </Layout>
          </Route>
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
