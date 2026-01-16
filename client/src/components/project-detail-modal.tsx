import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@shared/schema";
import React from "react";

interface ProjectDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export function ProjectDetailModal({ open, onOpenChange, project }: ProjectDetailModalProps) {
  if (!project) return null;
  const images = Array.isArray(project.image) ? project.image : project.image ? [project.image] : [];
  const technologies = project.technologies?.split(",").map((t) => t.trim()) || [];
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => { if (!open) setCurrent(0); }, [open]);

  const showArrows = images.length > 1;
  const goPrev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 z-50 flex flex-col max-w-none w-full h-full p-0 bg-background">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{project.title}</DialogTitle>
        </DialogHeader>
        {images.length > 0 && (
          <div className="relative flex-1 flex items-center justify-center bg-muted">
            {showArrows && (
              <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
            )}
            <img
              src={images[current]}
              alt={project.title + " image " + (current + 1)}
              className="object-contain max-h-[70vh] max-w-full mx-auto transition-all duration-300 shadow-lg rounded-lg"
              style={{ background: '#f3f4f6' }}
            />
            {showArrows && (
              <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            )}
            {showArrows && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <span key={idx} className={`w-2 h-2 rounded-full ${idx === current ? 'bg-primary' : 'bg-white/60'} border border-black/10`} />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto max-h-[30vh]">
          <p className="text-base text-muted-foreground whitespace-pre-line mb-4">
            {project.description || "No description available."}
          </p>
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            {project.url && (
              <Button asChild size="sm" className="flex-1">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" /> GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
