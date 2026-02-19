import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Clock, Edit, Trash2, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface PharmacyListProps {
  pharmacies: Pharmacy[];
  onEdit: (pharmacy: Pharmacy) => void;
  onDelete: (id: string) => void;
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

const PharmacyList: React.FC<PharmacyListProps> = ({ pharmacies, onEdit, onDelete }) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

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

  if (selectedPharmacy) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{selectedPharmacy.name}</h3>
          <button
            onClick={() => setSelectedPharmacy(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to list
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Pharmacy Details</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-700">{selectedPharmacy.address}</span>
                </div>
                {selectedPharmacy.contactPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{selectedPharmacy.contactPhone}</span>
                  </div>
                )}
                {selectedPharmacy.contactEmail && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{selectedPharmacy.contactEmail}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">License: {selectedPharmacy.licenseNumber}</span>
                </div>
                {selectedPharmacy.licenseExpiryDate && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      License Expires: {new Date(selectedPharmacy.licenseExpiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Additional Information</h4>
              <div className="space-y-3">
                {selectedPharmacy.managingDirector && (
                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Managing Director:</span>
                    <span className="text-gray-900">{selectedPharmacy.managingDirector}</span>
                  </div>
                )}
                {selectedPharmacy.companyCode && (
                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Company Code:</span>
                    <span className="text-gray-900">{selectedPharmacy.companyCode}</span>
                  </div>
                )}
                {selectedPharmacy.createdAt && (
                  <div className="flex items-center">
                    <span className="text-gray-500 w-32">Registered On:</span>
                    <span className="text-gray-900">{new Date(selectedPharmacy.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="text-gray-500 w-32">Status:</span>
                  <div className="flex items-center">
                    {getStatusIcon(selectedPharmacy.status)}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPharmacy.status)}`}>
                      {selectedPharmacy.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-3">Location</h4>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
              <MapContainer 
                center={[selectedPharmacy.latitude, selectedPharmacy.longitude]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker 
                  position={[selectedPharmacy.latitude, selectedPharmacy.longitude]} 
                  icon={customIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <strong>{selectedPharmacy.name}</strong><br />
                      {selectedPharmacy.address}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onEdit(selectedPharmacy)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Pharmacy
            </button>
            <button
              onClick={() => {
                onDelete(selectedPharmacy.id);
                setSelectedPharmacy(null);
              }}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Pharmacy
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pharmacies.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pharmacies found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or add a new pharmacy.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pharmacies.map((pharmacy) => (
        <div
          key={pharmacy.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-10 h-10 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{pharmacy.name}</h3>
                <p className="text-sm text-gray-500">License: {pharmacy.licenseNumber}</p>
              </div>
            </div>
            {pharmacy.status && (
              <div className="flex items-center">
                {getStatusIcon(pharmacy.status)}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pharmacy.status)}`}>
                  {pharmacy.status}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <span className="text-sm text-gray-600">{pharmacy.address}</span>
            </div>
            {pharmacy.contactPhone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{pharmacy.contactPhone}</span>
              </div>
            )}
            {pharmacy.contactEmail && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{pharmacy.contactEmail}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => setSelectedPharmacy(pharmacy)}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(pharmacy)}
                className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(pharmacy.id)}
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

export default PharmacyList;