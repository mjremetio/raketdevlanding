import { db } from "./db";
import { seedDatabase } from "./seed";
import { sql } from "drizzle-orm";

// Initialize database tables and seed initial data directly
export const initializeDatabase = async () => {
  try {
    console.log("Initializing database...");
    
    // Create sessions table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions (expire);
    `);
    
    // Create users table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create sections table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sections (
        id SERIAL PRIMARY KEY,
        section_id VARCHAR NOT NULL UNIQUE,
        title TEXT NOT NULL,
        subtitle TEXT,
        content JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW(),
        updated_by INTEGER REFERENCES users(id)
      );
    `);
    
    // Create hero_stats table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hero_stats (
        id SERIAL PRIMARY KEY,
        value TEXT NOT NULL,
        label TEXT NOT NULL,
        "order" INTEGER NOT NULL
      );
    `);
    
    // Create projects table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        link TEXT,
        description TEXT,
        "order" INTEGER NOT NULL
      );
    `);
    
    // Create services table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL,
        details JSONB NOT NULL,
        "order" INTEGER NOT NULL
      );
    `);
    
    // Create testimonials table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        content TEXT NOT NULL,
        "order" INTEGER NOT NULL
      );
    `);
    
    console.log("Database tables created successfully.");
    
    // Seed the database with initial data
    await seedDatabase();
    
    console.log("Database initialization completed successfully.");
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};