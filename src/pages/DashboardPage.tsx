import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FileUploader from '../components/conversion/FileUploader';
import FileHistory from '../components/conversion/FileHistory';
import { FileRecord, ConversionFormat } from '../types';
import { convertFile, saveFileRecord, uploadFile, getUserFiles } from '../services/fileService';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  
  useEffect(() => {
    const fetchFiles = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userFiles = await getUserFiles(currentUser.id);
        setFiles(userFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, [currentUser]);
  
  const handleFileSelected = async (file: File, format: ConversionFormat) => {
    if (!currentUser) return;
    
    setIsConverting(true);
    
    try {
      // Create a file record in the database
      const fileId = await saveFileRecord(
        currentUser.id,
        file.name,
        file.type,
        format
      );
      
      // Add a temporary record to the UI while processing
      setFiles(prevFiles => [
        {
          id: fileId,
          originalName: file.name,
          originalType: file.type,
          convertedFormat: format,
          createdAt: Date.now(),
          status: 'processing'
        },
        ...prevFiles
      ]);
      
      // Convert the file
      const convertedBlob = await convertFile(file, format);
      
      // Create a file from the blob
      const convertedFile = new File(
        [convertedBlob], 
        `${file.name.split('.')[0]}.${format}`, 
        { type: convertedBlob.type }
      );
      
      // Upload the converted file
      const downloadUrl = await uploadFile(convertedFile, currentUser.id);
      
      // Update the record in the database
      // await updateFileRecord(fileId, downloadUrl);
      
      // Update the record in the UI
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === fileId 
            ? { ...f, status: 'completed', downloadUrl } 
            : f
        )
      );
    } catch (error) {
      console.error('Error processing file:', error);
      
      // Update the record to failed status
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === fileId 
            ? { ...f, status: 'failed' } 
            : f
        )
      );
    } finally {
      setIsConverting(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Upload files for conversion and view your conversion history.
        </p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Upload New File
            </h2>
            <FileUploader onFileSelected={handleFileSelected} />
            
            {isConverting && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Converting...</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-7">
          <div className="bg-white shadow rounded-lg p-6">
            <FileHistory files={files} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;