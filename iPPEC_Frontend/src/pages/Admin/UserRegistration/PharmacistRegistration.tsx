import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Pill, Building2, Shield, Upload } from 'lucide-react';
import { useToast } from '../../../components/common/ToastContainer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { BASE_URL } from '../../../utils/api';

interface PharmacistRegistrationProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

interface PharmacistFormData {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  pharmacyId: string;
  licenceNumber: string;
}

interface Pharmacy {
  id: string;
  name: string;
  address?: string;
  createdAt?: string;
}

const PharmacistRegistration: React.FC<PharmacistRegistrationProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<PharmacistFormData>({
    email: '',
    phone: '',
    password: '',
    fullName: '',
    pharmacyId: '',
    licenceNumber: ''
  });

  const [errors, setErrors] = useState<Partial<PharmacistFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);
  const { showToast } = useToast();

  // Fetch pharmacies on component mount
  useEffect(() => {
    const fetchPharmacies = async () => {
      setLoadingPharmacies(true);
      try {
        const token = localStorage.getItem('mediflow_token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch(`${BASE_URL}/pharmacies`, {
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
          setPharmacies(result.data.data || []);
          
          // Set default pharmacy if available
          if (result.data.data && result.data.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              pharmacyId: result.data.data[0].id
            }));
          }
        } else {
          throw new Error(result.message || 'Failed to fetch pharmacies');
        }
      } catch (err: any) {
        console.error('Error fetching pharmacies:', err);
        showToast('error', 'Failed to load pharmacies. Using default pharmacy.');
        
        // Set a default pharmacy for testing
        setPharmacies([{
          id: 'cmcc9us3a00009zx70jtf1845',
          name: 'City General Pharmacy'
        }]);
        
        setFormData(prev => ({
          ...prev,
          pharmacyId: 'cmcc9us3a00009zx70jtf1845'
        }));
      } finally {
        setLoadingPharmacies(false);
      }
    };
    
    fetchPharmacies();
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof PharmacistFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PharmacistFormData> = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.pharmacyId.trim()) newErrors.pharmacyId = 'Pharmacy is required';
    if (!formData.licenceNumber.trim()) newErrors.licenceNumber = 'License number is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (basic)
    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
      
      const response = await fetch(`${BASE_URL}/pharmacists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Call the onSuccess callback but don't show toast here
        onSuccess();
        
        // Reset form
        setFormData({
          email: '',
          phone: '',
          password: '',
          fullName: '',
          pharmacyId: pharmacies.length > 0 ? pharmacies[0].id : '',
          licenceNumber: ''
        });
      } else {
        throw new Error(result.message || 'Failed to register pharmacist');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      onError(error.message || 'Failed to register pharmacist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Pill className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              You are registering a new pharmacist account. All fields marked with * are required.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        </div>
        
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.fullName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="Enter full name"
              required
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
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
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
              placeholder="pharmacist@example.com"
              required
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
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
        
        {/* Pharmacy Information Section */}
        <div className="md:col-span-2 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pharmacy Information</h3>
        </div>
        
        {/* License Number */}
        <div>
          <label htmlFor="licenceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            License Number *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="licenceNumber"
              name="licenceNumber"
              value={formData.licenceNumber}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.licenceNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="PH123456"
              required
            />
          </div>
          {errors.licenceNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.licenceNumber}</p>
          )}
        </div>
        
        {/* Pharmacy */}
        <div>
          <label htmlFor="pharmacyId" className="block text-sm font-medium text-gray-700 mb-1">
            Pharmacy *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            {loadingPharmacies ? (
              <div className="flex items-center pl-10 pr-3 py-2 border border-gray-300 rounded-md">
                <LoadingSpinner size="sm" color="primary" />
                <span className="ml-2 text-sm text-gray-500">Loading pharmacies...</span>
              </div>
            ) : (
              <select
                id="pharmacyId"
                name="pharmacyId"
                value={formData.pharmacyId}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-2 text-base sm:text-sm border ${
                  errors.pharmacyId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
                } rounded-md shadow-sm focus:outline-none`}
                required
              >
                <option value="" disabled>Select pharmacy</option>
                {pharmacies.map((pharmacy) => (
                  <option key={pharmacy.id} value={pharmacy.id}>
                    {pharmacy.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {errors.pharmacyId && (
            <p className="mt-1 text-sm text-red-600">{errors.pharmacyId}</p>
          )}
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
              'Register Pharmacist'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PharmacistRegistration;