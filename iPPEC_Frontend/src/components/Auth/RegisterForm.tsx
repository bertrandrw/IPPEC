import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import IPPECLogo from '../common/iPPECLogo';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    sex: '',
    nid: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Password strength calculation
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[a-z]/.test(value)) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (formData.password.length < 6) {
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return;
    }

    // Phone validation (basic)
    if (formData.phone && formData.phone.length < 10) {
      return;
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        return;
      }
    }
    
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'PATIENT',
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : new Date().toISOString(),
        sex: formData.sex || 'Other',
        nid: formData.nid.trim()
      });

      // Clear form on success
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dateOfBirth: '',
        sex: '',
        nid: ''
      });

    } catch (err: any) {
      console.error('Registration error:', err);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'text-red-500';
    if (passwordStrength <= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E6F2FF] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          {/* Logo with Tagline */}
          <div className="flex justify-center">
            <IPPECLogo size="xl" showText={true} showTagline={true} />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm py-8 px-8 rounded-2xl shadow-xl border border-[#E6F2FF]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-[#333333]" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3.5 border border-[#E6F2FF] rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] outline-none text-sm"
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#333333]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3.5 border border-[#E6F2FF] rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] outline-none text-sm"
                  placeholder="Enter your email address"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-[#333333]" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3.5 border border-[#E6F2FF] rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] outline-none text-sm"
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-[#000000]" />
                  </div>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3.5 border border-[#E6F2FF] rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] outline-none text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3.5 border border-[#E6F2FF] rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] outline-none text-sm"
                  disabled={loading}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
               
                </select>
              </div>
            </div>

            {/* National ID Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <CreditCard className="w-5 h-5 text-[#000000]" />
                </div>
                <input
                  id="nid"
                  name="nid"
                  type="text"
                  value={formData.nid}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3.5 border border-[#E6F2FF] rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] outline-none text-sm"
                  placeholder="Enter your national ID"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#000000]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3.5 border border-[#E6F2FF] rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] outline-none text-sm"
                  placeholder="Create a strong password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-[#000000]" />
                  ) : (
                    <Eye className="w-5 h-5 text-[#000000]" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-1">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-full rounded ${
                          i < passwordStrength
                            ? passwordStrength <= 2
                              ? 'bg-red-500'
                              : passwordStrength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${getPasswordStrengthColor()}`}>
                    Password Strength: {getPasswordStrengthText()}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#000000]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3.5 border border-[#E6F2FF] rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] outline-none text-sm"
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-[#000000]" />
                  ) : (
                    <Eye className="w-5 h-5 text-[#000000]" />
                  )}
                </button>
              </div>
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="flex items-center space-x-2 text-sm">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-white text-sm font-medium bg-[#2196F3] hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#2196F3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <LoadingSpinner className="w-5 h-5" />
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-[#212121]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-[#2196F3] hover:text-[#1976D2] transition-colors"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>

          {/* Trust Signal */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-[#4CAF50]">
            <Lock className="w-4 h-4" />
            <span>Your personal data is protected with secure encryption</span>
          </div>
        </div>

        <div className="text-center text-xs text-[#212121]">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;