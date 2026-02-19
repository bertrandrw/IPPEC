import React, { useState, useEffect } from 'react';
import { Building2, User, Mail, Phone, Globe, MapPin } from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../components/common/ToastContainer';

interface Hospital {
  id: string;
  name: string;
  address: string;
  type: 'HOSPITAL' | 'CLINIC' | 'HEALTH_CENTER';
  ownership: 'GOVERNMENT' | 'PRIVATE' | 'NGO';
  email?: string;
  phone?: string;
  emergencyPhone?: string;
  website?: string;
  facilityHeadName?: string;
  facilityHeadDesignation?: string;
  status?: 'active' | 'inactive' | 'pending';
  createdAt?: string;
}

interface HospitalFormProps {
  hospital?: Hospital | null;
  onSave: (hospitalData: Partial<Hospital>) => void;
  onCancel: () => void;
}

const HospitalForm: React.FC<HospitalFormProps> = ({ hospital, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'HOSPITAL',
    ownership: 'PRIVATE',
    email: '',
    phone: '',
    emergencyPhone: '',
    website: '',
    facilityHeadName: '',
    facilityHeadDesignation: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Initialize form with hospital data if editing
  useEffect(() => {
    if (hospital) {
      setFormData({
        name: hospital.name || '',
        address: hospital.address || '',
        type: hospital.type || 'HOSPITAL',
        ownership: hospital.ownership || 'PRIVATE',
        email: hospital.email || '',
        phone: hospital.phone || '',
        emergencyPhone: hospital.emergencyPhone || '',
        website: hospital.website || '',
        facilityHeadName: hospital.facilityHeadName || '',
        facilityHeadDesignation: hospital.facilityHeadDesignation || ''
      });
    }
  }, [hospital]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Hospital name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    // Email validation
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    // Phone validation
    if (formData.phone) {
      const phoneRegex = /^(078|079|072|073)\d{7}$/;
      if (formData.phone.length !== 10) {
        newErrors.phone = 'Phone number must be exactly 10 characters';
      } else if (!formData.phone.match(/^(078|079|072|073)/)) {
        newErrors.phone = 'Phone number must start with 078, 079, 072, or 073';
      } else if (!formData.phone.match(/^\d+$/)) {
        newErrors.phone = 'Phone number must contain only digits';
      }
    }
    
    // Emergency phone validation
    if (formData.emergencyPhone) {
      const phoneRegex = /^(078|079|072|073)\d{7}$/;
      if (formData.emergencyPhone.length !== 10) {
        newErrors.emergencyPhone = 'Phone number must be exactly 10 characters';
      } else if (!formData.emergencyPhone.match(/^(078|079|072|073)/)) {
        newErrors.emergencyPhone = 'Phone number must start with 078, 079, 072, or 073';
      } else if (!formData.emergencyPhone.match(/^\d+$/)) {
        newErrors.emergencyPhone = 'Phone number must contain only digits';
      }
    }
    
    // Website validation
    if (formData.website) {
      try {
        new URL(formData.website);
      } catch (e) {
        newErrors.website = 'Please enter a valid URL (e.g., https://example.com)';
      }
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
      // Prepare data for API
      const hospitalData = {
        name: formData.name,
        address: formData.address,
        type: formData.type as 'HOSPITAL' | 'CLINIC' | 'HEALTH_CENTER',
        ownership: formData.ownership as 'GOVERNMENT' | 'PRIVATE' | 'NGO',
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        emergencyPhone: formData.emergencyPhone || undefined,
        website: formData.website || undefined,
        facilityHeadName: formData.facilityHeadName || undefined,
        facilityHeadDesignation: formData.facilityHeadDesignation || undefined
      };
      
      // Call the onSave function passed from parent
      await onSave(hospitalData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Building2 className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              {hospital ? 'Edit hospital details below.' : 'Register a new hospital by filling out the form below.'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        </div>
        
        {/* Hospital Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Hospital Name *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="King Faisal Hospital, Kigali"
              required
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        {/* Hospital Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Facility Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-medical-500 focus:border-medical-500"
            required
          >
            <option value="HOSPITAL">Hospital</option>
            <option value="CLINIC">Clinic</option>
            <option value="HEALTH_CENTER">Health Center</option>
          </select>
        </div>
        
        {/* Ownership */}
        <div>
          <label htmlFor="ownership" className="block text-sm font-medium text-gray-700 mb-1">
            Ownership *
          </label>
          <select
            id="ownership"
            name="ownership"
            value={formData.ownership}
            onChange={handleChange}
            className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-medical-500 focus:border-medical-500"
            required
          >
            <option value="GOVERNMENT">Government</option>
            <option value="PRIVATE">Private</option>
            <option value="NGO">NGO</option>
          </select>
        </div>
        
        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.address ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="KG 544 St, Gasabo, Kigali"
              required
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
        
        {/* Contact Information Section */}
        <div className="md:col-span-2 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
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
              placeholder="info@kfhk.rw"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
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
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Phone number must start with 078, 079, 072, or 073 and be exactly 10 digits
          </p>
        </div>
        
        {/* Emergency Phone */}
        <div>
          <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Phone
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-red-400" />
            </div>
            <input
              type="tel"
              id="emergencyPhone"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.emergencyPhone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="0781234567"
            />
          </div>
          {errors.emergencyPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone}</p>
          )}
        </div>
        
        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.website ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="https://kfh.rw"
            />
          </div>
          {errors.website && (
            <p className="mt-1 text-sm text-red-600">{errors.website}</p>
          )}
        </div>
        
        {/* Facility Head Information Section */}
        <div className="md:col-span-2 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Facility Head Information</h3>
        </div>
        
        {/* Facility Head Name */}
        <div>
          <label htmlFor="facilityHeadName" className="block text-sm font-medium text-gray-700 mb-1">
            Facility Head Name
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="facilityHeadName"
              name="facilityHeadName"
              value={formData.facilityHeadName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-medical-500 focus:border-medical-500 placeholder-gray-400"
              placeholder="Dr. Zereihun Abebe"
            />
          </div>
        </div>
        
        {/* Facility Head Designation */}
        <div>
          <label htmlFor="facilityHeadDesignation" className="block text-sm font-medium text-gray-700 mb-1">
            Facility Head Designation
          </label>
          <input
            type="text"
            id="facilityHeadDesignation"
            name="facilityHeadDesignation"
            value={formData.facilityHeadDesignation}
            onChange={handleChange}
            className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-medical-500 focus:border-medical-500 placeholder-gray-400"
            placeholder="Chief Executive Officer"
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="pt-5 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
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
                {hospital ? 'Updating...' : 'Registering...'}
              </>
            ) : (
              hospital ? 'Update Hospital' : 'Register Hospital'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default HospitalForm;