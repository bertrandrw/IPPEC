import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  MessageCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import SharedHeader from '../components/Layout/SharedHeader';
import SharedFooter from '../components/Layout/SharedFooter';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userType: 'patient'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        userType: 'patient'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SharedHeader />
      
      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-b from-[#E6F2FF] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-[#2196F3]/10 rounded-full text-[#2196F3] text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4 mr-2" />
              We're Here to Help You
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[#212121] mb-6">
              Contact <span className="text-[#2196F3]">iPPEC</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Have questions about our digital healthcare platform? Need support or want to learn more? 
              We're here to help you every step of the way.
            </p>
          </div>

          {/* Quick Contact Options */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#2196F3] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak directly with our support team</p>
              <p className="text-[#2196F3] font-semibold">+250 787 990 356</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#4CAF50] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us a detailed message</p>
              <p className="text-[#4CAF50] font-semibold">info@ippec.rw</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#FF9800] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Come to our office in Kigali</p>
              <p className="text-[#FF9800] font-semibold">KG 9 Ave, Nyarugenge</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#212121] mb-4">Send Us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours. For urgent matters, 
                  please call us directly.
                </p>
              </div>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800">Message Sent Successfully!</h3>
                    <p className="text-green-600 text-sm mt-1">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Error Sending Message</h3>
                    <p className="text-red-600 text-sm mt-1">
                      There was an error sending your message. Please try again or contact us directly.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#212121] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#212121] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#212121] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#212121] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200"
                      placeholder="+250 xxx xxx xxx"
                    />
                  </div>
                </div>

                {/* User Type & Subject */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="userType" className="block text-sm font-medium text-[#212121] mb-2">
                      I am a... *
                    </label>
                    <select
                      id="userType"
                      name="userType"
                      required
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="pharmacist">Pharmacist</option>
                      <option value="admin">Healthcare Administrator</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[#212121] mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200"
                      placeholder="What can we help you with?"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#212121] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center bg-[#2196F3] hover:bg-[#1976D2] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#212121] mb-4">Get in Touch</h2>
                <p className="text-gray-600">
                  We're committed to providing excellent support to all our users. Choose the best way to reach us.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#2196F3] rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#212121] mb-1">Our Office</h4>
                    <p className="text-gray-600">
                      iPPECLtd.<br />
                      KG 9 Ave, Nyarugenge<br />
                      Kigali, Rwanda
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#212121] mb-1">Phone Numbers</h4>
                    <p className="text-gray-600">
                      Main: +250 788 123 456<br />
                      Support: +250 722 987 654<br />
                      Emergency: +250 788 999 111
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FF9800] rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#212121] mb-1">Email Addresses</h4>
                    <p className="text-gray-600">
                      General: info@ippec.rw<br />
                      Support: support@ippecc.rw<br />
                      Sales: sales@ippec.rw
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#9C27B0] rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#212121] mb-1">Business Hours</h4>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Emergency support only
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#212121] mb-4">
              Frequently Asked <span className="text-[#2196F3]">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Find quick answers to common questions about iPPEC
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#212121] mb-3">
                How do I register for iPPEC?
              </h3>
              <p className="text-gray-600">
                Registration is simple! Click the "Get Started" button, choose your role (Patient, Doctor, Pharmacist, or Admin), 
                fill in your information, and verify your identity. You'll be up and running in minutes.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#212121] mb-3">
                Is my health data secure on iPPEC?
              </h3>
              <p className="text-gray-600">
                Absolutely! We use military-grade encryption and are fully HIPAA compliant. Your health data is protected 
                with the highest security standards and never shared without your explicit consent.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#212121] mb-3">
                Does iPPECwork with RSSB insurance?
              </h3>
              <p className="text-gray-600">
                Yes! iPPECis fully integrated with Rwanda's RSSB insurance system, making insurance claim 
                processing automatic and seamless for both patients and healthcare providers.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#212121] mb-3">
                What support is available if I need help?
              </h3>
              <p className="text-gray-600">
                We offer 24/7 support through multiple channels: phone, email, and live chat. Our dedicated support 
                team is always ready to help you with any questions or technical issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-[#2196F3] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals and patients who trust iPPEC for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#2196F3] text-white hover:bg-[#1976D2] px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:+250788123456"
              className="border-2 border-[#2196F3] text-[#2196F3] hover:bg-[#2196F3] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center"
            >
              Call Us Now
              <Phone className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>
      
      <SharedFooter />
    </div>
  );
};

export default ContactPage;