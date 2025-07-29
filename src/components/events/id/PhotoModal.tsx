// components/events/id/PhotoModal.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface PhotoModalProps {
  photo: string | null;
  onClose: () => void;
  alt?: string;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ 
  photo, 
  onClose, 
  alt = "Event photo" 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('modal-backdrop')) {
        onClose();
      }
    };

    if (photo) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [photo, onClose]);

  // Reset states when photo changes
  useEffect(() => {
    if (photo) {
      setIsLoading(true);
      setIsZoomed(false);
      setImageError(false);
    }
  }, [photo]);

  const handleDownload = async () => {
    if (!photo) return;
    
    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `event-photo-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="modal-backdrop absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div className="relative z-10 w-full h-full max-w-7xl max-h-screen p-4 flex flex-col">
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-4 bg-background/10 backdrop-blur-md rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleZoom}
              className="text-white hover:bg-white/20 transition-colors"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? (
                <ZoomOut className="h-5 w-5" />
              ) : (
                <ZoomIn className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="text-white hover:bg-white/20 transition-colors"
              aria-label="Download image"
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Image container */}
        <div className="flex-1 relative flex items-center justify-center">
          {imageError ? (
            <div className="text-center text-white">
              <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-muted/20 flex items-center justify-center">
                <X className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium mb-2">Failed to load image</p>
              <p className="text-sm text-white/70">The image could not be displayed</p>
            </div>
          ) : (
            <div 
              className={`relative w-full h-full transition-transform duration-300 cursor-pointer ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              onClick={toggleZoom}
            >
              {/* Loading skeleton */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-lg bg-muted/20 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                </div>
              )}

              <Image 
                src={photo} 
                alt={alt}
                fill 
                sizes="100vw"
                className={`object-contain transition-opacity duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setImageError(true);
                }}
                priority
              />
            </div>
          )}
        </div>

        {/* Footer with image info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-white/70">
            Click image to {isZoomed ? 'zoom out' : 'zoom in'} • Press ESC to close
          </p>
        </div>
      </div>

      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .modal-backdrop {
            background: rgba(0, 0, 0, 0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoModal;