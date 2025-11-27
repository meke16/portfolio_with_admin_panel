import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { AdminInfo } from "@shared/schema";

interface GallerySectionProps {
  adminInfo?: AdminInfo | null;
  isLoading?: boolean;
}

export function GallerySection({ adminInfo, isLoading }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const images = adminInfo?.galleryImages || [];

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (selectedIndex === 0) {
      setSelectedIndex(images.length - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (selectedIndex === images.length - 1) {
      setSelectedIndex(0);
    }
  };

  return (
    <section
      id="gallery"
      className="py-20 md:py-32"
      data-testid="section-gallery"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-6" data-testid="text-gallery-heading">
          Gallery
        </h2>
        <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
          A visual journey through my work and inspirations
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : images.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square overflow-hidden rounded-lg bg-muted group focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid={`gallery-image-${index}`}
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </button>
              ))}
            </div>

            <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
              <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-0 bg-black/95">
                <div className="relative flex items-center justify-center min-h-[50vh]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                    onClick={closeLightbox}
                    data-testid="button-close-lightbox"
                  >
                    <X className="w-6 h-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                    onClick={goToPrevious}
                    data-testid="button-prev-image"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                    onClick={goToNext}
                    data-testid="button-next-image"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </Button>

                  {selectedIndex !== null && (
                    <img
                      src={images[selectedIndex]}
                      alt={`Gallery image ${selectedIndex + 1}`}
                      className="max-w-full max-h-[85vh] object-contain"
                      data-testid="lightbox-image"
                    />
                  )}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                    {selectedIndex !== null && `${selectedIndex + 1} / ${images.length}`}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No gallery images available.</p>
          </div>
        )}
      </div>
    </section>
  );
}
