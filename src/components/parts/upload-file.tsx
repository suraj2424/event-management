import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface UploadFileProps {
  onChange: (files: FileList | null) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
}

export const UploadFile: React.FC<UploadFileProps> = ({ onChange, multiple = false, accept = 'image/*', label = 'Upload File' }) => {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).map(file => file.name);
      setFileNames(fileArray);
      onChange(files); // pass files to parent component
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <div className="flex space-x-4 items-center">
        <label htmlFor="file-upload">
          <label htmlFor="file-upload">
            <Button variant="outline">
              {multiple ? 'Upload Files' : 'Upload File'}
            </Button>
          </label>
        </label>
        {fileNames.length > 0 && (
          <div className="text-sm">
            {fileNames.join(', ')}
          </div>
        )}
      </div>
      {fileNames.length === 0 && (
        <div className="text-sm text-gray-500">No file selected.</div>
      )}
    </div>
  );
};
