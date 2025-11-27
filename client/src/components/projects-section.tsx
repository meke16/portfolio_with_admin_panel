import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star } from "lucide-react";
import { useState } from "react";
import type { Project } from "@shared/schema";

interface ProjectsSectionProps {
  projects?: Project[];
  isLoading?: boolean;
  showFilter?: boolean;
}

export function ProjectsSection({ projects, isLoading, showFilter = true }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const allTechnologies = projects
    ? [...new Set(
        projects
          .flatMap((p) => p.technologies?.split(",").map((t) => t.trim()) || [])
          .filter(Boolean)
      )]
    : [];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects?.filter((p) =>
          p.technologies?.toLowerCase().includes(activeFilter.toLowerCase())
        );

  const featuredProjects = filteredProjects?.filter((p) => p.featured);
  const regularProjects = filteredProjects?.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="py-20 md:py-32 bg-muted/30"
      data-testid="section-projects"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-6" data-testid="text-projects-heading">
          My Projects
        </h2>
        <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
          A collection of my work showcasing various technologies and problem-solving approaches
        </p>

        {showFilter && allTechnologies.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12" data-testid="project-filters">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
              data-testid="filter-all"
            >
              All Projects
            </Button>
            {allTechnologies.slice(0, 8).map((tech) => (
              <Button
                key={tech}
                variant={activeFilter === tech ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(tech)}
                data-testid={`filter-${tech.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tech}
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <div className="space-y-12">
            {featuredProjects && featuredProjects.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  Featured Projects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} featured />
                  ))}
                </div>
              </div>
            )}

            {regularProjects && regularProjects.length > 0 && (
              <div>
                {featuredProjects && featuredProjects.length > 0 && (
                  <h3 className="text-xl font-semibold mb-6">All Projects</h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  const technologies = project.technologies?.split(",").map((t) => t.trim()) || [];

  return (
    <Card
      className={`overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 ${
        featured ? "border-primary/20" : ""
      }`}
      data-testid={`card-project-${project.id}`}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-display font-bold text-muted-foreground/30">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {featured && (
          <Badge className="absolute top-3 right-3 bg-yellow-500 text-yellow-950">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="font-semibold text-xl mb-2" data-testid={`text-project-title-${project.id}`}>
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description || "No description available."}
        </p>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{technologies.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 flex gap-3">
        {project.url && (
          <Button asChild size="sm" className="flex-1">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-project-live-${project.id}`}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </a>
          </Button>
        )}
        {project.githubUrl && (
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-project-github-${project.id}`}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
