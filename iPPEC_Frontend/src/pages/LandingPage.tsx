import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Users, 
  Pill, 
  Stethoscope, 
  FileText, 
  Smartphone, 
  Clock, 
  CheckCircle, 
  Star,
  Menu,
  X,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Award,
  TrendingUp,
  Globe,
  Database
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2196F3] to-[#4CAF50] rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#212121]">Medical-One</h1>
                <p className="text-xs text-gray-600">Digital Healthcare Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-[#212121] hover:text-[#2196F3] font-medium transition-colors">Home</a>
              <a href="#about" className="text-[#212121] hover:text-[#2196F3] font-medium transition-colors">About Us</a>
              <a href="#services" className="text-[#212121] hover:text-[#2196F3] font-medium transition-colors">Services</a>
              <a href="#contact" className="text-[#212121] hover:text-[#2196F3] font-medium transition-colors">Contact</a>
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
                <a href="#home" className="text-[#212121] hover:text-[#2196F3] font-medium">Home</a>
                <a href="#about" className="text-[#212121] hover:text-[#2196F3] font-medium">About Us</a>
                <a href="#services" className="text-[#212121] hover:text-[#2196F3] font-medium">Services</a>
                <a href="#contact" className="text-[#212121] hover:text-[#2196F3] font-medium">Contact</a>
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                  <Link to="/login" className="text-[#2196F3] font-medium">Sign In</Link>
                  <Link to="/register" className="bg-[#2196F3] text-white px-4 py-2 rounded-xl font-medium text-center">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-20 lg:pt-24 pb-16 bg-gradient-to-b from-[#E6F2FF] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-[#2196F3]/10 rounded-full text-[#2196F3] text-sm font-medium">
                  <Award className="w-4 h-4 mr-2" />
                  #1 Digital Healthcare Platform in Rwanda
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-[#212121] leading-tight">
                  Revolutionary <span className="text-[#2196F3]">Digital Healthcare</span> Management
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Streamline your healthcare experience with our comprehensive digital platform. 
                  Connect patients, doctors, pharmacists, and insurers in one secure ecosystem.
                </p>
              </div>

              {/* Key Features */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                  <span className="text-gray-700">RSSB Insurance Integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                  <span className="text-gray-700">E-Prescription System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                  <span className="text-gray-700">24/7 Digital Access</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-[#2196F3] text-[#2196F3] hover:bg-[#2196F3] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2196F3]">50K+</div>
                  <div className="text-sm text-gray-600 mt-1">Active Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4CAF50]">2K+</div>
                  <div className="text-sm text-gray-600 mt-1">Healthcare Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF9800]">500+</div>
                  <div className="text-sm text-gray-600 mt-1">Partner Pharmacies</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#2196F3] to-[#4CAF50] rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 space-y-6">
                  {/* Mock Dashboard */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#2196F3] rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Dr. Jean Baptiste</div>
                        <div className="text-sm text-gray-500">Cardiologist</div>
                      </div>
                    </div>
                    <div className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm">Active</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#E3F2FD] p-4 rounded-xl">
                      <div className="text-2xl font-bold text-[#2196F3]">156</div>
                      <div className="text-sm text-gray-600">Patients Today</div>
                    </div>
                    <div className="bg-[#E8F5E8] p-4 rounded-xl">
                      <div className="text-2xl font-bold text-[#4CAF50]">24</div>
                      <div className="text-sm text-gray-600">Prescriptions</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-[#2196F3]" />
                        <span className="text-sm">Patient Consultation</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm">Prescription Review</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#4CAF50]" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-[#2196F3]" />
                  <span className="text-sm font-medium">Mobile Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212121] mb-4">
              Comprehensive Healthcare <span className="text-[#2196F3]">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides end-to-end healthcare management solutions for all stakeholders in the healthcare ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Patient Services */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2196F3] to-[#1976D2] rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Patient Portal</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Digital Prescriptions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Health Articles
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Find Pharmacies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Order Medicines
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  RSSB Integration
                </li>
              </ul>
            </div>

            {/* Doctor Services */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-2xl flex items-center justify-center mb-6">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Doctor Portal</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  E-Prescription System
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Patient Management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Medical Records
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Consultation Scheduling
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Medical Articles
                </li>
              </ul>
            </div>

            {/* Pharmacist Services */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF9800] to-[#F57C00] rounded-2xl flex items-center justify-center mb-6">
                <Pill className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Pharmacist Portal</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Prescription Management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Inventory Control
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Order Processing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Insurance Claims
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Private Orders
                </li>
              </ul>
            </div>

            {/* Admin Services */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Admin Portal</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  User Management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  System Analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Hospital Management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Pharmacy Oversight
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Content Management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-[#212121] mb-6">
                  Transforming <span className="text-[#2196F3]">Healthcare</span> in Rwanda
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Medical-One is Rwanda's premier digital healthcare platform, designed to revolutionize how patients, 
                  doctors, pharmacists, and insurers interact. Our comprehensive ecosystem ensures seamless healthcare 
                  delivery while maintaining the highest standards of security and compliance.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Built with Rwanda's unique healthcare landscape in mind, we integrate with RSSB insurance systems 
                  and support local healthcare providers to deliver exceptional patient care through digital innovation.
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#2196F3]">99.9%</div>
                  <div className="text-gray-600">System Uptime</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#4CAF50]">ISO 27001</div>
                  <div className="text-gray-600">Security Certified</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#FF9800]">24/7</div>
                  <div className="text-gray-600">Support Available</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#9C27B0]">HIPAA</div>
                  <div className="text-gray-600">Compliant</div>
                </div>
              </div>
            </div>

            {/* Right Content - Features */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#2196F3] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#212121] mb-2">Security First</h3>
                    <p className="text-gray-600">
                      Military-grade encryption and HIPAA compliance ensure your health data is always protected.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#E8F5E8] to-[#C8E6C9] rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#212121] mb-2">Local Integration</h3>
                    <p className="text-gray-600">
                      Seamlessly integrated with RSSB and local healthcare systems across Rwanda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FFF3E0] to-[#FFE0B2] rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FF9800] rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#212121] mb-2">Smart Analytics</h3>
                    <p className="text-gray-600">
                      AI-powered insights help healthcare providers make better decisions for patient care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212121] mb-4">
              What Healthcare <span className="text-[#2196F3]">Professionals</span> Say
            </h2>
            <p className="text-xl text-gray-600">Trusted by healthcare providers across Rwanda</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FFD700] fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Medical-One has transformed how we manage prescriptions. The integration with RSSB 
                makes insurance claims seamless, and our patients love the digital experience."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#2196F3] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">DR</span>
                </div>
                <div>
                  <div className="font-bold text-[#212121]">Dr. Marie Uwimana</div>
                  <div className="text-gray-500">Senior Physician, CHUK</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FFD700] fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "As a pharmacist, the inventory management and prescription processing features 
                have made our daily operations incredibly efficient. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#4CAF50] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">JB</span>
                </div>
                <div>
                  <div className="font-bold text-[#212121]">Jean Baptiste Niyomugabo</div>
                  <div className="text-gray-500">Chief Pharmacist, Pharmacy Plus</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FFD700] fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "The patient portal is incredibly user-friendly. I can access my prescriptions, 
                find nearby pharmacies, and even order medicines online. It's revolutionary!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#FF9800] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">AS</span>
                </div>
                <div>
                  <div className="font-bold text-[#212121]">Alice Mukamana</div>
                  <div className="text-gray-500">Patient, Kigali</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212121] mb-4">
              Get in <span className="text-[#2196F3]">Touch</span>
            </h2>
            <p className="text-xl text-gray-600">
              Ready to transform your healthcare experience? Contact us today
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#212121] mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#2196F3] rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#212121]">Address</h4>
                      <p className="text-gray-600">KG 9 Ave, Nyarugenge<br />Kigali, Rwanda</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#212121]">Phone</h4>
                      <p className="text-gray-600">+250 788 123 456<br />+250 722 987 654</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#FF9800] rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#212121]">Email</h4>
                      <p className="text-gray-600">info@medical-one.rw<br />support@medical-one.rw</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-bold text-[#212121] mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Facebook className="w-6 h-6 text-white" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#1DA1F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Twitter className="w-6 h-6 text-white" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#E4405F] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#0A66C2] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                    placeholder="+250 xxx xxx xxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2196F3] hover:bg-[#1976D2] text-white py-4 rounded-xl font-semibold transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#212121] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2196F3] to-[#4CAF50] rounded-xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Medical-One</h3>
                  <p className="text-gray-400 text-sm">Digital Healthcare Platform</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming healthcare delivery in Rwanda through innovative digital solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><span className="hover:text-white transition-colors">Patient Portal</span></li>
                <li><span className="hover:text-white transition-colors">Doctor Dashboard</span></li>
                <li><span className="hover:text-white transition-colors">Pharmacy Management</span></li>
                <li><span className="hover:text-white transition-colors">Insurance Integration</span></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>KG 9 Ave, Nyarugenge<br />Kigali, Rwanda</p>
                <p>+250 788 123 456</p>
                <p>info@medical-one.rw</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Medical-One. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;