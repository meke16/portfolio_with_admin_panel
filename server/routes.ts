import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  insertAdminInfoSchema,
  insertProjectSchema,
  insertSkillSchema,
  insertContactMessageSchema,
  loginSchema,
  adminUsers,
} from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.SESSION_SECRET;

if (!JWT_SECRET) {
  throw new Error("SESSION_SECRET environment variable must be set");
}

interface AuthRequest extends Request {
  userId?: number;
}

// Auth middleware
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ============ PUBLIC ROUTES ============

  // Get public admin info
  app.get("/api/info", async (req, res) => {
    try {
      const info = await storage.getAdminInfo();
      if (!info) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(info);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Get all projects (public)
  app.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await storage.getAllProjects();
      res.json(allProjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get all skills (public)
  app.get("/api/skills", async (req, res) => {
    try {
      const allSkills = await storage.getAllSkills();
      res.json(allSkills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  // Submit contact message (public)
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createMessage(data);
      res.status(201).json({ success: true, id: message.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to submit message" });
    }
  });

  // ============ AUTH ROUTES ============

  // Check if admin setup is needed
  app.get("/api/auth/status", async (req, res) => {
    try {
      const allAdminUsers = await db.select().from(adminUsers);
      res.json({ setupNeeded: allAdminUsers.length === 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to check status" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getAdminUserByUsername(username);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, username: user.username });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Register (one-time setup - only allowed when no admin users exist)
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Check if any admin user already exists
      const existingAdmins = await storage.getAdminUserByUsername("admin");
      const hasExistingAdmin = existingAdmins !== undefined;
      
      // Only allow registration if no admins exist (first-time setup)
      const allAdminUsers = await db.select().from(adminUsers);
      if (allAdminUsers.length > 0) {
        return res.status(403).json({ error: "Registration is disabled. An admin account already exists." });
      }

      const { username, password } = loginSchema.parse(req.body);

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createAdminUser({ username, password: hashedPassword });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.status(201).json({ token, username: user.username });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // ============ ADMIN ROUTES (Protected) ============

  // Get admin info (for admin panel)
  app.get("/api/admin/info", authMiddleware, async (req, res) => {
    try {
      const info = await storage.getAdminInfo();
      res.json(info || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Create/Update admin info
  app.post("/api/admin/info", authMiddleware, async (req, res) => {
    try {
      const data = insertAdminInfoSchema.parse(req.body);
      const existing = await storage.getAdminInfo();

      if (existing) {
        const updated = await storage.updateAdminInfo(existing.id, data);
        return res.json(updated);
      }

      const info = await storage.createAdminInfo(data);
      res.status(201).json(info);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  app.put("/api/admin/info", authMiddleware, async (req, res) => {
    try {
      const data = insertAdminInfoSchema.partial().parse(req.body);
      const existing = await storage.getAdminInfo();

      if (!existing) {
        return res.status(404).json({ error: "Profile not found" });
      }

      const updated = await storage.updateAdminInfo(existing.id, data);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // ============ PROJECTS CRUD ============

  app.post("/api/admin/projects", authMiddleware, async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/admin/projects/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, data);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/admin/projects/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // ============ SKILLS CRUD ============

  app.post("/api/admin/skills", authMiddleware, async (req, res) => {
    try {
      const data = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(data);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create skill" });
    }
  });

  app.put("/api/admin/skills/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(id, data);

      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }

      res.json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update skill" });
    }
  });

  app.delete("/api/admin/skills/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSkill(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  // ============ MESSAGES ============

  app.get("/api/admin/messages", authMiddleware, async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.put("/api/admin/messages/:id/read", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markMessageAsRead(id);

      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to update message" });
    }
  });

  app.delete("/api/admin/messages/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMessage(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  return httpServer;
}
