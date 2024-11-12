import React, { useEffect } from 'react';
import Image from 'next/image';

interface FullScreenImageModalProps {
  selectedPhoto: string | null;
  onClose: () => void;
}

const FullScreenImageModal: React.FC<FullScreenImageModalProps> = ({ selectedPhoto, onClose }) => {
  // Close modal when the escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!selectedPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose} // Close the modal when clicking outside the image
    >
      <div
        className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
      >
        <button
          className="absolute top-4 right-4 z-10 text-white bg-gray-800 p-2 rounded-full focus:outline-none"
          onClick={onClose} // Close button
        >
          ✕ {/* Close icon */}
        </button>
        <Image
          src={selectedPhoto}
          alt="Full image"
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default FullScreenImageModal;
