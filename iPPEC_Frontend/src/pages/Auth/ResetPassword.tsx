import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowLeft, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Validate the reset token when component mounts
    const validateToken = async () => {
      if (!token || !email) {
        setError('Invalid reset link. Please request a new password reset.');
        setValidatingToken(false);
        return;
      }

      try {
        // Simulate token validation API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Here you would make actual API call to validate token
        // const response = await validatePasswordResetToken(token, email);
        
        setTokenValid(true);
      } catch (err: any) {
        setError('This reset link has expired or is invalid. Please request a new one.');
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token, email]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make actual API call to reset password
      // await resetPassword(token, email, password);
      
      setResetSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state while validating token
  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E6F2FF] to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#2196F3] to-[#4CAF50] rounded-2xl flex items-center justify-center shadow-lg">
                <LoadingSpinner className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Validating Reset Link
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Please wait while we verify your password reset request...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E6F2FF] to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#f44336] to-[#ff9800] rounded-2xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Invalid Reset Link
            </h1>
            <p className="mt-2 text-base text-gray-600">
              {error}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
            <p className="text-sm text-gray-600">
              Reset links expire after 15 minutes for security reasons.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block w-full py-3 px-4 bg-[#2196F3] text-white text-sm font-medium rounded-xl hover:bg-[#1976D2] transition-colors"
            >
              Request New Reset Link
            </Link>
          </div>

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

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E6F2FF] to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4CAF50] to-[#2196F3] rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Password Reset Successful!
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Your password has been successfully updated.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
            <p className="text-sm text-gray-600">
              You can now sign in with your new password.
            </p>
            <p className="text-xs text-gray-500">
              Redirecting to sign in page in 3 seconds...
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-3 px-4 bg-[#2196F3] text-white text-sm font-medium rounded-xl hover:bg-[#1976D2] transition-colors"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Password reset form
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
            Reset Password
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Create a new password for your account
          </p>
          {email && (
            <p className="mt-1 text-sm text-[#2196F3]">
              {email}
            </p>
          )}
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

            {/* New Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#212121] mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#333333]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3.5 border border-[#E6F2FF] rounded-xl text-[#212121] placeholder-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-[#333333]" />
                  ) : (
                    <Eye className="w-5 h-5 text-[#333333]" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#212121] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#333333]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3.5 border border-[#E6F2FF] rounded-xl text-[#212121] placeholder-[#333333] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-[#333333]" />
                  ) : (
                    <Eye className="w-5 h-5 text-[#333333]" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${/(?=.*[a-z])/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One lowercase letter
                </li>
                <li className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${/(?=.*[A-Z])/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${/(?=.*\d)/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One number
                </li>
                <li className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${/(?=.*[@$!%*?&])/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One special character (@$!%*?&)
                </li>
              </ul>
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
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
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

        {/* Security Note */}
        <div className="text-center text-xs text-[#212121]">
          <p>Your password will be encrypted and stored securely</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;