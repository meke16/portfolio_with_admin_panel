import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Loader2, Plus, Trash2, User, Image, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import type { AdminInfo } from "@shared/schema";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  profileImage: z.string().optional(),
  heroImage: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface SocialLink {
  platform: string;
  url: string;
}

export default function AdminProfile() {
  const { toast } = useToast();
  const [phones, setPhones] = useState<string[]>([""]);
  const [locations, setLocations] = useState<string[]>([""]);
  const [socials, setSocials] = useState<SocialLink[]>([{ platform: "", url: "" }]);
  const [galleryImages, setGalleryImages] = useState<string[]>([""]);

  const { data: adminInfo, isLoading } = useQuery<AdminInfo>({
    queryKey: ["/api/admin/info"],
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      email: "",
      profileImage: "",
      heroImage: "",
    },
  });

  useEffect(() => {
    if (adminInfo) {
      form.reset({
        name: adminInfo.name || "",
        title: adminInfo.title || "",
        bio: adminInfo.bio || "",
        email: adminInfo.email || "",
        profileImage: adminInfo.profileImage || "",
        heroImage: adminInfo.heroImage || "",
      });
      setPhones(adminInfo.phones?.length ? adminInfo.phones : [""]);
      setLocations(adminInfo.locations?.length ? adminInfo.locations : [""]);
      setSocials(adminInfo.socials?.length ? adminInfo.socials : [{ platform: "", url: "" }]);
      setGalleryImages(adminInfo.galleryImages?.length ? adminInfo.galleryImages : [""]);
    }
  }, [adminInfo, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const payload = {
        ...data,
        phones: phones.filter(Boolean),
        locations: locations.filter(Boolean),
        socials: socials.filter((s) => s.platform && s.url),
        galleryImages: galleryImages.filter(Boolean),
      };
      return apiRequest(adminInfo ? "PUT" : "POST", "/api/admin/info", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/info"] });
      toast({
        title: "Profile Saved",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    saveMutation.mutate(data);
  };

  const addPhone = () => setPhones([...phones, ""]);
  const removePhone = (index: number) => setPhones(phones.filter((_, i) => i !== index));
  const updatePhone = (index: number, value: string) => {
    const updated = [...phones];
    updated[index] = value;
    setPhones(updated);
  };

  const addLocation = () => setLocations([...locations, ""]);
  const removeLocation = (index: number) => setLocations(locations.filter((_, i) => i !== index));
  const updateLocation = (index: number, value: string) => {
    const updated = [...locations];
    updated[index] = value;
    setLocations(updated);
  };

  const addSocial = () => setSocials([...socials, { platform: "", url: "" }]);
  const removeSocial = (index: number) => setSocials(socials.filter((_, i) => i !== index));
  const updateSocial = (index: number, field: "platform" | "url", value: string) => {
    const updated = [...socials];
    updated[index][field] = value;
    setSocials(updated);
  };

  const addGalleryImage = () => setGalleryImages([...galleryImages, ""]);
  const removeGalleryImage = (index: number) =>
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  const updateGalleryImage = (index: number, value: string) => {
    const updated = [...galleryImages];
    updated[index] = value;
    setGalleryImages(updated);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold" data-testid="text-profile-title">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and public profile
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Your name, title, and bio displayed on the public site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              data-testid="input-profile-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title / Tagline</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Full Stack Developer"
                              {...field}
                              data-testid="input-profile-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                            data-testid="input-profile-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell visitors about yourself..."
                            className="min-h-[120px] resize-none"
                            {...field}
                            data-testid="input-profile-bio"
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description about yourself (displayed on About page)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Images
                  </CardTitle>
                  <CardDescription>
                    Profile picture and hero background image URLs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/profile.jpg"
                            {...field}
                            data-testid="input-profile-image"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heroImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Background Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/hero.jpg"
                            {...field}
                            data-testid="input-hero-image"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Phone numbers and locations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <FormLabel>Phone Numbers</FormLabel>
                    {phones.map((phone, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={phone}
                          onChange={(e) => updatePhone(index, e.target.value)}
                          placeholder="+1 234 567 8900"
                          data-testid={`input-phone-${index}`}
                        />
                        {phones.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removePhone(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPhone}
                      data-testid="button-add-phone"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Phone
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <FormLabel>Locations</FormLabel>
                    {locations.map((location, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={location}
                          onChange={(e) => updateLocation(index, e.target.value)}
                          placeholder="San Francisco, CA"
                          data-testid={`input-location-${index}`}
                        />
                        {locations.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLocation(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLocation}
                      data-testid="button-add-location"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Location
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Social Links
                  </CardTitle>
                  <CardDescription>Your social media profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {socials.map((social, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={social.platform}
                        onChange={(e) => updateSocial(index, "platform", e.target.value)}
                        placeholder="Platform (e.g., GitHub)"
                        className="w-1/3"
                        data-testid={`input-social-platform-${index}`}
                      />
                      <Input
                        value={social.url}
                        onChange={(e) => updateSocial(index, "url", e.target.value)}
                        placeholder="https://github.com/username"
                        className="flex-1"
                        data-testid={`input-social-url-${index}`}
                      />
                      {socials.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSocial(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSocial}
                    data-testid="button-add-social"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Social Link
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Gallery Images
                  </CardTitle>
                  <CardDescription>Images for your portfolio gallery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => updateGalleryImage(index, e.target.value)}
                        placeholder="https://example.com/gallery-image.jpg"
                        data-testid={`input-gallery-image-${index}`}
                      />
                      {galleryImages.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addGalleryImage}
                    data-testid="button-add-gallery-image"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Gallery Image
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  data-testid="button-save-profile"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </AdminLayout>
  );
}
