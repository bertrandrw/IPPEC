import React, { useState, useEffect, useRef } from 'react';
import { Building2, User, Mail, Phone, Clock, MapPin, Upload, X, Crosshair, Calendar, CreditCard } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../components/common/ToastContainer';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  licenseNumber: string;
  latitude: number;
  longitude: number;
  companyCode?: string;
  managingDirector?: string;
  contactPhone?: string;
  contactEmail?: string;
  licenseExpiryDate?: string;
  authorizedPharmacistId?: string;
  status?: 'active' | 'inactive' | 'pending';
  createdAt?: string;
}

interface PharmacyFormProps {
  pharmacy?: Pharmacy | null;
  onSave: (pharmacyData: Partial<Pharmacy>) => void;
  onCancel: () => void;
}

// Custom marker icon
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Map click handler component
const LocationMarker = ({ position, setPosition }: { 
  position: { lat: number, lng: number } | null, 
  setPosition: (pos: { lat: number, lng: number }) => void 
}) => {
  const map = useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
};

const PharmacyForm: React.FC<PharmacyFormProps> = ({ pharmacy, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    licenseNumber: '',
    latitude: 0,
    longitude: 0,
    companyCode: '',
    managingDirector: '',
    contactPhone: '',
    contactEmail: '',
    licenseExpiryDate: '',
    authorizedPharmacistId: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  // Initialize form with pharmacy data if editing
  useEffect(() => {
    if (pharmacy) {
      setFormData({
        name: pharmacy.name || '',
        address: pharmacy.address || '',
        licenseNumber: pharmacy.licenseNumber || '',
        latitude: pharmacy.latitude || 0,
        longitude: pharmacy.longitude || 0,
        companyCode: pharmacy.companyCode || '',
        managingDirector: pharmacy.managingDirector || '',
        contactPhone: pharmacy.contactPhone || '',
        contactEmail: pharmacy.contactEmail || '',
        licenseExpiryDate: pharmacy.licenseExpiryDate ? new Date(pharmacy.licenseExpiryDate).toISOString().split('T')[0] : '',
        authorizedPharmacistId: pharmacy.authorizedPharmacistId || ''
      });
    } else {
      // Set default coordinates (Kigali, Rwanda)
      setFormData(prev => ({
        ...prev,
        latitude: -1.9441,
        longitude: 30.0619
      }));
    }
  }, [pharmacy]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
      
      // Clear error when field is edited
      if (errors.licenseFile) {
        setErrors(prev => ({
          ...prev,
          licenseFile: ''
        }));
      }
    }
  };

  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'latitude' | 'longitude') => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          showToast('error', 'Unable to get your current location. Please enter coordinates manually or click on the map.');
        }
      );
    } else {
      showToast('error', 'Geolocation is not supported by this browser.');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Pharmacy name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    
    // Coordinates validation
    if (formData.latitude === 0 && formData.longitude === 0) {
      newErrors.coordinates = 'Please select a location on the map';
    }
    
    // Email validation
    if (formData.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }
    }
    
    // Phone validation
    if (formData.contactPhone) {
      const phoneRegex = /^(078|079|072|073)\d{7}$/;
      if (formData.contactPhone.length !== 10) {
        newErrors.contactPhone = 'Phone number must be exactly 10 characters';
      } else if (!formData.contactPhone.match(/^(078|079|072|073)/)) {
        newErrors.contactPhone = 'Phone number must start with 078, 079, 072, or 073';
      } else if (!formData.contactPhone.match(/^\d+$/)) {
        newErrors.contactPhone = 'Phone number must contain only digits';
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
      const pharmacyData = {
        name: formData.name,
        address: formData.address,
        licenseNumber: formData.licenseNumber,
        latitude: formData.latitude,
        longitude: formData.longitude,
        companyCode: formData.companyCode || undefined,
        managingDirector: formData.managingDirector || undefined,
        contactPhone: formData.contactPhone || undefined,
        contactEmail: formData.contactEmail || undefined,
        licenseExpiryDate: formData.licenseExpiryDate ? new Date(formData.licenseExpiryDate).toISOString() : undefined,
        authorizedPharmacistId: formData.authorizedPharmacistId || undefined
      };
      
      // Call the onSave function passed from parent
      await onSave(pharmacyData);
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
              {pharmacy ? 'Edit pharmacy details below.' : 'Register a new pharmacy by filling out the form below.'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        </div>
        
        {/* Pharmacy Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Pharmacy Name *
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
              placeholder="Kigali Central Pharmacy"
              required
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        {/* License Number */}
        <div>
          <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
            License Number *
          </label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className={`block w-full px-3 py-2 sm:text-sm border ${
              errors.licenseNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
            } rounded-md shadow-sm placeholder-gray-400`}
            placeholder="RWA-FDA-12345"
            required
          />
          {errors.licenseNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
          )}
        </div>
        
        {/* Company Code */}
        <div>
          <label htmlFor="companyCode" className="block text-sm font-medium text-gray-700 mb-1">
            Company Code
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="companyCode"
              name="companyCode"
              value={formData.companyCode}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-medical-500 focus:border-medical-500 placeholder-gray-400"
              placeholder="102345678"
            />
          </div>
        </div>
        
        {/* Managing Director */}
        <div>
          <label htmlFor="managingDirector" className="block text-sm font-medium text-gray-700 mb-1">
            Managing Director
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="managingDirector"
              name="managingDirector"
              value={formData.managingDirector}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-medical-500 focus:border-medical-500 placeholder-gray-400"
              placeholder="Mr. John Bosco"
            />
          </div>
        </div>
        
        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.contactEmail ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="contact@kigalipharm.rw"
            />
          </div>
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
          )}
        </div>
        
        {/* Contact Phone */}
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.contactPhone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="0781234567"
            />
          </div>
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Phone number must start with 078, 079, 072, or 073 and be exactly 10 digits
          </p>
        </div>
        
        {/* License Expiry Date */}
        <div>
          <label htmlFor="licenseExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            License Expiry Date
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="licenseExpiryDate"
              name="licenseExpiryDate"
              value={formData.licenseExpiryDate}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-medical-500 focus:border-medical-500"
            />
          </div>
        </div>
        
        {/* Location Information Section */}
        <div className="md:col-span-2 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
        </div>
        
        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Pharmacy Address *
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
              placeholder="KN 4 Ave, Kigali, Rwanda"
              required
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
        
        {/* Map */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Location on Map *
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500"
            >
              {isGettingLocation ? (
                <>
                  <LoadingSpinner size="sm" color="primary" className="mr-2" />
                  Getting location...
                </>
              ) : (
                <>
                  <Crosshair className="mr-2 h-4 w-4" />
                  Use my location
                </>
              )}
            </button>
          </div>
          
          <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
            <MapContainer 
              center={[formData.latitude || -1.9441, formData.longitude || 30.0619]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker 
                position={formData.latitude !== 0 ? { lat: formData.latitude, lng: formData.longitude } : null} 
                setPosition={(pos) => {
                  setFormData(prev => ({
                    ...prev,
                    latitude: pos.lat,
                    longitude: pos.lng
                  }));
                  
                  // Clear error when coordinates are set
                  if (errors.coordinates) {
                    setErrors(prev => ({
                      ...prev,
                      coordinates: ''
                    }));
                  }
                }}
              />
            </MapContainer>
          </div>
          
          <p className="mt-1 text-sm text-gray-500">
            Click on the map to set the pharmacy location or use the "Use my location" button.
          </p>
          
          {errors.coordinates && (
            <p className="mt-1 text-sm text-red-600">{errors.coordinates}</p>
          )}
        </div>
        
        {/* Coordinates */}
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={(e) => handleCoordinatesChange(e, 'latitude')}
            step="any"
            className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-medical-500 focus:border-medical-500"
          />
        </div>
        
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={(e) => handleCoordinatesChange(e, 'longitude')}
            step="any"
            className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md shadow-sm focus:ring-medical-500 focus:border-medical-500"
          />
        </div>
        
        {/* License Document Upload */}
        {!pharmacy && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pharmacy License Document
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {licenseFile ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-900">{licenseFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(licenseFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLicenseFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="mt-2 inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="license-file"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-medical-600 hover:text-medical-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-medical-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="license-file"
                          name="license-file"
                          type="file"
                          ref={fileInputRef}
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG up to 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Note: In the actual API integration, the license document would be uploaded to a server.
              For this demo, we're just collecting the file but not sending it.
            </p>
          </div>
        )}
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
                {pharmacy ? 'Updating...' : 'Registering...'}
              </>
            ) : (
              pharmacy ? 'Update Pharmacy' : 'Register Pharmacy'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PharmacyForm;