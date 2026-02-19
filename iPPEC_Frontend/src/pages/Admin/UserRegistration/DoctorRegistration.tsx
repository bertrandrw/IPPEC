import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Stethoscope, Building2, Shield, Upload } from 'lucide-react';
import { BASE_URL } from '../../../utils/api';
import { useToast } from '../../../components/common/ToastContainer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

interface DoctorRegistrationProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

interface DoctorFormData {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  credentials: string;
  specialty: string;
  hospitalId: string;
  licenceNumber: string;
}

interface Hospital {
  id: string;
  name: string;
  address?: string;
  createdAt?: string;
}

const DoctorRegistration: React.FC<DoctorRegistrationProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<DoctorFormData>({
    email: '',
    phone: '',
    password: '',
    fullName: '',
    credentials: '',
    specialty: '',
    hospitalId: '',
    licenceNumber: ''
  });

  const [errors, setErrors] = useState<Partial<DoctorFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const { showToast } = useToast();

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Family Medicine',
    'Gastroenterology',
    'Hematology',
    'Infectious Disease',
    'Internal Medicine',
    'Nephrology',
    'Neurology',
    'Obstetrics and Gynecology',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Otolaryngology',
    'Pediatrics',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Rheumatology',
    'Urology'
  ];

  // Fetch hospitals on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      setLoadingHospitals(true);
      try {
        const token = localStorage.getItem('mediflow_token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        
        const response = await fetch(`${BASE_URL}/hospitals`, {
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
          setHospitals(result.data.data || []);
          
          // Set default hospital if available
          if (result.data.data && result.data.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              hospitalId: result.data.data[0].id
            }));
          }
        } else {
          throw new Error(result.message || 'Failed to fetch hospitals');
        }
      } catch (err: any) {
        console.error('Error fetching hospitals:', err);
        showToast('error', 'Failed to load hospitals. Using default hospital.');
        
        // Set a default hospital for testing
        setHospitals([{
          id: 'cmcc9us3a00009zx70jtf1845',
          name: 'City General Hospital'
        }]);
        
        setFormData(prev => ({
          ...prev,
          hospitalId: 'cmcc9us3a00009zx70jtf1845'
        }));
      } finally {
        setLoadingHospitals(false);
      }
    };
    
    fetchHospitals();
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof DoctorFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DoctorFormData> = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.credentials.trim()) newErrors.credentials = 'Credentials are required';
    if (!formData.specialty.trim()) newErrors.specialty = 'Specialty is required';
    if (!formData.hospitalId.trim()) newErrors.hospitalId = 'Hospital is required';
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
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
      
      
      const response = await fetch(`${BASE_URL}/admin/doctors`, {
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
          credentials: '',
          specialty: '',
          hospitalId: hospitals.length > 0 ? hospitals[0].id : '',
          licenceNumber: ''
        });
      } else {
        throw new Error(result.message || 'Failed to register doctor');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      onError(error.message || 'Failed to register doctor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Stethoscope className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              You are registering a new doctor account. All fields are required.
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
              placeholder="Dr. Alice Wonder"
              required
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
        
        {/* Credentials */}
        <div>
          <label htmlFor="credentials" className="block text-sm font-medium text-gray-700 mb-1">
            Credentials *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="credentials"
              name="credentials"
              value={formData.credentials}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.credentials ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="MD, PhD"
              required
            />
          </div>
          {errors.credentials && (
            <p className="mt-1 text-sm text-red-600">{errors.credentials}</p>
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
              placeholder="0787885198"
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
              placeholder="doc1@cgh.com"
              required
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Professional Information Section */}
        <div className="md:col-span-2 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
        </div>
        
        {/* License Number */}
        <div>
          <label htmlFor="licenceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Medical License Number *
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
              placeholder="MD123456"
              required
            />
          </div>
          {errors.licenceNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.licenceNumber}</p>
          )}
        </div>
        
        {/* Specialty */}
        <div>
          <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
            Specialty *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Stethoscope className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-2 text-base sm:text-sm border ${
                errors.specialty ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm focus:outline-none`}
              required
            >
              <option value="" disabled>Select specialty</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          {errors.specialty && (
            <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>
          )}
        </div>
        
        {/* Hospital */}
        <div>
          <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700 mb-1">
            Hospital/Clinic *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            {loadingHospitals ? (
              <div className="flex items-center pl-10 pr-3 py-2 border border-gray-300 rounded-md">
                <LoadingSpinner size="sm" color="primary" />
                <span className="ml-2 text-sm text-gray-500">Loading hospitals...</span>
              </div>
            ) : (
              <select
                id="hospitalId"
                name="hospitalId"
                value={formData.hospitalId}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-2 text-base sm:text-sm border ${
                  errors.hospitalId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
                } rounded-md shadow-sm focus:outline-none`}
                required
              >
                <option value="" disabled>Select hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {errors.hospitalId && (
            <p className="mt-1 text-sm text-red-600">{errors.hospitalId}</p>
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
              placeholder="strongPassword123!"
              required
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters long with letters, numbers, and special characters
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
              'Register Doctor'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DoctorRegistration;
