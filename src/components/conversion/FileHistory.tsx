import React from 'react';
import { Download, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { FileRecord } from '../../types';

interface FileHistoryProps {
  files: FileRecord[];
  loading: boolean;
}

const FileHistory: React.FC<FileHistoryProps> = ({ files, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p>No files have been processed yet.</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Conversion History</h2>
      <div className="divide-y divide-gray-200">
        {files.map((file) => (
          <div 
            key={file.id} 
            className="py-4 px-6 hover:bg-gray-50 transition-colors duration-150 rounded-lg"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FileText className="h-10 w-10 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">{file.originalName}</p>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span>Converted to: {file.convertedFormat.toUpperCase()}</span>
                    <span>•</span>
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {getStatusIcon(file.status)}
                  <span className="text-sm ml-1 capitalize">
                    {file.status}
                  </span>
                </div>
                
                {file.status === 'completed' && file.downloadUrl && (
                  <a
                    href={file.downloadUrl}
                    download={`${file.originalName.split('.')[0]}.${file.convertedFormat}`}
                    className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileHistory;