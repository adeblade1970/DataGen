
import React, { useState, useCallback } from 'react';
import { UploadCloudIcon, FileIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // a quick validation for file type
    if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setFileName(file.name);
        onFileSelect(file);
    } else {
        alert('Please upload a valid CSV or Excel file.');
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Step 1: Upload Your Data File</h2>
      <p className="text-slate-600 mb-6">Upload a CSV or Excel file to get started.</p>
      <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()} className="relative">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleChange}
        />
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
            dragActive ? 'border-blue-700 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloudIcon className="w-12 h-12 mb-4 text-slate-400" />
            <p className="mb-2 text-sm text-slate-500">
              <span className="font-semibold text-blue-700">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">CSV or XLSX (Excel)</p>
          </div>
        </label>
        {dragActive && (
          <div
            className="absolute inset-0 w-full h-full"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
      {fileName && (
        <div className="mt-6 text-left p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <FileIcon className="h-6 w-6 text-green-600 mr-3"/>
            <p className="text-sm text-green-800">Selected file: <span className="font-medium">{fileName}</span></p>
        </div>
      )}
    </div>
  );
};
