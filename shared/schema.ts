import { pgTable, text, serial, integer, boolean, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users table for CRM access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Session storage for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Website section content storage
export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  sectionId: varchar("section_id").notNull().unique(), // Identifier like "hero", "about", etc
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: jsonb("content").notNull(), // JSON content specific to each section
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const insertSectionSchema = createInsertSchema(sections).pick({
  sectionId: true,
  title: true,
  subtitle: true,
  content: true,
});

export const updateSectionSchema = createInsertSchema(sections).omit({
  id: true,
  sectionId: true,
  updatedAt: true,
  updatedBy: true,
});

// Hero items like statistics
export const heroStats = pgTable("hero_stats", {
  id: serial("id").primaryKey(),
  value: text("value").notNull(), // "50+", "6+", etc.
  label: text("label").notNull(), // "Projects Completed", etc.
  order: integer("order").notNull(),
});

// Portfolio projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  link: text("link"),
  description: text("description"),
  order: integer("order").notNull(),
});

// Services
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon").notNull(),
  description: text("description").notNull(),
  details: jsonb("details").notNull(), // Array of service details
  order: integer("order").notNull(),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSection = z.infer<typeof insertSectionSchema>;
export type UpdateSection = z.infer<typeof updateSectionSchema>;
export type Section = typeof sections.$inferSelect;

export type HeroStat = typeof heroStats.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
