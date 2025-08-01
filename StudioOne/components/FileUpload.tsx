import React, { useCallback, useState } from 'react';
import { FinancialDocument } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFilesUpload: (files: FinancialDocument[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filePromises: Promise<FinancialDocument>[] = Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = (e.target?.result as string).split(',')[1];
          if (base64) {
             resolve({ name: file.name, type: file.type, base64 });
          } else {
             reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises)
      .then(docs => onFilesUpload(docs))
      .catch(error => console.error("Error processing files:", error));
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  return (
    <label 
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'}`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <UploadIcon />
        <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
        <p className="text-xs text-gray-400">PDF, PNG, JPG, JPEG</p>
      </div>
      <input 
        type="file" 
        className="hidden" 
        multiple 
        accept="application/pdf,image/png,image/jpeg" 
        onChange={(e) => handleFileChange(e.target.files)} 
      />
    </label>
  );
};

export default FileUpload;
