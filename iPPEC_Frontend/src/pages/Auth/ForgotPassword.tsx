import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make actual API call to send password reset email
      // await sendPasswordResetEmail(email);
      
      setEmailSent(true);
    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E6F2FF] to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Success Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4CAF50] to-[#2196F3] rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Check Your Email
            </h1>
            <p className="mt-2 text-base text-gray-600">
              We've sent a password reset link to
            </p>
            <p className="mt-1 text-sm font-medium text-[#2196F3]">
              {email}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#2196F3] rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">
                  Click the link in the email to reset your password
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#2196F3] rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">
                  The link will expire in 15 minutes for security
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#2196F3] rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">
                  Check your spam folder if you don't see the email
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                Haven't received the email?
              </p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="w-full mt-3 py-2 px-4 text-sm font-medium text-[#2196F3] hover:text-[#1976D2] transition-colors"
              >
                Try with a different email
              </button>
            </div>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-[#2196F3] hover:text-[#1976D2] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E6F2FF] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#2196F3] to-[#4CAF50] rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Forgot Password?
          </h1>
          <p className="mt-2 text-base text-gray-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#212121] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#333333]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-[#E6F2FF] rounded-xl text-[#212121] placeholder-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-white text-sm font-medium bg-[#2196F3] hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#2196F3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="w-5 h-5 mr-2" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-[#2196F3] hover:text-[#1976D2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>

        {/* Trust Signal */}
        <div className="text-center text-xs text-[#212121]">
          <p>We'll never share your email with anyone else</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;