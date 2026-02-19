import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import IPPECLogo from '../common/iPPECLogo';

const SharedFooter: React.FC = () => {
  return (
    <footer className="bg-[#212121] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <IPPECLogo size="md" showText={true} showTagline={true} theme="dark" />
            </Link>
            <p className="text-gray-400 text-sm">
              Transforming healthcare delivery in Rwanda through smart, simplified digital solutions. Making health information and pharmaceutical products easily accessible to everyone.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4 pt-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#E4405F] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Our Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                 Digital Prescriptions
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                Find Pharmacies
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Pharmacist Tools
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Medicine Orders
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Insurance Integrations
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Health Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact Information</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <div>
                <p className="font-medium text-white mb-1">Address</p>
                <p>KG 9 Ave, Nyarugenge<br />Kigali, Rwanda</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">Phone</p>
                <p>+250 788 123 456<br />+250 722 987 654</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">Email</p>
                <p>info@ippec.rw<br />support@ippec.rw</p>
              </div>
           
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>© 2025 iPPEC - Health System Made Easy. All rights reserved.</p>
              <p className="mt-1">Transforming healthcare in Rwanda through smart, simplified digital solutions.</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SharedFooter;