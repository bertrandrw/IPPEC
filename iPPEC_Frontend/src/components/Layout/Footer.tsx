import React from 'react';
import { Heart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          {/* Copyright */}
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-[#0288D1]" />
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} IPPEC Healthcare Solutions. All rights reserved.
            </p>
          </div>

          {/* Essential Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="/privacy" 
              className="text-sm text-slate-600 hover:text-[#0288D1] transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-sm text-slate-600 hover:text-[#0288D1] transition-colors"
            >
              Terms
            </a>
            <a 
              href="/contact" 
              className="text-sm text-slate-600 hover:text-[#0288D1] transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center space-x-3">
            <a 
              href="#" 
              className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center hover:bg-[#E1F5FE] hover:text-[#0288D1] transition-all duration-200"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center hover:bg-[#E1F5FE] hover:text-[#0288D1] transition-all duration-200"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-medical-100 hover:text-medical-600 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-medical-100 hover:text-medical-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2025 IPPEC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;