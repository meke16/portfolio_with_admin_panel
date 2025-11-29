import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/admin-sidebar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  Star,
  Loader2,
} from "lucide-react";
import type { Project } from "@shared/schema";

// --- Form Schema ---
const projectFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(), // now array of URLs
  url: z.string().optional(),
  githubUrl: z.string().optional(),
  technologies: z.string().optional(),
  featured: z.boolean().default(false),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

export default function AdminProjects() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [newImageUrl, setNewImageUrl] = useState("");

  // --- Fetch Projects ---
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [],
      url: "",
      githubUrl: "",
      technologies: "",
      featured: false,
    },
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormData) =>
      apiRequest("POST", "/api/admin/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Created",
        description: "The project has been added successfully.",
      });
      closeDialog();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProjectFormData }) =>
      apiRequest("PUT", `/api/admin/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Updated",
        description: "The project has been updated successfully.",
      });
      closeDialog();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update project.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) =>
      apiRequest("DELETE", `/api/admin/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Deleted",
        description: "The project has been removed.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    },
  });

  // --- Dialog Handlers ---
  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    // Normalize project.image to a string[] for the form
    const normalizedImages = Array.isArray(project.image)
      ? project.image
      : project.image
      ? [String(project.image)]
      : [];

    form.reset({
      title: project.title,
      description: project.description || "",
      images: normalizedImages,
      url: project.url || "",
      githubUrl: project.githubUrl || "",
      technologies: project.technologies || "",
      featured: project.featured || false,
    });

    setNewImageUrl("");
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProject(null);
    form.reset();
    setNewImageUrl("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    form.reset();
    setNewImageUrl("");
  };

  const onSubmit = (data: ProjectFormData) => {
    const payload = {
      ...data,
      image: data.images, // your backend expects JSONB column `image`
    };
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  console.log(projects);
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header + Add Button */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your portfolio projects
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-2xl max-h-[90vh] overflow-y-auto"
              aria-describedby=""
            >
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Edit Project" : "Add New Project"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Project name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your project..."
                            {...field}
                            className="min-h-[100px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Images */}
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Images</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="https://example.com/image.jpg"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  if (newImageUrl.trim()) {
                                    const updated = [
                                      ...(field.value || []),
                                      newImageUrl.trim(),
                                    ];
                                    field.onChange(updated); // ✅ Updates form field
                                    setNewImageUrl("");
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(field.value || []).map((url, idx) => (
                                <Badge
                                  key={idx}
                                  className="flex items-center gap-1"
                                >
                                  {url}
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                      const updated = (
                                        field.value || []
                                      ).filter((_, i) => i !== idx);
                                      field.onChange(updated); // ✅ Updates form field
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* URLs */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Live URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://myproject.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="githubUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://github.com/user/repo"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Technologies */}
                  <FormField
                    control={form.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technologies</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="React, Node.js, PostgreSQL"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated list of technologies
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Featured */}
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Featured Project</FormLabel>
                          <FormDescription>
                            Featured projects appear prominently on your
                            portfolio
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeDialog}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : editingProject ? (
                        "Update Project"
                      ) : (
                        "Create Project"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Project List */}
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardContent className="p-6 flex gap-4">
                  {Array.isArray(project.image) && project.image.length > 0 ? (
                    <img
                      src={project.image[0]}
                      alt={project.title}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <Badge className="bg-yellow-500 text-yellow-950">
                            <Star className="w-3 h-3 mr-1 fill-current" />{" "}
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {project.url && (
                          <Button asChild variant="ghost" size="icon">
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button asChild variant="ghost" size="icon">
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(project)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(project.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {project.description || "No description"}
                    </p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.split(",").map((tech, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No projects yet.</p>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" /> Add Your First Project
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation */}
        <AlertDialog
          open={deleteId !== null}
          onOpenChange={() => setDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this project? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
