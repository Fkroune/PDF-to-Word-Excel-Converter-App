import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FileUp, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FileUp className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PDFConvert</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              } transition-colors duration-200`}
            >
              Home
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium ${
                    isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  } transition-colors duration-200`}
                >
                  Dashboard
                </Link>
                
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state. */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6 lg:px-8">
            <Link 
              to="/" 
              className={`block py-2 px-3 rounded-md text-base font-medium ${
                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block py-2 px-3 rounded-md text-base font-medium ${
                    isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;