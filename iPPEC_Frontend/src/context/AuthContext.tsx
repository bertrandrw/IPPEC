import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { User, AuthContextType, RegisterData } from '../types';
import { useToast } from '../components/common/ToastContainer';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    // Check for stored user and token on app load
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('mediflow_user');
        const storedToken = localStorage.getItem('mediflow_token');
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('mediflow_user');
        localStorage.removeItem('mediflow_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (emailOrPhone: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await authAPI.login(emailOrPhone, password);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Transform backend user data to match frontend User interface
        const transformedUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.email.split('@')[0], // Temporary name from email
          role: userData.role.toLowerCase() as User['role'],
          phone: userData.phone,
          createdAt: userData.createdAt,
          isActive: true,
          isVerified: userData.isVerified,
        };

        // Store token and user data
        localStorage.setItem('mediflow_token', token);
        localStorage.setItem('mediflow_user', JSON.stringify(transformedUser));
        
        setUser(transformedUser);

        // Show success toast
        showToast('success', 'Login successful! Welcome back.', 5000);

        // Redirect based on role
        const dashboardRoutes = {
          admin: '/admin/dashboard',
          doctor: '/doctor/dashboard',
          pharmacist: '/pharmacist/dashboard',
          patient: '/patient/dashboard',
          insurer: '/insurer/dashboard',
        };

        const redirectPath = dashboardRoutes[transformedUser.role] || '/dashboard';
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Clear any stored data on login failure
      localStorage.removeItem('mediflow_token');
      localStorage.removeItem('mediflow_user');
      
      // Extract error message from API response
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.data?.message) {
        // API returned a specific error message
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Generic error message
        errorMessage = error.message;
      }
      
      // Show error toast that disappears after 5 seconds
      showToast('error', errorMessage, 5000);
      
      // Re-throw with user-friendly message for any additional error handling
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setLoading(true);
    try {
      // Prepare data for backend API
      const registrationData = {
        email: userData.email,
        phone: userData.phone || '',
        password: userData.password,
        role: 'PATIENT', // Fixed role for patient registration
        fullName: userData.name,
        dateOfBirth: userData.dateOfBirth || new Date().toISOString(),
        sex: userData.sex || 'Other',
        nid: userData.nid || '',
      };

      const response = await authAPI.register(registrationData);

      if (response.success) {
        // Show success toast that disappears after 5 seconds
        showToast('success', 'Registration successful! Please sign in to continue.', 5000);
        
        // Wait for 5 seconds then redirect to login page
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 5000);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Extract error message from API response
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        // API returned a specific error message
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Generic error message
        errorMessage = error.message;
      }
      
      // Show error toast that disappears after 5 seconds
      showToast('error', errorMessage, 5000);
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    // Clear local storage and state
    localStorage.removeItem('mediflow_token');
    localStorage.removeItem('mediflow_user');
    setUser(null);
    showToast('info', 'You have been logged out successfully.', 5000);
    navigate('/login', { replace: true });
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};