import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";

const PgSession = connectPgSimple(session);

// Configure session middleware
export const configureSession = (app: express.Express) => {
  // Make sure to use secure cookies in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  app.use(
    session({
      store: new PgSession({
        pool: pool,
        tableName: 'sessions',
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || 'raketdev-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
      },
    })
  );
};

// Define session types
declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      isAdmin: boolean;
    };
  }
}

// Authentication middleware
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

// Admin authentication middleware
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
};

// Authentication routes
export const registerAuthRoutes = (app: express.Express) => {
  // Login route
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    try {
      const user = await storage.validateUserPassword(username, password);
      
      if (user) {
        // Set user in session
        req.session.user = {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin || false,
        };
        
        res.json({
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin || false,
        });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error during login" });
    }
  });
  
  // Get current user
  app.get("/api/auth/user", (req: Request, res: Response) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
  
  // Logout route
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Error during logout" });
      }
      
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
};