import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Skill } from "@shared/schema";

const skillFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().optional(),
  category: z.string().optional(),
  proficiency: z.number().min(0).max(100).default(70),
});

type SkillFormData = z.infer<typeof skillFormSchema>;

export default function AdminSkills() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: "",
      logo: "",
      category: "",
      proficiency: 70,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SkillFormData) => {
      return apiRequest("POST", "/api/admin/skills", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Skill Added",
        description: "The skill has been added successfully.",
      });
      closeDialog();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add skill.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SkillFormData }) => {
      return apiRequest("PUT", `/api/admin/skills/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Skill Updated",
        description: "The skill has been updated successfully.",
      });
      closeDialog();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update skill.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Skill Deleted",
        description: "The skill has been removed.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete skill.",
        variant: "destructive",
      });
    },
  });

  const openEditDialog = (skill: Skill) => {
    setEditingSkill(skill);
    form.reset({
      name: skill.name,
      logo: skill.logo || "",
      category: skill.category || "",
      proficiency: skill.proficiency || 70,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSkill(null);
    form.reset({
      name: "",
      logo: "",
      category: "",
      proficiency: 70,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingSkill(null);
    form.reset();
  };

  const onSubmit = (data: SkillFormData) => {
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const categories = skills
    ? [...new Set(skills.map((s) => s.category || "Other"))]
    : [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className="text-3xl font-display font-bold"
              data-testid="text-skills-title"
            >
              Skills
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your technical skills and proficiencies
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} data-testid="button-add-skill">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSkill ? "Edit Skill" : "Add New Skill"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="React"
                            {...field}
                            data-testid="input-skill-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Frontend, Backend, DevOps, etc."
                            {...field}
                            data-testid="input-skill-category"
                          />
                        </FormControl>
                        <FormDescription>
                          Group similar skills together
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://cdn.example.com/react-logo.svg"
                            {...field}
                            data-testid="input-skill-logo"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proficiency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proficiency: {field.value}%</FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            min={0}
                            max={100}
                            step={5}
                            className="py-4"
                            data-testid="slider-skill-proficiency"
                          />
                        </FormControl>
                        <FormMessage />
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
                    <Button
                      type="submit"
                      disabled={isPending}
                      data-testid="button-save-skill"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : editingSkill ? (
                        "Update Skill"
                      ) : (
                        "Add Skill"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : skills && skills.length > 0 ? (
          <div className="space-y-8">
            {categories.map((category) => {
              const categorySkills = skills.filter(
                (s) => (s.category || "Other") === category
              );
              return (
                <div key={category}>
                  <h2 className="text-lg font-semibold mb-4">{category}</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill) => (
                      <Card
                        key={skill.id}
                        data-testid={`card-admin-skill-${skill.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {skill.logo ? (
                              <img
                                src={skill.logo}
                                alt={skill.name}
                                className="w-10 h-10 object-contain flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold text-primary">
                                  {skill.name.charAt(0)}
                                </span>
                              </div>
                            )}

                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-medium truncate">
                                  {skill.name}
                                </h3>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => openEditDialog(skill)}
                                    data-testid={`button-edit-skill-${skill.id}`}
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setDeleteId(skill.id)}
                                    data-testid={`button-delete-skill-${skill.id}`}
                                  >
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Proficiency</span>
                                  <span>{skill.proficiency}%</span>
                                </div>
                                <Progress
                                  value={skill.proficiency || 0}
                                  className="h-1.5"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No skills added yet.</p>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Skill
              </Button>
            </CardContent>
          </Card>
        )}

        <AlertDialog
          open={deleteId !== null}
          onOpenChange={() => setDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Skill</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this skill? This action cannot
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
