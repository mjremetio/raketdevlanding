import { db } from "./db";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { seedDatabase } from "./seed";

// Run migrations and seed database
export const runMigrations = async () => {
  try {
    console.log("Creating database tables if they don't exist...");
    
    // Run migrations to create tables
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log("Database migration completed.");
    
    // Seed the database with initial data
    await seedDatabase();
    
    console.log("Database setup completed successfully.");
  } catch (error) {
    console.error("Error during database migration:", error);
    throw error;
  }
};