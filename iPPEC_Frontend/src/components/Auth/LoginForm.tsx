import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import IPPECLogo from '../common/iPPECLogo';


const LoginForm: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted with:', { emailOrPhone: emailOrPhone.trim(), password: '***' });
    
    if (!emailOrPhone.trim() || !password.trim()) {
      console.log('Login validation failed: empty fields');
      return;
    }
    
    try {
      console.log('Calling login function...');
      await login(emailOrPhone.trim(), password);
      console.log('Login function completed successfully');
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E6F2FF] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
            {/* Email/Phone Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#333333]" />
                </div>
                <input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3.5 border border-[#E6F2FF] rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] outline-none text-sm"
                  placeholder="Enter your email or phone"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#333333]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3.5 border border-[#E6F2FF] rounded-xl focus:ring-2 focus:ring-[#2196F3] focus:border-[#2196F3] outline-none text-sm"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-[#333333]" />
                  ) : (
                    <Eye className="w-5 h-5 text-[#333333]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2196F3] focus:ring-[#2196F3] border-[#E6F2FF] rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#212121]">
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#2196F3] hover:text-[#1976D2] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-white text-sm font-medium bg-[#2196F3] hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#2196F3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-[#212121]">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-[#2196F3] hover:text-[#1976D2] transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </form>

          {/* Trust Signal */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-[#4CAF50]">
            <Lock className="w-4 h-4" />
            <span>Your data is secure with us</span>
          </div>
        </div>

        <div className="text-center text-xs text-[#212121]">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;