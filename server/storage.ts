import {
  adminUsers,
  adminInfo,
  projects,
  skills,
  contactMessages,
  type AdminUser,
  type InsertAdminUser,
  type AdminInfo,
  type InsertAdminInfo,
  type Project,
  type InsertProject,
  type Skill,
  type InsertSkill,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Admin Users
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;

  // Admin Info
  getAdminInfo(): Promise<AdminInfo | undefined>;
  createAdminInfo(info: InsertAdminInfo): Promise<AdminInfo>;
  updateAdminInfo(id: number, info: Partial<InsertAdminInfo>): Promise<AdminInfo | undefined>;

  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Skills
  getAllSkills(): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  // Contact Messages
  getAllMessages(): Promise<ContactMessage[]>;
  getMessage(id: number): Promise<ContactMessage | undefined>;
  createMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  deleteMessage(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Admin Users
  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [newUser] = await db.insert(adminUsers).values(user).returning();
    return newUser;
  }

  // Admin Info
  async getAdminInfo(): Promise<AdminInfo | undefined> {
    const [info] = await db.select().from(adminInfo).limit(1);
    return info || undefined;
  }

  async createAdminInfo(info: InsertAdminInfo): Promise<AdminInfo> {
    const [newInfo] = await db.insert(adminInfo).values(info).returning();
    return newInfo;
  }

  async updateAdminInfo(id: number, info: Partial<InsertAdminInfo>): Promise<AdminInfo | undefined> {
    const [updated] = await db
      .update(adminInfo)
      .set({ ...info, updatedAt: new Date() })
      .where(eq(adminInfo.id, id))
      .returning();
    return updated || undefined;
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return true;
  }

  // Skills
  async getAllSkills(): Promise<Skill[]> {
    return db.select().from(skills).orderBy(skills.category, skills.name);
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill || undefined;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [updated] = await db
      .update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSkill(id: number): Promise<boolean> {
    await db.delete(skills).where(eq(skills.id, id));
    return true;
  }

  // Contact Messages
  async getAllMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id));
    return message || undefined;
  }

  async createMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const [updated] = await db
      .update(contactMessages)
      .set({ readStatus: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMessage(id: number): Promise<boolean> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
