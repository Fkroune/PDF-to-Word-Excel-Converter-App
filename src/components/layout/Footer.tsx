import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} PDFConvert. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center">
            <p className="text-sm text-gray-500 flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> using React & Tailwind
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;