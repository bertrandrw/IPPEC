import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart,
  ArrowRight,
  Calendar,
  MapPin,
  Shield,
  BookOpen,
  ShoppingCart,
  Stethoscope,
  Clock,
  CheckCircle,
  Award
} from 'lucide-react';
import SharedHeader from '../components/Layout/SharedHeader';
import SharedFooter from '../components/Layout/SharedFooter';

const ServicesPage: React.FC = () => {
  const patientServices = [
    { icon: Stethoscope, title: 'Digital Prescriptions', description: 'Access and manage all your prescriptions digitally from any device, anywhere, anytime' },
    { icon: MapPin, title: 'Find Pharmacies', description: 'Locate nearby pharmacies with real-time availability and compare prices instantly' },
    { icon: Calendar, title: 'Appointment Booking', description: 'Schedule appointments with healthcare providers and manage your healthcare calendar' },
    { icon: Shield, title: 'Insurance Integration', description: 'Seamless RSSB insurance claim processing and coverage verification' },
    { icon: BookOpen, title: 'Health Articles', description: 'Access to trusted health information, tips, and educational content' },
    { icon: ShoppingCart, title: 'Medicine Orders', description: 'Order medicines online with home delivery from verified pharmacies' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SharedHeader />
      
      {/* Combined Hero and Services Section */}
      <section className="pt-20 lg:pt-24 pb-24 bg-gradient-to-b from-[#E6F2FF] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {/* Hero Content */}
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-[#2196F3]/10 rounded-full text-[#2196F3] text-sm font-medium mb-6">
                <Heart className="w-4 h-4 mr-2" />
                Comprehensive Healthcare Solutions
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-[#212121] mb-6">
              Healthcare <span className="text-[#2196F3]">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Transform your healthcare experience with iPPEC's innovative digital platform designed for Rwanda. Seamlessly manage prescriptions, connect with trusted pharmacies, and take control of your wellness. 
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {patientServices.map((service, index) => {
                const ServiceIcon = service.icon;
                return (
                  <div key={index} className="group bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <ServiceIcon className="w-8 h-8 text-[#2196F3] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-[#212121] mb-4">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    
                    {/* Service indicator */}
                    <div className="mt-6 flex items-center text-[#2196F3] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Service CTA */}
            <div className="text-center">
              <div className="inline-flex flex-col items-center">
                <p className="text-gray-600 mb-6 text-lg">Ready to experience digital healthcare?</p>
                <Link
                  to="/register"
                  className="inline-flex items-center bg-[#2196F3] hover:bg-[#1976D2] text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl group hover:-translate-y-1"
                >
                  Start Using iPPEC Services
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Benefits */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                Our Advantages
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#212121] mb-6">
              Why Choose <span className="text-[#2196F3]">iPPEC?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience the future of healthcare in Rwanda with our comprehensive digital platform designed for simplicity and efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div className="group bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                <CheckCircle className="w-10 h-10 text-gray-600 group-hover:text-gray-700 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Prescriptions Made Easy</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your prescriptions processed securely and fast through our digital platform with seamless integration
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="group bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                <Clock className="w-10 h-10 text-gray-600 group-hover:text-gray-700 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Medicine Orders Made Easy</h3>
              <p className="text-gray-600 leading-relaxed">
                Order medicines to your favorite pharmacy with ease and convenience, delivered right to your doorstep
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="group bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                <Shield className="w-10 h-10 text-gray-600 group-hover:text-gray-700 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Easy Insurance Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Insurers get access to information regarding claims in the easy way with transparent processing
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="group bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                <Award className="w-10 h-10 text-gray-600 group-hover:text-gray-700 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Easy Health Information</h3>
              <p className="text-gray-600 leading-relaxed">
                Health information is easily accessed via the system for better healthcare decisions and outcomes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                Simple Process
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#212121] mb-6">
              How to Get <span className="text-[#2196F3]">Started</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Getting started with iPPEC is simple and straightforward. Follow these easy steps to begin your digital healthcare journey
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-16 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gray-200"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="group bg-gray-50 rounded-3xl p-8 text-center hover:bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <span className="text-[#212121] text-2xl font-bold">1</span>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2196F3] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#212121] mb-4">Register Account</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create your account by selecting your role and providing basic information to get started
                </p>
              </div>

              {/* Step 2 */}
              <div className="group bg-gray-50 rounded-3xl p-8 text-center hover:bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <span className="text-[#212121] text-2xl font-bold">2</span>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2196F3] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#212121] mb-4">Complete Profile</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fill in your professional or personal information to personalize your healthcare experience
                </p>
              </div>

              {/* Step 3 */}
              <div className="group bg-gray-50 rounded-3xl p-8 text-center hover:bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <span className="text-[#212121] text-2xl font-bold">3</span>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2196F3] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#212121] mb-4">Verify Identity</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete secure identity verification to ensure safe access to healthcare services
                </p>
              </div>

              {/* Step 4 */}
              <div className="group bg-gray-50 rounded-3xl p-8 text-center hover:bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <span className="text-[#212121] text-2xl font-bold">4</span>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2196F3] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#212121] mb-4">Start Using iPPEC</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access your personalized dashboard and enjoy all the benefits of digital healthcare
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex flex-col items-center">
              <p className="text-gray-600 mb-6 text-lg">Ready to transform your healthcare experience?</p>
              <Link
                to="/register"
                className="inline-flex items-center bg-[#2196F3] hover:bg-[#1976D2] text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl group hover:-translate-y-1"
              >
                Start Your Journey Today
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals and patients who trust iPPEC
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#2196F3] text-white hover:bg-[#1976D2] px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-[#2196F3] text-[#2196F3] hover:bg-[#2196F3] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
      
      <SharedFooter />
    </div>
  );
};

export default ServicesPage;