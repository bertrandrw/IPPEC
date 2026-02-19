import React, { useState, useEffect } from 'react';
import { Pill, DollarSign, Building2, Calendar, Package, Shield } from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../components/common/ToastContainer';

interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  dosageForm?: string;
  strength?: string;
  currentStock?: number;
  minStock?: number;
  expiryDate?: string;
  requiresPrescription?: boolean;
}

interface MedicineFormProps {
  medicine?: Medicine | null;
  onSave: (medicineData: Partial<Medicine>) => void;
  onCancel: () => void;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ medicine, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    brandName: '',
    genericName: '',
    manufacturer: '',
    price: 0,
    category: '',
    dosageForm: '',
    strength: '',
    currentStock: 0,
    minStock: 20,
    expiryDate: '',
    requiresPrescription: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Categories and dosage forms for dropdowns
  const categories = [
    'Analgesic', 'Antibiotic', 'Antidiabetic', 'Antihypertensive',
    'Antihistamine', 'Antidepressant', 'Vitamin', 'Supplement'
  ];

  const dosageForms = [
    'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Inhaler'
  ];

  // Initialize form with medicine data if editing
  useEffect(() => {
    if (medicine) {
      setFormData({
        brandName: medicine.brandName || '',
        genericName: medicine.genericName || '',
        manufacturer: medicine.manufacturer || '',
        price: medicine.price || 0,
        category: medicine.category || '',
        dosageForm: medicine.dosageForm || '',
        strength: medicine.strength || '',
        currentStock: medicine.currentStock || 0,
        minStock: medicine.minStock || 20,
        expiryDate: medicine.expiryDate || '',
        requiresPrescription: medicine.requiresPrescription || false
      });
    }
  }, [medicine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
    if (!formData.brandName.trim()) newErrors.brandName = 'Brand name is required';
    if (!formData.genericName.trim()) newErrors.genericName = 'Generic name is required';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    
    // Validate stock numbers
    if (formData.currentStock < 0) newErrors.currentStock = 'Current stock cannot be negative';
    if (formData.minStock < 0) newErrors.minStock = 'Minimum stock cannot be negative';
    
    // Validate expiry date if provided
    if (formData.expiryDate) {
      const today = new Date();
      const expiryDate = new Date(formData.expiryDate);
      if (expiryDate < today) {
        newErrors.expiryDate = 'Expiry date cannot be in the past';
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
      const medicineData = {
        brandName: formData.brandName,
        genericName: formData.genericName,
        manufacturer: formData.manufacturer,
        price: formData.price,
        // Additional fields that might be supported in the future
        category: formData.category || undefined,
        dosageForm: formData.dosageForm || undefined,
        strength: formData.strength || undefined,
        currentStock: formData.currentStock || undefined,
        minStock: formData.minStock || undefined,
        expiryDate: formData.expiryDate || undefined,
        requiresPrescription: formData.requiresPrescription || undefined
      };
      
      // Call the onSave function passed from parent
      await onSave(medicineData);
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
            <Pill className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              {medicine ? 'Edit medicine details below.' : 'Add a new medicine by filling out the form below.'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        </div>
        
        {/* Brand Name */}
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
            Brand Name *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Pill className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.brandName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="Paracetamol"
              required
            />
          </div>
          {errors.brandName && (
            <p className="mt-1 text-sm text-red-600">{errors.brandName}</p>
          )}
        </div>
        
        {/* Generic Name */}
        <div>
          <label htmlFor="genericName" className="block text-sm font-medium text-gray-700 mb-1">
            Generic Name *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Pill className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="genericName"
              name="genericName"
              value={formData.genericName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.genericName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="Acetaminophen"
              required
            />
          </div>
          {errors.genericName && (
            <p className="mt-1 text-sm text-red-600">{errors.genericName}</p>
          )}
        </div>
        
        {/* Manufacturer */}
        <div>
          <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
            Manufacturer *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.manufacturer ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="PharmaCorp"
              required
            />
          </div>
          {errors.manufacturer && (
            <p className="mt-1 text-sm text-red-600">{errors.manufacturer}</p>
          )}
        </div>
        
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price *
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.price ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-medical-500 focus:border-medical-500'
              } rounded-md shadow-sm placeholder-gray-400`}
              placeholder="0.00"
              required
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
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
                {medicine ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              medicine ? 'Update Medicine' : 'Add Medicine'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MedicineForm;