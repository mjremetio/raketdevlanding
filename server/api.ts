import express, { Request, Response } from "express";
import { storage } from "./storage";
import { isAuthenticated, isAdmin } from "./auth";

export const registerApiRoutes = (app: express.Express) => {
  // User Management Routes
  app.get("/api/users", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password from response
      const sanitizedUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(sanitizedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.post("/api/users", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { username, password, isAdmin } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser({
        username,
        password,
        isAdmin: !!isAdmin,
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.put("/api/users/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { username, isAdmin } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if trying to update username and if it already exists
      if (username && username !== existingUser.username) {
        const userWithSameUsername = await storage.getUserByUsername(username);
        if (userWithSameUsername) {
          return res.status(400).json({ message: "Username already exists" });
        }
      }
      
      const updatedUser = await storage.updateUser(userId, {
        username,
        isAdmin: isAdmin !== undefined ? !!isAdmin : existingUser.isAdmin,
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  app.delete("/api/users/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Prevent self-deletion
      if (req.session.user && req.session.user.id === userId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      const success = await storage.deleteUser(userId);
      
      if (!success) {
        return res.status(404).json({ message: "User not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  
  // Section permissions routes
  app.get("/api/users/:userId/permissions", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const permissions = await storage.getUserSectionPermissions(userId);
      res.json(permissions);
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      res.status(500).json({ message: "Failed to fetch user permissions" });
    }
  });
  
  app.post("/api/users/:userId/permissions", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const { sectionId, canEdit } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if section exists
      const section = await storage.getSection(sectionId);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      const newPermission = await storage.addUserSectionPermission({
        userId,
        sectionId,
        canEdit: canEdit !== undefined ? !!canEdit : true,
      });
      
      res.status(201).json(newPermission);
    } catch (error) {
      console.error("Error adding permission:", error);
      res.status(500).json({ message: "Failed to add permission" });
    }
  });
  
  app.delete("/api/users/:userId/permissions/:sectionId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const { sectionId } = req.params;
      
      const success = await storage.removeUserSectionPermission(userId, sectionId);
      
      if (!success) {
        return res.status(404).json({ message: "Permission not found or could not be deleted" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error removing permission:", error);
      res.status(500).json({ message: "Failed to remove permission" });
    }
  });
  // ===== SITE SETTINGS API =====
  
  // Get all site settings
  app.get("/api/site-settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Error fetching site settings" });
    }
  });
  
  // Get site settings by category
  app.get("/api/site-settings/category/:category", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSiteSettingsByCategory(req.params.category);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings by category:", error);
      res.status(500).json({ message: "Error fetching site settings by category" });
    }
  });
  
  // Get specific site setting
  app.get("/api/site-settings/:key", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getSiteSetting(req.params.key);
      
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      res.json(setting);
    } catch (error) {
      console.error("Error fetching site setting:", error);
      res.status(500).json({ message: "Error fetching site setting" });
    }
  });
  
  // Create site setting (admin only)
  app.post("/api/site-settings", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { settingKey, settingValue, category } = req.body;
    const userId = req.session.user!.id;
    
    if (!settingKey || !settingValue || !category) {
      return res.status(400).json({ message: "Setting key, value, and category are required" });
    }
    
    // Check if setting with the same key already exists
    try {
      const existingSetting = await storage.getSiteSetting(settingKey);
      
      if (existingSetting) {
        return res.status(409).json({ message: "A setting with this key already exists" });
      }
      
      const newSetting = await storage.createSiteSetting({
        settingKey,
        settingValue,
        category,
        updatedBy: userId
      });
      
      res.status(201).json(newSetting);
    } catch (error) {
      console.error("Error creating site setting:", error);
      res.status(500).json({ message: "Error creating site setting" });
    }
  });
  
  // Update site setting (admin only)
  app.put("/api/site-settings/:key", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { settingValue } = req.body;
    const settingKey = req.params.key;
    const userId = req.session.user!.id;
    
    if (!settingValue) {
      return res.status(400).json({ message: "Setting value is required" });
    }
    
    try {
      const existingSetting = await storage.getSiteSetting(settingKey);
      
      if (!existingSetting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      const updatedSetting = await storage.updateSiteSetting(settingKey, settingValue, userId);
      
      res.json(updatedSetting);
    } catch (error) {
      console.error("Error updating site setting:", error);
      res.status(500).json({ message: "Error updating site setting" });
    }
  });
  
  // Delete site setting (admin only)
  app.delete("/api/site-settings/:key", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const result = await storage.deleteSiteSetting(req.params.key);
      
      if (result) {
        return res.status(200).json({ message: "Setting deleted successfully" });
      } else {
        return res.status(500).json({ message: "Failed to delete setting" });
      }
    } catch (error) {
      console.error("Error deleting site setting:", error);
      res.status(500).json({ message: "Error deleting site setting" });
    }
  });
  
  // ===== SECTIONS API =====
  
  // Get all sections
  app.get("/api/sections", async (req: Request, res: Response) => {
    try {
      const sections = await storage.getAllSections();
      res.json(sections);
    } catch (error) {
      console.error("Error fetching sections:", error);
      res.status(500).json({ message: "Error fetching sections" });
    }
  });
  
  // Create new section (admin only)
  app.post("/api/sections", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { sectionId, title, subtitle, content } = req.body;
    const userId = req.session.user!.id;
    
    if (!sectionId || !title) {
      return res.status(400).json({ message: "Section ID and title are required" });
    }
    
    // Check if section with the same ID already exists
    try {
      const existingSection = await storage.getSection(sectionId);
      if (existingSection) {
        return res.status(409).json({ message: "A section with this ID already exists" });
      }
      
      const newSection = await storage.createSection(
        {
          sectionId,
          title,
          subtitle: subtitle || null,
          content: content || {}
        },
        userId
      );
      
      res.status(201).json(newSection);
    } catch (error) {
      console.error("Error creating section:", error);
      res.status(500).json({ message: "Error creating section" });
    }
  });
  
  // Get section by ID
  app.get("/api/sections/:sectionId", async (req: Request, res: Response) => {
    try {
      const section = await storage.getSection(req.params.sectionId);
      
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      res.json(section);
    } catch (error) {
      console.error(`Error fetching section ${req.params.sectionId}:`, error);
      res.status(500).json({ message: "Error fetching section" });
    }
  });
  
  // Update section (admin only)
  app.put("/api/sections/:sectionId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { title, subtitle, content } = req.body;
    const userId = req.session.user!.id;
    
    try {
      const updatedSection = await storage.updateSection(
        req.params.sectionId,
        { title, subtitle, content },
        userId
      );
      
      if (!updatedSection) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      res.json(updatedSection);
    } catch (error) {
      console.error(`Error updating section ${req.params.sectionId}:`, error);
      res.status(500).json({ message: "Error updating section" });
    }
  });
  
  // Delete section (admin only)
  app.delete("/api/sections/:sectionId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const sectionId = req.params.sectionId;
    
    try {
      const success = await storage.deleteSection(sectionId);
      
      if (!success) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      res.json({ message: "Section deleted successfully" });
    } catch (error) {
      console.error(`Error deleting section ${sectionId}:`, error);
      res.status(500).json({ message: "Error deleting section" });
    }
  });
  
  // ===== HERO STATS API =====
  
  // Get all hero stats
  app.get("/api/hero-stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getHeroStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching hero stats:", error);
      res.status(500).json({ message: "Error fetching hero stats" });
    }
  });
  
  // Create new hero stat (admin only)
  app.post("/api/hero-stats", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { value, label, order } = req.body;
    
    if (!value || !label || order === undefined) {
      return res.status(400).json({ message: "Value, label, and order are required" });
    }
    
    try {
      const newStat = await storage.createHeroStat(value, label, order);
      res.status(201).json(newStat);
    } catch (error) {
      console.error("Error creating hero stat:", error);
      res.status(500).json({ message: "Error creating hero stat" });
    }
  });
  
  // Update hero stat (admin only)
  app.put("/api/hero-stats/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { value, label, order } = req.body;
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      const updatedStat = await storage.updateHeroStat(id, value, label, order);
      
      if (!updatedStat) {
        return res.status(404).json({ message: "Hero stat not found" });
      }
      
      res.json(updatedStat);
    } catch (error) {
      console.error(`Error updating hero stat ${id}:`, error);
      res.status(500).json({ message: "Error updating hero stat" });
    }
  });
  
  // Delete hero stat (admin only)
  app.delete("/api/hero-stats/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      const success = await storage.deleteHeroStat(id);
      
      if (!success) {
        return res.status(404).json({ message: "Hero stat not found" });
      }
      
      res.json({ message: "Hero stat deleted successfully" });
    } catch (error) {
      console.error(`Error deleting hero stat ${id}:`, error);
      res.status(500).json({ message: "Error deleting hero stat" });
    }
  });
  
  // ===== PROJECTS API =====
  
  // Get all projects
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Error fetching projects" });
    }
  });
  
  // Create new project (admin only)
  app.post("/api/projects", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { title, category, image, link, description, order } = req.body;
    
    if (!title || !category || !image || order === undefined) {
      return res.status(400).json({ message: "Title, category, image, and order are required" });
    }
    
    try {
      const newProject = await storage.createProject(title, category, image, link || null, description || null, order);
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Error creating project" });
    }
  });
  
  // Update project (admin only)
  app.put("/api/projects/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { title, category, image, link, description, order } = req.body;
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      const updatedProject = await storage.updateProject(id, {
        title,
        category,
        image,
        link,
        description,
        order,
      });
      
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      res.status(500).json({ message: "Error updating project" });
    }
  });
  
  // Delete project (admin only)
  app.delete("/api/projects/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      res.status(500).json({ message: "Error deleting project" });
    }
  });
  
  // ===== SERVICES API =====
  
  // Get all services
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Error fetching services" });
    }
  });
  
  // Create new service (admin only)
  app.post("/api/services", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { title, icon, description, details, order } = req.body;
    
    if (!title || !icon || !description || !details || !Array.isArray(details) || order === undefined) {
      return res.status(400).json({ message: "Title, icon, description, details array, and order are required" });
    }
    
    try {
      const newService = await storage.createService(title, icon, description, details, order);
      res.status(201).json(newService);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Error creating service" });
    }
  });
  
  // Update service (admin only)
  app.put("/api/services/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { title, icon, description, details, order } = req.body;
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      const updatedService = await storage.updateService(id, {
        title,
        icon,
        description,
        details,
        order,
      });
      
      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(updatedService);
    } catch (error) {
      console.error(`Error updating service ${id}:`, error);
      res.status(500).json({ message: "Error updating service" });
    }
  });
  
  // Delete service (admin only)
  app.delete("/api/services/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      const success = await storage.deleteService(id);
      
      if (!success) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error(`Error deleting service ${id}:`, error);
      res.status(500).json({ message: "Error deleting service" });
    }
  });
  
  // ===== TESTIMONIALS API =====
  
  // Get all testimonials
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });
  
  // Create new testimonial (admin only)
  app.post("/api/testimonials", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { name, position, content, order } = req.body;
    
    if (!name || !position || !content || order === undefined) {
      return res.status(400).json({ message: "Name, position, content, and order are required" });
    }
    
    try {
      const newTestimonial = await storage.createTestimonial(name, position, content, order);
      res.status(201).json(newTestimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Error creating testimonial" });
    }
  });
  
  // Update testimonial (admin only)
  app.put("/api/testimonials/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const { name, position, content, order } = req.body;
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      const updatedTestimonial = await storage.updateTestimonial(id, {
        name,
        position,
        content,
        order,
      });
      
      if (!updatedTestimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json(updatedTestimonial);
    } catch (error) {
      console.error(`Error updating testimonial ${id}:`, error);
      res.status(500).json({ message: "Error updating testimonial" });
    }
  });
  
  // Delete testimonial (admin only)
  app.delete("/api/testimonials/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      const success = await storage.deleteTestimonial(id);
      
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      console.error(`Error deleting testimonial ${id}:`, error);
      res.status(500).json({ message: "Error deleting testimonial" });
    }
  });
};