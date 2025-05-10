import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerApiRoutes } from "./api";
import { registerAuthRoutes, configureSession, isAuthenticated, isAdmin } from "./auth";
import { insertSectionSchema, updateSectionSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session and authentication
  configureSession(app);
  registerAuthRoutes(app);
  
  // Register API routes
  registerApiRoutes(app);
  
  // Section routes
  app.delete("/api/sections/:sectionId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { sectionId } = req.params;
      
      // Prevent deletion of core sections
      const result = await storage.deleteSection(sectionId);
      
      if (result) {
        return res.status(200).json({ message: "Section deleted successfully" });
      } else {
        return res.status(403).json({ message: "Cannot delete core sections" });
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      return res.status(500).json({ message: "Failed to delete section" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
