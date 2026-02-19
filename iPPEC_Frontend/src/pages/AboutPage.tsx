import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Users, 
  Award,
  TrendingUp,
  Globe,
  CheckCircle,
  Target,
  Eye,
  ArrowRight,
  Building,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Stethoscope,
  Pill,
  Database,
  Clock
} from 'lucide-react';
import SharedHeader from '../components/Layout/SharedHeader';
import SharedFooter from '../components/Layout/SharedFooter';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SharedHeader />
      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-b from-[#E6F2FF] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-[#2196F3]/10 rounded-full text-[#2196F3] text-sm font-medium mb-6">
              <Heart className="w-4 h-4 mr-2" />
              Transforming Healthcare in Rwanda Since 2023
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[#212121] mb-6">
              About <span className="text-[#2196F3]">iPPEC</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              iPPEC (Information, Patient, Pharmacy, Education and Customers) is revolutionizing healthcare delivery in Rwanda 
              through innovative digital solutions. <strong>"Health System Made Easy"</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-[#212121] mb-6">Our Story </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Since developing countries, including those in Africa, still have low technology adoption in healthcare delivery, 
                  we built iPPEC software to provide easy access to affordable, quality healthcare and pharmaceutical products using technology.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  In Rwanda, available systems are typically only for patient registration and medication lists. 
                  Our software is unique because people and caregivers can access it to locate their pharmaceutical needs, 
                  pharmacies can utilize it for redistribution of near-expiration pharmaceuticals, and insurers can use it to reimburse pharmaceutical products.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, iPPEC is Rwanda's Best digital healthcare platform, trusted by healthcare 
                  providers across the country and and ready to be integrated with national systems including RSSB for 
                  seamless insurance processing.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#2196F3] to-[#4CAF50] rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#212121]">Rwanda Healthcare Impact</h3>
                    <div className="w-10 h-10 bg-[#2196F3] rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#E3F2FD] p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-[#2196F3]">99.9%</div>
                      <div className="text-sm text-gray-600">System Uptime</div>
                    </div>
                    <div className="bg-[#E8F5E8] p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-[#4CAF50]">30</div>
                      <div className="text-sm text-gray-600">Districts Covered</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">CHUK Partnership</span>
                      <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">RSSB Integration</span>
                      <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">MOH Compliance</span>
                      <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212121] mb-4">
              Our <span className="text-[#2196F3]">Purpose</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Guided by our mission, vision, and values, we're committed to transforming healthcare in Rwanda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2196F3] to-[#1976D2] rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#212121] mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize healthcare access in Rwanda by providing a comprehensive digital platform that 
                connects all healthcare stakeholders, ensuring efficient, secure, and accessible healthcare 
                services for every Rwandan citizen.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#212121] mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the leading digital healthcare ecosystem in East Africa, setting the standard for 
                innovative healthcare technology solutions that improve health outcomes and enhance the 
                patient experience across the region.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF9800] to-[#F57C00] rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#212121] mb-4">Our Values</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Patient-Centered Care
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Data Security & Privacy
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Innovation & Excellence
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2" />
                  Accessibility & Inclusion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* Our Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212121] mb-4">
              Meet Our <span className="text-[#2196F3]">Leadership Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team of healthcare professionals, engineers, and innovators driving Rwanda's digital healthcare transformation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-[#2196F3] to-[#1976D2] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">DR</span>
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">Dr. Mukiza Jean D'Amour</h3>
              <p className="text-[#2196F3] font-medium mb-3">Chief Medical Officer</p>
              <p className="text-gray-600 text-sm">
                Former Chief of Internal Medicine at CHUK with 15+ years of experience in healthcare 
                digitization and medical informatics.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">JB</span>
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">Jean Baptiste Nkurunziza</h3>
              <p className="text-[#4CAF50] font-medium mb-3">Chief Technology Officer</p>
              <p className="text-gray-600 text-sm">
                Software architect with expertise in healthcare systems, having led digital transformation 
                projects across East Africa for 12+ years.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-[#FF9800] to-[#F57C00] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">AM</span>
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">Alice Mukamana</h3>
              <p className="text-[#FF9800] font-medium mb-3">Head of Operations</p>
              <p className="text-gray-600 text-sm">
                Healthcare operations specialist with deep knowledge of Rwanda's healthcare system and 
                regulatory compliance requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#212121] mb-6">Company Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#2196F3] rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#212121]">Headquarters</h4>
                      <p className="text-gray-600">iPPEC Ltd.<br />KG 9 Ave, Nyarugenge<br />Kigali, Rwanda</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#212121]">Founded</h4>
                      <p className="text-gray-600">2024 - Transforming healthcare for all</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#FF9800] rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#212121]">Team Size</h4>
                      <p className="text-gray-600">50+ dedicated professionals across healthcare, technology, and operations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-[#2196F3] to-[#4CAF50] rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" />
                  <span>+250 787 990 356</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>info@ippec.rw</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <span>KG 9 Ave, Nyarugenge, Kigali</span>
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center bg-white text-[#2196F3] hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 group"
              >
                Contact Us Today
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Join Our Healthcare Revolution?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of healthcare in Rwanda. Join thousands of satisfied users who trust iPPEC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="border-2 border-[#2196F3] text-[#2196F3] hover:bg-[#2196F3] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
      
      <SharedFooter />
    </div>
  );
};

export default AboutPage;