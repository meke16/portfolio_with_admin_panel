import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users table for authentication
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin Info table for profile data
export const adminInfo = pgTable("admin_info", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  title: varchar("title", { length: 100 }),
  bio: text("bio"),
  email: varchar("email", { length: 150 }).notNull(),
  phones: jsonb("phones").$type<string[]>(),
  locations: jsonb("locations").$type<string[]>(),
  socials: jsonb("socials").$type<{ platform: string; url: string; icon?: string }[]>(),
  profileImage: text("profile_image"),
  heroImage: text("hero_image"),
  galleryImages: jsonb("gallery_images").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  image: jsonb("image").$type<string[]>(), 
  url: varchar("url", { length: 255 }),
  githubUrl: varchar("github_url", { length: 255 }),
  technologies: text("technologies"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Skills table
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  logo: text("logo"),
  category: varchar("category", { length: 50 }),
  proficiency: integer("proficiency").default(70),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact Messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 200 }),
  message: text("message").notNull(),
  readStatus: boolean("read_status").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertAdminInfoSchema = createInsertSchema(adminInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  readStatus: true,
  createdAt: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export type InsertAdminInfo = z.infer<typeof insertAdminInfoSchema>;
export type AdminInfo = typeof adminInfo.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type LoginCredentials = z.infer<typeof loginSchema>;
