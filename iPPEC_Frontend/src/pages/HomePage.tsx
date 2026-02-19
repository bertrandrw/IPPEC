import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Users, 
  ArrowRight,
  TrendingUp,
  Globe,
  CheckCircle,
  Smartphone,
  Clock,
  Star,
  Stethoscope,
  FileText
} from 'lucide-react';
import SharedHeader from '../components/Layout/SharedHeader';
import SharedFooter from '../components/Layout/SharedFooter';
import IPPECLogo from '../components/common/iPPECLogo';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SharedHeader />
      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-b from-[#E6F2FF] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                {/* Featured iPPEC Logo */}
                <div className="flex items-center mb-6">
                 
                </div>
                
                <div className="inline-flex items-center px-4 py-2 bg-[#2196F3]/10 rounded-full text-[#2196F3] text-sm font-medium">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Smart Prescriptions, Simplified
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-[#212121] leading-tight">
                  Easy Access to <span className="text-[#2196F3]">Health Information</span> & Pharmaceutical Products
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  iPPEC (Information, Patient, Pharmacy, Education and Customers) helps patients across Rwanda buy and access medicines prescribed by doctors. 
                  Access prescriptions anywhere, anytime, and order from your nearest pharmacy with ease.
                </p>
              </div>

              {/* Key Features */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                  <span className="text-gray-700">Insurance Integration</span>
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
                  className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-[#2196F3] text-[#2196F3] hover:bg-[#2196F3] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2196F3] animate-pulse">13M+</div>
                  <div className="text-sm text-gray-600 mt-1">Rwanda Population</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4CAF50] animate-pulse">180+</div>
                  <div className="text-sm text-gray-600 mt-1">Registered Pharmacies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FF9800] animate-pulse">545+</div>
                  <div className="text-sm text-gray-600 mt-1">Health Centers</div>
                </div>
               
              </div>
            </div>

            {/* Right Content - Enhanced Hero Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#2196F3] to-[#4CAF50] rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
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
                    <div className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm animate-pulse">Active</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#E3F2FD] p-4 rounded-xl hover:bg-[#BBDEFB] transition-colors">
                      <div className="text-2xl font-bold text-[#2196F3]">156</div>
                      <div className="text-sm text-gray-600">Patients Today</div>
                    </div>
                    <div className="bg-[#E8F5E8] p-4 rounded-xl hover:bg-[#C8E6C9] transition-colors">
                      <div className="text-2xl font-bold text-[#4CAF50]">24</div>
                      <div className="text-sm text-gray-600">Prescriptions</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-[#2196F3]" />
                        <span className="text-sm">Patient Consultation</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm">Prescription Review</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#4CAF50]" />
                  <span className="text-sm font-medium">Security On Top</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg animate-float-delayed">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-[#2196F3]" />
                  <span className="text-sm font-medium">Mobile Ready</span>
                </div>
              </div>

              <div className="absolute top-1/2 -left-8 bg-white rounded-full p-3 shadow-lg animate-bounce">
                <Star className="w-6 h-6 text-[#FFD700]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212121] mb-4">
              Why Choose <span className="text-[#2196F3]">iPPEC?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of healthcare with our comprehensive digital platform designed for Rwanda's healthcare ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2196F3] to-[#1976D2] rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Advanced Security</h3>
              <p className="text-gray-600 mb-4">
                Your health information is protected with bank-level encryption and secure access controls, ensuring complete privacy and data safety.
              </p>
              <div className="flex items-center text-[#2196F3] font-medium">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Local Integration</h3>
              <p className="text-gray-600 mb-4">
                Seamlessly integrated with other systems across Rwanda for complete healthcare coverage.
              </p>
              <div className="flex items-center text-[#4CAF50] font-medium">
                <span>Discover More</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF9800] to-[#F57C00] rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-4">Quick Fast Service</h3>
              <p className="text-gray-600 mb-4">
                Everything happens instantly - quick prescription access, fast pharmacy search, rapid order processing, and immediate digital delivery.
              </p>
              <div className="flex items-center text-[#FF9800] font-medium">
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212121] mb-4">
              Complete Healthcare <span className="text-[#2196F3]">Ecosystem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From patients to healthcare providers, our platform serves every stakeholder in the healthcare journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Service Card 1 */}
            <Link to="/services" className="group bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#2196F3] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-3">Patient Portal</h3>
              <p className="text-gray-600 leading-relaxed">Access prescriptions, find pharmacies, and manage your health digitally with complete control</p>
              <div className="mt-4 flex items-center text-[#2196F3] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Explore Portal</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Service Card 2 */}
            <Link to="/services" className="group bg-gradient-to-br from-[#E8F5E8] to-[#C8E6C9] rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#4CAF50] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-3">Doctor Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">Manage patients, create e-prescriptions, and track medical records efficiently</p>
              <div className="mt-4 flex items-center text-[#4CAF50] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Service Card 3 */}
            <Link to="/services" className="group bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#FF9800] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-3">Pharmacist Tools</h3>
              <p className="text-gray-600 leading-relaxed">Process prescriptions, manage inventory, and handle insurance claims seamlessly</p>
              <div className="mt-4 flex items-center text-[#FF9800] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>View Tools</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center bg-[#2196F3] hover:bg-[#1976D2] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              Explore All Services
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="bg-[#2196F3]/10 text-[#2196F3] px-4 py-2 rounded-full text-sm font-medium">
                Our Purpose
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#212121] mb-6">
              Driving Healthcare <span className="text-[#2196F3]">Innovation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Transforming Rwanda's healthcare landscape through technology, making quality healthcare accessible to every citizen
            </p>
          </div>

          {/* Single Card Design */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Mission Side */}
                <div className="bg-gradient-to-br from-[#2196F3] to-[#1976D2] p-12 text-white">
                  <div>
                    <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
                    <p className="text-lg leading-relaxed text-white/90 mb-8">
                      To ensure that health information, quality pharmaceutical services are easily accessible and affordable to every Rwandan. 
                      We prioritize patients' healthcare needs and quality above all else.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/80 text-sm">Quality Healthcare for All</span>
                    </div>
                  </div>
                </div>

                {/* Vision Side */}
                <div className="bg-gradient-to-br from-[#4CAF50] to-[#45a049] p-12 text-white">
                  <div>
                    <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                    <p className="text-lg leading-relaxed text-white/90 mb-8">
                      To become the leading digital healthcare platform in East Africa, providing seamless access to health information and 
                      pharmaceutical products through innovative technology solutions.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/80 text-sm">Leading Digital Healthcare</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-[#212121] mb-6">
                  The <span className="text-red-500">Problem</span> We're Solving
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      Low technology adoption in healthcare delivery across developing countries, including Rwanda
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      Limited systems exist only for patient registration and medication lists
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      Difficulty accessing pharmaceutical services and health information
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      Complex insurance reimbursement processes for pharmaceutical products
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#212121] mb-6">
                  Our <span className="text-[#4CAF50]">Solution</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#4CAF50] mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>iPPEC Software:</strong> A comprehensive platform serving healthcare professionals, pharmacy professionals, insurers, and the public
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#4CAF50] mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>Easy Access:</strong> Patients can locate pharmaceutical needs and access prescriptions anywhere, anytime
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#4CAF50] mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>Pharmacy Integration:</strong> Pharmacies can utilize the system for redistribution of near-expiration pharmaceuticals
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#4CAF50] mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>Insurance Support:</strong> Seamless reimbursement processes for pharmaceutical products by health insurers
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#4CAF50] mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>E-Prescription:</strong> Promoting digital prescriptions and improved health information access
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Reach */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-[#212121] mb-8">Our Growing Market Reach</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-[#2196F3] mb-2">180+</div>
                <div className="text-gray-600">Private Pharmaceutical Retailers</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-[#4CAF50] mb-2">761+</div>
                <div className="text-gray-600">Pharmaceutical Wholesalers</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-[#FF9800] mb-2">545+</div>
                <div className="text-gray-600">Public & Private Health Centers</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-[#9C27B0] mb-2">7+</div>
                <div className="text-gray-600">Private Health Insurers</div>
              </div>
            </div>
            <p className="text-gray-600 mt-8 max-w-4xl mx-auto">
              With over 80% of Rwanda's population accessing public services online and 82.9% mobile penetration, 
              iPPEC is positioned to serve Rwanda's 13 million citizens with comprehensive digital healthcare solutions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Healthcare in Rwanda?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join iPPEC today and be part of the digital healthcare revolution. Experience smart prescriptions, simplified access, and comprehensive care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#2196F3] text-white hover:bg-[#1976D2] px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Start Your Health Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-[#2196F3] text-[#2196F3] hover:bg-[#2196F3] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center"
            >
              Learn More About iPPEC
            </Link>
          </div>
        </div>
      </section>
      
      <SharedFooter />
    </div>
  );
};

export default HomePage;