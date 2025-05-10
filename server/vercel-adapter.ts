import type { Request, Response } from 'express';
import express from 'express';
import { registerRoutes } from './routes';
import { serveStatic } from './vite';
import { configureSession, registerAuthRoutes } from './auth';
import { registerApiRoutes } from './api';
import { initializeDatabase } from './dbInit';

// Create an Express app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up session management for authentication
configureSession(app);

// Set up middleware for logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Register authentication routes
registerAuthRoutes(app);

// Register API routes for CRM content management
registerApiRoutes(app);

// Handle contact form submissions
app.post("/api/contact", (req, res) => {
  try {
    const { name, email, projectType, message } = req.body;
    
    // Here you would typically process the form data
    // For example, send an email, store in a database, etc.
    
    // For now, let's just log the form data and return a success message
    console.log("Contact form submission:", { name, email, projectType, message });
    
    res.status(200).json({ 
      success: true, 
      message: "Thank you for your message. We'll get back to you soon!" 
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({ 
      success: false, 
      message: "There was an error processing your request. Please try again." 
    });
  }
});

// Initialize database and server
const initServer = async () => {
  try {
    // Initialize database tables and seed initial data
    await initializeDatabase();
    console.log("Database setup completed successfully.");
    
    // Register routes
    const server = await registerRoutes(app);
    
    app.use((err: any, _req: Request, res: Response, _next: any) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // Serve static files in production
    serveStatic(app);
    
    return app;
  } catch (error) {
    console.error("Failed to initialize server:", error);
    throw error;
  }
};

// Export a handler function for serverless environments like Vercel
export default async function handler(req: Request, res: Response) {
  try {
    const serverApp = await initServer();
    serverApp(req, res);
  } catch (error) {
    console.error("Server initialization failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}