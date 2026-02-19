import React, { useState } from 'react';
import { Pill, Edit, Trash2, Eye, AlertCircle, Calendar, DollarSign, Package, Shield } from 'lucide-react';

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

interface MedicineListProps {
  medicines: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
}

const MedicineList: React.FC<MedicineListProps> = ({ medicines, onEdit, onDelete }) => {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const isLowStock = (medicine: Medicine) => {
    return (medicine.currentStock || 0) < (medicine.minStock || 20);
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  };

  if (selectedMedicine) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{selectedMedicine.brandName}</h3>
          <button
            onClick={() => setSelectedMedicine(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to list
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Medicine Details</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Brand Name:</span>
                  <span className="text-gray-900 font-medium">{selectedMedicine.brandName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Generic Name:</span>
                  <span className="text-gray-900">{selectedMedicine.genericName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Manufacturer:</span>
                  <span className="text-gray-900">{selectedMedicine.manufacturer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-900">{selectedMedicine.category || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Dosage Form:</span>
                  <span className="text-gray-900">{selectedMedicine.dosageForm || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Strength:</span>
                  <span className="text-gray-900">{selectedMedicine.strength || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Inventory Information</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Current Stock:</span>
                  <span className={`text-gray-900 font-medium ${isLowStock(selectedMedicine) ? 'text-red-600' : ''}`}>
                    {selectedMedicine.currentStock || 0} units
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Minimum Stock:</span>
                  <span className="text-gray-900">{selectedMedicine.minStock || 0} units</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Price:</span>
                  <span className="text-gray-900 font-medium">${selectedMedicine.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Expiry Date:</span>
                  <span className={`text-gray-900 ${isExpiringSoon(selectedMedicine.expiryDate) ? 'text-orange-600' : ''}`}>
                    {selectedMedicine.expiryDate ? new Date(selectedMedicine.expiryDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Requires Prescription:</span>
                  <span className="text-gray-900">
                    {selectedMedicine.requiresPrescription ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Created At:</span>
                  <span className="text-gray-900">
                    {selectedMedicine.createdAt ? new Date(selectedMedicine.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onEdit(selectedMedicine)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Medicine
            </button>
            <button
              onClick={() => {
                onDelete(selectedMedicine.id);
                setSelectedMedicine(null);
              }}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Medicine
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="text-center py-12">
        <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or add a new medicine.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medicine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price (RWF)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicines.map((medicine) => (
              <tr key={medicine.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Pill className="w-8 h-8 text-medical-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{medicine.brandName}</div>
                      <div className="text-sm text-gray-500">{medicine.genericName}</div>
                      <div className="text-xs text-gray-400">{medicine.manufacturer}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {medicine.category || 'Uncategorized'}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">{medicine.dosageForm} • {medicine.strength}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{Number(medicine.price).toLocaleString('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 2 })}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setSelectedMedicine(medicine)}
                      className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(medicine)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(medicine.id)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineList;