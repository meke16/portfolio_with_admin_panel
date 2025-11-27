import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminLayout } from "@/components/admin/admin-sidebar";
import { FolderKanban, Wrench, Mail, MailOpen, User } from "lucide-react";
import { Link } from "wouter";
import type { Project, Skill, ContactMessage, AdminInfo } from "@shared/schema";

export default function AdminDashboard() {
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: skills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
  });

  const { data: adminInfo, isLoading: adminInfoLoading } = useQuery<AdminInfo>({
    queryKey: ["/api/admin/info"],
  });

  const unreadMessages = messages?.filter((m) => !m.readStatus).length || 0;

  const stats = [
    {
      title: "Total Projects",
      value: projects?.length || 0,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Skills",
      value: skills?.length || 0,
      icon: Wrench,
      href: "/admin/skills",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Messages",
      value: messages?.length || 0,
      icon: Mail,
      href: "/admin/messages",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Unread",
      value: unreadMessages,
      icon: MailOpen,
      href: "/admin/messages",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back{adminInfo?.name ? `, ${adminInfo.name}` : ""}! Here's an overview of your portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <Card className="hover-elevate active-elevate-2 transition-all cursor-pointer" data-testid={`stat-card-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      {projectsLoading || skillsLoading || messagesLoading ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {adminInfoLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : adminInfo ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{adminInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Title</span>
                    <span className="font-medium">{adminInfo.title || "Not set"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{adminInfo.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bio</span>
                    <span className="font-medium">
                      {adminInfo.bio ? "Configured" : "Not set"}
                    </span>
                  </div>
                  <Link href="/admin/profile">
                    <span className="text-primary text-sm hover:underline mt-2 inline-block">
                      Edit Profile
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No profile configured yet.</p>
                  <Link href="/admin/profile">
                    <span className="text-primary hover:underline">Set up your profile</span>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.slice(0, 5).map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg border ${
                        !message.readStatus ? "bg-primary/5 border-primary/20" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{message.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {message.subject || message.message.slice(0, 50)}
                      </p>
                    </div>
                  ))}
                  <Link href="/admin/messages">
                    <span className="text-primary text-sm hover:underline mt-2 inline-block">
                      View all messages
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No messages yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <FolderKanban className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{project.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {project.technologies || "No technologies listed"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link href="/admin/projects">
                    <span className="text-primary text-sm hover:underline mt-2 inline-block">
                      View all projects
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No projects yet.</p>
                  <Link href="/admin/projects">
                    <span className="text-primary hover:underline">Add your first project</span>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Skills Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {skillsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : skills && skills.length > 0 ? (
                <div className="space-y-3">
                  {skills.slice(0, 6).map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-3"
                    >
                      {skill.logo ? (
                        <img
                          src={skill.logo}
                          alt={skill.name}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {skill.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="flex-1 text-sm">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                    </div>
                  ))}
                  <Link href="/admin/skills">
                    <span className="text-primary text-sm hover:underline mt-2 inline-block">
                      Manage skills
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No skills added yet.</p>
                  <Link href="/admin/skills">
                    <span className="text-primary hover:underline">Add your first skill</span>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
