import {
  users,
  sections,
  heroStats,
  projects,
  services,
  testimonials,
  siteSettings,
  userSectionPermissions,
  type User,
  type InsertUser,
  type UpdateUser,
  type Section,
  type InsertSection,
  type UpdateSection,
  type HeroStat,
  type Project,
  type Service,
  type Testimonial,
  type SiteSetting,
  type InsertSiteSetting,
  type UserSectionPermission,
  type InsertUserSectionPermission,
  UserRoles
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<UpdateUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  validateUserPassword(username: string, password: string): Promise<User | null>;
  updateUserLastLogin(id: number): Promise<void>;
  
  // User permissions operations
  getUserSectionPermissions(userId: number): Promise<UserSectionPermission[]>;
  getSectionPermissions(sectionId: string): Promise<UserSectionPermission[]>;
  addUserSectionPermission(permission: InsertUserSectionPermission): Promise<UserSectionPermission>;
  removeUserSectionPermission(userId: number, sectionId: string): Promise<boolean>;
  canUserEditSection(userId: number, sectionId: string): Promise<boolean>;
  
  // Sections operations
  getSection(sectionId: string): Promise<Section | undefined>;
  getAllSections(): Promise<Section[]>;
  createSection(section: InsertSection, userId: number): Promise<Section>;
  updateSection(sectionId: string, updates: UpdateSection, userId: number): Promise<Section | undefined>;
  deleteSection(sectionId: string): Promise<boolean>;
  
  // Site Settings operations
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingsByCategory(category: string): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSiteSetting(key: string, value: string, userId: number): Promise<SiteSetting | undefined>;
  deleteSiteSetting(key: string): Promise<boolean>;
  
  // Component-specific operations
  getHeroStats(): Promise<HeroStat[]>;
  createHeroStat(value: string, label: string, order: number): Promise<HeroStat>;
  updateHeroStat(id: number, value: string, label: string, order: number): Promise<HeroStat | undefined>;
  deleteHeroStat(id: number): Promise<boolean>;
  
  getProjects(): Promise<Project[]>;
  createProject(title: string, category: string, image: string, link: string | null, description: string | null, order: number): Promise<Project>;
  updateProject(id: number, updates: Partial<Omit<Project, 'id'>>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  getServices(): Promise<Service[]>;
  createService(title: string, icon: string, description: string, details: string[], order: number): Promise<Service>;
  updateService(id: number, updates: Partial<Omit<Service, 'id'>>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(name: string, position: string, content: string, order: number): Promise<Testimonial>;
  updateTestimonial(id: number, updates: Partial<Omit<Testimonial, 'id'>>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    
    return user;
  }
  
  async validateUserPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    return isPasswordValid ? user : null;
  }
  
  // Sections operations
  async getSection(sectionId: string): Promise<Section | undefined> {
    const [section] = await db
      .select()
      .from(sections)
      .where(eq(sections.sectionId, sectionId));
    return section;
  }
  
  async getAllSections(): Promise<Section[]> {
    return db.select().from(sections);
  }
  
  async createSection(section: InsertSection, userId: number): Promise<Section> {
    const [newSection] = await db
      .insert(sections)
      .values({
        ...section,
        updatedBy: userId,
      })
      .returning();
    
    return newSection;
  }
  
  async updateSection(sectionId: string, updates: UpdateSection, userId: number): Promise<Section | undefined> {
    const [updatedSection] = await db
      .update(sections)
      .set({
        ...updates,
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .where(eq(sections.sectionId, sectionId))
      .returning();
    
    return updatedSection;
  }
  
  async deleteSection(sectionId: string): Promise<boolean> {
    // Don't allow deletion of core sections
    const coreSections = ['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact'];
    if (coreSections.includes(sectionId)) {
      return false;
    }
    
    try {
      const result = await db
        .delete(sections)
        .where(eq(sections.sectionId, sectionId));
      
      // For PostgreSQL it will return a rowCount, for other databases we can check differently
      return result.rowCount ? result.rowCount > 0 : true;
    } catch (error) {
      console.error(`Error deleting section ${sectionId}:`, error);
      return false;
    }
  }
  
  // Site Settings operations
  async getSiteSettings(): Promise<SiteSetting[]> {
    return db.select().from(siteSettings);
  }
  
  async getSiteSettingsByCategory(category: string): Promise<SiteSetting[]> {
    return db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.category, category));
  }
  
  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.settingKey, key));
    return setting;
  }
  
  async createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [newSetting] = await db
      .insert(siteSettings)
      .values(setting)
      .returning();
    return newSetting;
  }
  
  async updateSiteSetting(key: string, value: string, userId: number): Promise<SiteSetting | undefined> {
    const [updatedSetting] = await db
      .update(siteSettings)
      .set({
        settingValue: value,
        updatedBy: userId,
        updatedAt: new Date()
      })
      .where(eq(siteSettings.settingKey, key))
      .returning();
    return updatedSetting;
  }
  
  async deleteSiteSetting(key: string): Promise<boolean> {
    try {
      const result = await db
        .delete(siteSettings)
        .where(eq(siteSettings.settingKey, key));
      
      return result.rowCount ? result.rowCount > 0 : true;
    } catch (error) {
      console.error(`Error deleting setting ${key}:`, error);
      return false;
    }
  }
  
  // Hero Stats operations
  async getHeroStats(): Promise<HeroStat[]> {
    return db
      .select()
      .from(heroStats)
      .orderBy(heroStats.order);
  }
  
  async createHeroStat(value: string, label: string, order: number): Promise<HeroStat> {
    const [stat] = await db
      .insert(heroStats)
      .values({
        value,
        label,
        order,
      })
      .returning();
    
    return stat;
  }
  
  async updateHeroStat(id: number, value: string, label: string, order: number): Promise<HeroStat | undefined> {
    const [updatedStat] = await db
      .update(heroStats)
      .set({
        value,
        label,
        order,
      })
      .where(eq(heroStats.id, id))
      .returning();
    
    return updatedStat;
  }
  
  async deleteHeroStat(id: number): Promise<boolean> {
    const result = await db
      .delete(heroStats)
      .where(eq(heroStats.id, id));
    
    return !!result;
  }
  
  // Projects operations
  async getProjects(): Promise<Project[]> {
    return db
      .select()
      .from(projects)
      .orderBy(projects.order);
  }
  
  async createProject(title: string, category: string, image: string, link: string | null, description: string | null, order: number): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values({
        title,
        category,
        image,
        link,
        description,
        order,
      })
      .returning();
    
    return project;
  }
  
  async updateProject(id: number, updates: Partial<Omit<Project, 'id'>>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id));
    
    return !!result;
  }
  
  // Services operations
  async getServices(): Promise<Service[]> {
    return db
      .select()
      .from(services)
      .orderBy(services.order);
  }
  
  async createService(title: string, icon: string, description: string, details: string[], order: number): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values({
        title,
        icon,
        description,
        details: details,
        order,
      })
      .returning();
    
    return service;
  }
  
  async updateService(id: number, updates: Partial<Omit<Service, 'id'>>): Promise<Service | undefined> {
    const [updatedService] = await db
      .update(services)
      .set(updates)
      .where(eq(services.id, id))
      .returning();
    
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    const result = await db
      .delete(services)
      .where(eq(services.id, id));
    
    return !!result;
  }
  
  // Testimonials operations
  async getTestimonials(): Promise<Testimonial[]> {
    return db
      .select()
      .from(testimonials)
      .orderBy(testimonials.order);
  }
  
  async createTestimonial(name: string, position: string, content: string, order: number): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values({
        name,
        position,
        content,
        order,
      })
      .returning();
    
    return testimonial;
  }
  
  async updateTestimonial(id: number, updates: Partial<Omit<Testimonial, 'id'>>): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db
      .update(testimonials)
      .set(updates)
      .where(eq(testimonials.id, id))
      .returning();
    
    return updatedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id));
    
    return !!result;
  }
}

export const storage = new DatabaseStorage();
