import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { ConversionFormat } from '../../types';
import Button from '../ui/Button';

interface FileUploaderProps {
  onFileSelected: (file: File, format: ConversionFormat) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ConversionFormat>('docx');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size exceeds 10MB limit.');
        return;
      }
      
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelected(selectedFile, format);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`p-8 border-2 border-dashed rounded-lg transition-all duration-300 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : selectedFile 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {!selectedFile ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive ? 
                'Drop the PDF file here' : 
                'Drag and drop a PDF file here, or click to select'
              }
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Maximum file size: 10MB
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-700 truncate" style={{ maxWidth: '250px' }}>
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button 
              onClick={removeFile} 
              className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select output format:
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="format"
              value="docx"
              checked={format === 'docx'}
              onChange={() => setFormat('docx')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Word Document (.docx)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="format"
              value="xlsx"
              checked={format === 'xlsx'}
              onChange={() => setFormat('xlsx')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Excel Spreadsheet (.xlsx)</span>
          </label>
        </div>
      </div>

      <div className="mt-6">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedFile}
          className="w-full"
        >
          Convert File
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;