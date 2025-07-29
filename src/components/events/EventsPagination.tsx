// components/events/EventsPagination.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const EventsPagination: React.FC<EventsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i)}
            disabled={disabled}
            className="w-10 h-10"
          >
            {i}
          </Button>
        );
      }
    } else {
      // Show truncated pagination
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={disabled}
          className="w-10 h-10"
        >
          1
        </Button>
      );

      if (currentPage > 3) {
        pages.push(
          <span key="left-ellipsis" className="px-2 text-muted-foreground">
            ...
          </span>
        );
      }

      // Show current page and neighbors
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i)}
            disabled={disabled}
            className="w-10 h-10"
          >
            {i}
          </Button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="right-ellipsis" className="px-2 text-muted-foreground">
            ...
          </span>
        );
      }

      if (totalPages > 1) {
        pages.push(
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={disabled}
            className="w-10 h-10"
          >
            {totalPages}
          </Button>
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pagination">
      <Button 
        variant="outline" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        className="w-full sm:w-auto group"
      >
        <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Previous
      </Button>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">
          Page {currentPage} of {totalPages}
        </span>
        <div className="hidden sm:flex items-center gap-1">
          {renderPageNumbers()}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        className="w-full sm:w-auto group"
      >
        Next
        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>

      <style jsx>{`
        .pagination {
          animation: slideUp 0.5s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EventsPagination;