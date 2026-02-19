import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Shield, Upload, CheckSquare } from 'lucide-react';
import { useToast } from '../../../components/common/ToastContainer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { BASE_URL } from '../../../utils/api';

interface InsurerRegistrationProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

interface InsurerFormData {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  insuranceCompanyId: string;
}

interface InsuranceCompany {
  id: string;
  name: string;
  address?: string;
  createdAt?: string;
}

const InsurerRegistration: React.FC<InsurerRegistrationProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<InsurerFormData>({
    email: '',
    phone: '',
    password: '',
    fullName: '',
    insuranceCompanyId: ''
  });

  const [errors, setErrors] = useState<Partial<InsurerFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const { showToast } = useToast();

  // Fetch insurance companies on component mount
  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const token = localStorage.getItem('mediflow_token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch(`${BASE_URL}/insurance/admin/companies`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setInsuranceCompanies(result.data.data || []);
          
          // Set default company if available
          if (result.data.data && result.data.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              insuranceCompanyId: result.data.data[0].id
            }));
          }
        } else {
          throw new Error(result.message || 'Failed to fetch insurance companies');
        }
      } catch (err: any) {
        console.error('Error fetching insurance companies:', err);
        showToast('error', 'Failed to load insurance companies. Using default company.');
        
        // Set a default company for testing
        setInsuranceCompanies([{
          id: 'cmclqsw2p00029zq3ecy9efz9',
          name: 'HealthNet Insurance'
        }]);
        
        setFormData(prev => ({
          ...prev,
          insuranceCompanyId: 'cmclqsw2p00029zq3ecy9efz9'
        }));
      } finally {
        setLoadingCompanies(false);
      }
    };
    
    fetchInsuranceCompanies();
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof InsurerFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<InsurerFormData> = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.insuranceCompanyId.trim()) newErrors.insuranceCompanyId = 'Insurance company is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^(078|079|072|073)\d{7}$/;
    if (formData.phone) {
      if (formData.phone.length !== 10) {
        newErrors.phone = 'Phone number must be exactly 10 characters';
      } else if (!formData.phone.match(/^(078|079|072|073)/)) {
        newErrors.phone = 'Phone number must start with 078, 079, 072, or 073';
      } else if (!formData.phone.match(/^\d+$/)) {
        newErrors.phone = 'Phone number must contain only digits';
      }
    }
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${BASE_URL}/admin/insurers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Call the onSuccess callback
        onSuccess();
        
        // Reset form
        setFormData({
          email: '',
          phone: '',
          password: '',
          fullName: '',
          insuranceCompanyId: insuranceCompanies.length > 0 ? insuranceCompanies[0].id : ''
        });
      } else {
        throw new Error(result.message || 'Failed to register insurer');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      onError(error.message || 'Failed to register insurer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Building2 className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-indigo-700">
              You are registering a new insurance company user. All fields marked with * are required.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Information Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
        </div>
        
        {/* Insurance Company */}
        <div>
          <label htmlFor="insuranceCompanyId" className="block text-sm font-medium text-gray-700 mb-1">
            Insurance Company *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            {loadingCompanies ? (
              <div className="flex items-center pl-10 pr-3 py-2 border border-gray-300 rounded-md">
                <LoadingSpinner size="sm" color="primary" />
                <span className="ml-2 text-sm text-gray-500">Loading companies...</span>
              </div>
            ) : (
              <select
                id="insuranceCompanyId"
                name="insuranceCompanyId"
                value={formData.insuranceCompanyId}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-2 text-base sm:text-sm border ${
                  errors.insuranceCompanyId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
                } rounded-md shadow-sm focus:outline-none`}
                required
              >
                <option value="" disabled>Select insurance company</option>
                {insuranceCompanies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {errors.insuranceCompanyId && (
            <p className="mt-1 text-sm text-red-600">{errors.insuranceCompanyId}</p>
          )}
        </div>
        
        {/* Representative Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Representative Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`block w-full px-3 py-2 sm:text-sm border ${
              errors.fullName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
            } rounded-md shadow-sm placeholder-gray-400`}
            placeholder="Bob Vance"
            required
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="claims.manager@healthnet.com"
              required
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="0781234567"
              required
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Phone number must start with 078, 079, 072, or 073 and be exactly 10 digits
          </p>
        </div>
        
        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full px-3 py-2 sm:text-sm border ${
                errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="Enter password"
              required
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 6 characters long
          </p>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="pt-5 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-medical-600 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-2" />
                Registering...
              </>
            ) : (
              'Register Insurer'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InsurerRegistration;