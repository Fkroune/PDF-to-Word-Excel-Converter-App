import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Check, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FileUploader from '../components/conversion/FileUploader';
import Button from '../components/ui/Button';
import { ConversionFormat } from '../types';
import { convertFile } from '../services/fileService';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<{ blob: Blob; name: string } | null>(null);
  const [conversionStep, setConversionStep] = useState(1);
  
  const handleFileSelected = async (file: File, format: ConversionFormat) => {
    setIsConverting(true);
    setConversionStep(2);
    
    try {
      // Simulate conversion progress
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConversionStep(3);
      
      const convertedBlob = await convertFile(file, format);
      
      // Create a name for the converted file
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const fileExtension = format === 'docx' ? '.docx' : '.xlsx';
      const newFileName = `${baseName}${fileExtension}`;
      
      setConvertedFile({ blob: convertedBlob, name: newFileName });
      setConversionStep(4);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting file. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };
  
  const handleDownload = () => {
    if (!convertedFile) return;
    
    const url = URL.createObjectURL(convertedFile.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const resetConversion = () => {
    setConvertedFile(null);
    setConversionStep(1);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Convert PDF to Word or Excel in Seconds
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Simple, fast and secure. Upload your PDF file and convert it to Microsoft Word or Excel format instantly.
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden max-w-4xl mx-auto">
        <div className="px-6 py-8 md:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full 
                    ${conversionStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'}`}
                  >
                    {step < conversionStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step}</span>
                    )}
                  </div>
                  
                  {step < 4 && (
                    <div className={`flex-1 h-1 max-w-[80px] mx-1
                      ${conversionStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="text-center mb-4">
              {conversionStep === 1 && <h2 className="text-lg font-medium text-gray-900">Upload PDF File</h2>}
              {conversionStep === 2 && <h2 className="text-lg font-medium text-gray-900">Converting...</h2>}
              {conversionStep === 3 && <h2 className="text-lg font-medium text-gray-900">Processing Complete</h2>}
              {conversionStep === 4 && <h2 className="text-lg font-medium text-gray-900">Ready to Download</h2>}
            </div>
          </div>
          
          {conversionStep === 1 && <FileUploader onFileSelected={handleFileSelected} />}
          
          {conversionStep === 2 && (
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
              </div>
              <p className="text-gray-600">Converting your file, please wait...</p>
            </div>
          )}
          
          {(conversionStep === 3 || conversionStep === 4) && convertedFile && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Conversion Complete!</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your file has been successfully converted.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={handleDownload}
                  className="w-full sm:w-auto flex items-center justify-center"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download {convertedFile.name}
                </Button>
                
                <div>
                  <button
                    onClick={resetConversion}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Convert another file
                  </button>
                </div>
                
                {!currentUser && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">
                      Create an account to save your converted files and access them anytime.
                    </p>
                    <Link to="/register">
                      <Button variant="outline">
                        Sign up for free
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <FileUp className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Easy Upload</h3>
          <p className="mt-2 text-sm text-gray-500">
            Simply drag & drop your PDF file or click to browse from your computer.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Fast Conversion</h3>
          <p className="mt-2 text-sm text-gray-500">
            Advanced algorithms ensure your files are converted quickly and accurately.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">100% Secure</h3>
          <p className="mt-2 text-sm text-gray-500">
            Your files are securely processed and automatically deleted after conversion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;