import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Globe, Edit, Trash2, Eye, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';

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

interface HospitalListProps {
  hospitals: Hospital[];
  onEdit: (hospital: Hospital) => void;
  onDelete: (id: string) => void;
}

const HospitalList: React.FC<HospitalListProps> = ({ hospitals, onEdit, onDelete }) => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'HOSPITAL':
        return 'Hospital';
      case 'CLINIC':
        return 'Clinic';
      case 'HEALTH_CENTER':
        return 'Health Center';
      default:
        return type;
    }
  };

  const getOwnershipLabel = (ownership: string) => {
    switch (ownership) {
      case 'GOVERNMENT':
        return 'Government';
      case 'PRIVATE':
        return 'Private';
      case 'NGO':
        return 'NGO';
      default:
        return ownership;
    }
  };

  if (selectedHospital) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{selectedHospital.name}</h3>
          <button
            onClick={() => setSelectedHospital(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to list
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Hospital Details</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-700">{selectedHospital.address}</span>
                </div>
                {selectedHospital.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{selectedHospital.phone}</span>
                  </div>
                )}
                {selectedHospital.emergencyPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-red-400" />
                    <span className="text-gray-700">Emergency: {selectedHospital.emergencyPhone}</span>
                  </div>
                )}
                {selectedHospital.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{selectedHospital.email}</span>
                  </div>
                )}
                {selectedHospital.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a 
                      href={selectedHospital.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedHospital.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Additional Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-500 w-32">Type:</span>
                  <span className="text-gray-900">{getTypeLabel(selectedHospital.type)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-32">Ownership:</span>
                  <span className="text-gray-900">{getOwnershipLabel(selectedHospital.ownership)}</span>
                </div>
                {selectedHospital.facilityHeadName && (
                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Facility Head:</span>
                    <span className="text-gray-900">{selectedHospital.facilityHeadName}</span>
                  </div>
                )}
                {selectedHospital.facilityHeadDesignation && (
                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Designation:</span>
                    <span className="text-gray-900">{selectedHospital.facilityHeadDesignation}</span>
                  </div>
                )}
                {selectedHospital.createdAt && (
                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Registered On:</span>
                    <span className="text-gray-900">{new Date(selectedHospital.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="text-gray-500 w-32">Status:</span>
                  <div className="flex items-center">
                    {getStatusIcon(selectedHospital.status)}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedHospital.status)}`}>
                      {selectedHospital.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onEdit(selectedHospital)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Hospital
            </button>
            <button
              onClick={() => {
                onDelete(selectedHospital.id);
                setSelectedHospital(null);
              }}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Hospital
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hospitals found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or add a new hospital.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hospitals.map((hospital) => (
        <div
          key={hospital.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-10 h-10 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getTypeLabel(hospital.type)}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {getOwnershipLabel(hospital.ownership)}
                  </span>
                </div>
              </div>
            </div>
            {hospital.status && (
              <div className="flex items-center">
                {getStatusIcon(hospital.status)}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hospital.status)}`}>
                  {hospital.status}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <span className="text-sm text-gray-600">{hospital.address}</span>
            </div>
            {hospital.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{hospital.phone}</span>
              </div>
            )}
            {hospital.email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{hospital.email}</span>
              </div>
            )}
            {hospital.facilityHeadName && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{hospital.facilityHeadName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => setSelectedHospital(hospital)}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(hospital)}
                className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(hospital.id)}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HospitalList;