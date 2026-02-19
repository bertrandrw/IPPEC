import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation,
  Heart,
  Shield,
  Truck,
  CreditCard,
  CheckCircle,
  Eye,
  Crosshair,
  Building2,
  Pill,
  Package,
  AlertCircle,
  Send,
  Phone,
  Clock,
  Star,
  X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { pharmacyAPI } from '../../utils/api';

interface PrescriptionPharmacy {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface Prescription {
  id: string;
  createdAt: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  chiefComplaints: string;
  findingsOnExam: string;
  investigations: string | null;
  advice: string;
  followUpDate: string;
  status: 'ACTIVE' | 'CANCELLED' | 'FULFILLED' | 'EXPIRED';
  dispensedById: string | null;
  dispensedAt: string | null;
  doctor: {
    fullName: string;
    specialty: string;
  };
  hospital: {
    name: string;
  };
  medicines: Array<{
    id: string;
    prescriptionId: string;
    medicineId: string;
    route: string;
    form: string;
    quantityPerDose: number;
    frequency: string;
    durationInDays: number;
    fullInstruction: string;
    totalQuantity: string;
    isDispensed: boolean;
    medicine: {
      id: string;
      brandName: string;
      genericName: string;
      manufacturer: string;
      price: string;
      createdAt: string;
    };
  }>;
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

// Component to recenter map
const RecenterMap = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);
  return null;
};

interface SharePrescriptionModalProps {
  prescription: Prescription;
  isOpen: boolean;
  onClose: () => void;
}

const SharePrescriptionModal: React.FC<SharePrescriptionModalProps> = ({
  prescription,
  isOpen,
  onClose
}) => {
  const [pharmacies, setPharmacies] = useState<PrescriptionPharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1.9441, 30.0619]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<PrescriptionPharmacy | null>(null);
  const [sortBy, setSortBy] = useState('distance');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pharmacyToSend, setPharmacyToSend] = useState<PrescriptionPharmacy | null>(null);

  useEffect(() => {
    if (isOpen) {
      getUserLocation();
    }
  }, [isOpen]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userPos);
          setMapCenter(userPos);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('Location access denied. Please allow location access.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location information unavailable.');
              break;
            case error.TIMEOUT:
              setError('Location request timed out. Please try again.');
              break;
            default:
              setError('Unable to get your location.');
          }
        },
        options
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const searchPharmaciesForPrescription = async () => {
    if (!userLocation) {
      setError('Please allow location access to find nearby pharmacies.');
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const response = await pharmacyAPI.findPharmaciesForPrescription({
        prescriptionId: prescription.id,
        latitude: userLocation[0],
        longitude: userLocation[1],
      });

      if (response.success) {
        const pharmaciesWithCoordinates = response.data.map((pharmacy) => ({
          ...pharmacy,
          coordinates: {
            lat: pharmacy.latitude,
            lng: pharmacy.longitude
          }
        }));
        
        setPharmacies(pharmaciesWithCoordinates);
      } else {
        setError(response.message || 'Failed to find pharmacies');
      }
    } catch (err: any) {
      console.error('Error searching pharmacies:', err);
      setError('Failed to search pharmacies. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const sendPrescriptionToPharmacy = async (pharmacy: PrescriptionPharmacy) => {
    setPharmacyToSend(pharmacy);
    setShowConfirmation(true);
  };

  const confirmSendOrder = async () => {
    if (!pharmacyToSend) return;
    
    setSending(true);
    setError(null);
    setShowConfirmation(false);

    try {
      // Create orderItems array from prescription medicines
      const orderItems = prescription.medicines.map(medication => ({
        medicineId: medication.medicineId,
        quantity: parseInt(medication.totalQuantity) || 1
      }));

      const response = await pharmacyAPI.sendPrescriptionToPharmacy({
        prescriptionId: prescription.id,
        pharmacyId: pharmacyToSend.id,
        orderItems: orderItems,
      });

      if (response.success) {
        setSuccess(`Order placed successfully with ${pharmacyToSend.name}! Order ID: ${response.data.id}`);
        setSelectedPharmacy(null);
        setPharmacyToSend(null);
        // Refresh the pharmacies list
        searchPharmaciesForPrescription();
      } else {
        setError(response.message || 'Failed to place order');
      }
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const sortedPharmacies = [...pharmacies].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distance - b.distance;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-medical-600 to-primary-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Share Prescription with Pharmacy</h2>
                <p className="text-medical-100 mt-1">
                  Find pharmacies that can fulfill your prescription
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Prescription Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Pill className="w-5 h-5 text-medical-600" />
                <h3 className="text-lg font-semibold text-gray-900">Prescription Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Doctor: <span className="font-medium text-gray-900">{prescription.doctor.fullName}</span></p>
                  <p className="text-sm text-gray-600">Hospital: <span className="font-medium text-gray-900">{prescription.hospital.name}</span></p>
                  <p className="text-sm text-gray-600">Date: <span className="font-medium text-gray-900">{new Date(prescription.createdAt).toLocaleDateString()}</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Medicines: <span className="font-medium text-gray-900">{prescription.medicines.length} items</span></p>
                  <p className="text-sm text-gray-600">Status: <span className="font-medium text-gray-900">{prescription.status}</span></p>
                </div>
              </div>
              
              {/* Medicines List */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Medicines to be ordered:</h4>
                <div className="space-y-2">
                  {prescription.medicines.map((medication, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{medication.medicine.brandName}</p>
                          <p className="text-sm text-gray-600">{medication.medicine.genericName}</p>
                          <p className="text-xs text-gray-500">{medication.medicine.manufacturer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Qty: {medication.totalQuantity}</p>
                          <p className="text-xs text-gray-500">Price: ${medication.medicine.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location and Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Your Location</span>
                </div>
                <button
                  onClick={getUserLocation}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
              
              {userLocation ? (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700">
                    Location detected: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-700">Detecting your location...</span>
                </div>
              )}

              <button
                onClick={searchPharmaciesForPrescription}
                disabled={!userLocation || searching}
                className="w-full px-6 py-3 bg-medical-600 text-white rounded-lg hover:bg-medical-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {searching ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Searching Pharmacies...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Find Pharmacies for This Prescription
                  </>
                )}
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700">{success}</span>
              </div>
            )}

            {/* Results */}
            {pharmacies.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Map View */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Map View</h3>
                  </div>
                  <div className="h-[400px]">
                    <MapContainer 
                      center={mapCenter} 
                      zoom={13} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      
                      <RecenterMap position={mapCenter} />
                      
                      {/* User location marker */}
                      {userLocation && (
                        <Marker 
                          position={userLocation} 
                          icon={new Icon({
                            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                            shadowSize: [41, 41]
                          })}
                        >
                          <Popup>
                            <div className="text-center">
                              <strong>Your Location</strong>
                            </div>
                          </Popup>
                        </Marker>
                      )}
                      
                      {/* Pharmacy markers */}
                      {sortedPharmacies.map((pharmacy) => (
                        <Marker 
                          key={pharmacy.id} 
                          position={[pharmacy.coordinates?.lat || 0, pharmacy.coordinates?.lng || 0]} 
                          icon={customIcon}
                        >
                          <Popup>
                            <div className="text-center">
                              <strong>{pharmacy.name}</strong><br />
                              {pharmacy.address}<br />
                              <span className="text-sm">{pharmacy.distance.toFixed(1)} km away</span>
                              <div className="mt-2">
                                <button 
                                  onClick={() => setSelectedPharmacy(pharmacy)}
                                  className="px-2 py-1 bg-medical-600 text-white rounded text-xs hover:bg-medical-700"
                                >
                                  Send Prescription
                                </button>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>

                {/* Pharmacies List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Available Pharmacies</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                    >
                      <option value="distance">Sort by Distance</option>
                      <option value="name">Sort by Name</option>
                    </select>
                  </div>

                  {sortedPharmacies.map((pharmacy) => (
                    <div
                      key={pharmacy.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{pharmacy.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <Navigation className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{pharmacy.distance.toFixed(1)} km</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-600">{pharmacy.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <button
                          onClick={() => setSelectedPharmacy(pharmacy)}
                          className="inline-flex items-center text-medical-600 hover:text-medical-700 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                        <button
                          onClick={() => sendPrescriptionToPharmacy(pharmacy)}
                          disabled={sending}
                          className="inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        >
                          {sending ? (
                            <>
                              <LoadingSpinner size="sm" color="white" />
                              <span className="ml-2">Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-1" />
                              Send Prescription
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pharmacies.length === 0 && !searching && userLocation && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pharmacies found</h3>
                <p className="text-gray-500">No pharmacies in your area can fulfill this prescription.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && pharmacyToSend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-medical-100 mb-4">
                <Send className="h-6 w-6 text-medical-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Order</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to send your prescription to <strong>{pharmacyToSend.name}</strong>?
                <br />
                <span className="text-xs text-gray-500 mt-2 block">
                  This will create an order with {prescription.medicines.length} medicine(s).
                </span>
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSendOrder}
                  disabled={sending}
                  className="flex-1 px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SharePrescriptionModal; 