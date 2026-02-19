import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu,
  X
} from 'lucide-react';
import IPPECLogo from '../common/iPPECLogo';

const SharedHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* iPPEC Logo */}
          <Link to="/" className="flex items-center">
            <IPPECLogo size="md" showText={true} showTagline={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-[#2196F3]' 
                  : 'text-[#212121] hover:text-[#2196F3]'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-[#2196F3]' 
                  : 'text-[#212121] hover:text-[#2196F3]'
              }`}
            >
              About Us
            </Link>
            <Link 
              to="/services" 
              className={`font-medium transition-colors ${
                isActive('/services') 
                  ? 'text-[#2196F3]' 
                  : 'text-[#212121] hover:text-[#2196F3]'
              }`}
            >
              Services
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-[#2196F3]' 
                  : 'text-[#212121] hover:text-[#2196F3]'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-[#2196F3] hover:text-[#1976D2] font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`font-medium ${
                  isActive('/') 
                    ? 'text-[#2196F3]' 
                    : 'text-[#212121] hover:text-[#2196F3]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`font-medium ${
                  isActive('/about') 
                    ? 'text-[#2196F3]' 
                    : 'text-[#212121] hover:text-[#2196F3]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/services" 
                className={`font-medium ${
                  isActive('/services') 
                    ? 'text-[#2196F3]' 
                    : 'text-[#212121] hover:text-[#2196F3]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className={`font-medium ${
                  isActive('/contact') 
                    ? 'text-[#2196F3]' 
                    : 'text-[#212121] hover:text-[#2196F3]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                <Link 
                  to="/login" 
                  className="text-[#2196F3] font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-[#2196F3] text-white px-4 py-2 rounded-xl font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default SharedHeader;