import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FileUploadFieldProps {
  field: {
    name: string;
    value: File | FileList | null;
    onChange: (value: File | FileList) => void;
  };
  label: string;
  accept?: string;
  multiple?: boolean;
  icon?: React.ReactNode;
}

export function FileUploadField({ 
  field, 
  label, 
  accept = "image/*", 
  multiple = false,
  icon 
}: FileUploadFieldProps) {
  const inputId = `${field.name}-upload`;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (multiple) {
        field.onChange(files);
      } else {
        field.onChange(files[0]);
      }
    }
  };

  const getDisplayText = () => {
    if (!field.value) return null;
    
    if (multiple && field.value instanceof FileList) {
      return `${field.value.length} photo(s) selected`;
    }
    
    if (field.value instanceof File) {
      return field.value.name;
    }
    
    return null;
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(inputId)?.click()}
          >
            {icon || <Upload className="mr-2 h-4 w-4" />}
            {multiple ? "Choose Photos" : "Choose File"}
          </Button>
          <Input
            id={inputId}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={handleFileChange}
          />
          {getDisplayText() && (
            <span className="text-sm text-muted-foreground">
              {getDisplayText()}
            </span>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}