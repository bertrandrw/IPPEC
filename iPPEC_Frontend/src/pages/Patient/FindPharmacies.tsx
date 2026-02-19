import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  MapPin, 
  Search, 
  Filter,
  Phone,
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
  X,
  AlertCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { medicineAPI, pharmacyAPI } from '../../utils/api';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  dosageForm: string;
  strength: string;
  price: number;
  stock: number;
  expiryDate: string;
  requiresPrescription: boolean;
  description: string;
  sideEffects: string[];
  contraindications: string[];
  brandName: string; // Added for dropdown
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  distance: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
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

const FindPharmacies: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchMedicine, setSearchMedicine] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('distance');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1.9441, 30.0619]); // Default to Kigali

  const services = [
    { id: 'delivery', name: 'Home Delivery', icon: Truck },
    { id: 'insurance', name: 'Insurance Accepted', icon: Shield },
    { id: 'consultation', name: 'Pharmacist Consultation', icon: Heart },
    { id: 'prescription', name: 'Prescription Refills', icon: CheckCircle },
    { id: 'payment', name: 'Card Payment', icon: CreditCard }
  ];

  useEffect(() => {
    getUserLocation();
  }, []);

  // Medicine search effect
  useEffect(() => {
    const searchMedicines = async () => {
      if (searchMedicine.trim().length < 2) {
        setMedicines([]);
        setShowMedicineDropdown(false);
        return;
      }

      try {
        setLoading(true);
        const response = await medicineAPI.search(searchMedicine);
        if (response.success) {
          setMedicines(response.data);
          setShowMedicineDropdown(true);
        }
      } catch (err: any) {
        console.error('Error searching medicines:', err);
        setError('Failed to search medicines');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchMedicines, 500);
    return () => clearTimeout(timeoutId);
  }, [searchMedicine]);

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
          
          // Update search location with coordinates for display
          setSearchLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('Location access denied. Please allow location access or enter your location manually.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location information unavailable. Please enter your location manually.');
              break;
            case error.TIMEOUT:
              setError('Location request timed out. Please try again or enter your location manually.');
              break;
            default:
              setError('Unable to get your location. Please enter your location manually.');
          }
        },
        options
      );
    } else {
      setError('Geolocation is not supported by this browser. Please enter your location manually.');
    }
  };

  const searchPharmacies = async () => {
    if (!selectedMedicine) {
      setError('Please select a medicine to search for.');
      return;
    }

    if (!userLocation && !searchLocation.trim()) {
      setError('Please provide your location or use the location button to get your current position.');
      return;
    }

    setSearching(true);
    setError(null);

    try {
      let latitude: number, longitude: number;

      if (userLocation) {
        // Use GPS coordinates
        latitude = userLocation[0];
        longitude = userLocation[1];
      } else {
        // For manual location entry, we would need a geocoding service
        // For now, we'll use a default location (Kigali) as fallback
        setError('Please use the location button to get your exact coordinates for better results.');
        latitude = -1.9441;
        longitude = 30.0619;
      }

      const response = await pharmacyAPI.search({
        medicineId: selectedMedicine.id,
        latitude: latitude,
        longitude: longitude,
        limit: 10
      });

      if (response.success) {
        // Use the real coordinates from the API response
        const pharmaciesWithCoordinates = response.data.map((pharmacy) => ({
          ...pharmacy,
          coordinates: {
            lat: pharmacy.latitude,
            lng: pharmacy.longitude
          }
        }));
        
        setPharmacies(pharmaciesWithCoordinates);
      } else {
        setError(response.message || 'Failed to search pharmacies');
      }
    } catch (err: any) {
      console.error('Error searching pharmacies:', err);
      setError('Failed to search pharmacies. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleMedicineSelect = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    // Show full medicine information including brand name, generic name and manufacturer
    setSearchMedicine(`${medicine.brandName} (${medicine.genericName}) - ${medicine.manufacturer}`);
    setShowMedicineDropdown(false);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const filteredPharmacies = pharmacies.filter(_ => {
    // For demo purposes, we'll assume all pharmacies have all services
    return selectedServices.length === 0 || true;
  });

  const sortedPharmacies = [...filteredPharmacies].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distance - b.distance;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'stock':
        const stockOrder = { 'IN_STOCK': 3, 'LOW_STOCK': 2, 'OUT_OF_STOCK': 1 };
        return stockOrder[b.stockStatus] - stockOrder[a.stockStatus];
      default:
        return 0;
    }
  });

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusText = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'In Stock';
      case 'LOW_STOCK':
        return 'Low Stock';
      case 'OUT_OF_STOCK':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  if (selectedPharmacy) {
    return (
      <Layout title="Pharmacy Details">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedPharmacy(null)}
            className="mb-6 inline-flex items-center text-medical-600 hover:text-medical-700"
          >
            ← Back to Search Results
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-medical-600 to-primary-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold">{selectedPharmacy.name}</h1>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(selectedPharmacy.stockStatus)}`}>
                      {getStockStatusText(selectedPharmacy.stockStatus)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Navigation className="w-4 h-4" />
                      <span>{selectedPharmacy.distance.toFixed(1)} km away</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-700">{selectedPharmacy.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medicine Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Pill className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedMedicine?.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedMedicine?.genericName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              {selectedPharmacy.coordinates && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                  <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300">
                    <MapContainer 
                      center={[selectedPharmacy.coordinates.lat, selectedPharmacy.coordinates.lng]} 
                      zoom={15} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker 
                        position={[selectedPharmacy.coordinates.lat, selectedPharmacy.coordinates.lng]} 
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
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <button className="inline-flex items-center px-6 py-3 bg-medical-600 text-white rounded-lg hover:bg-medical-700">
                  <Navigation className="w-5 h-5 mr-2" />
                  Get Directions
                </button>
                <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Pharmacy
                </button>
                <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Heart className="w-5 h-5 mr-2" />
                  Save as Favorite
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Find Pharmacies">
      <div className="space-y-6">
        {/* Header */}
        <div className="relative text-center bg-gradient-to-br from-[#E1F5FE] via-white to-[#E1F5FE]/20 py-12 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <h2 className="text-4xl font-bold text-[#01579B] mb-4 drop-shadow-sm">Find Nearby Pharmacies</h2>
          <p className="text-[#0288D1] max-w-2xl mx-auto text-lg">
            Locate verified pharmacies in your area, check their services, and find the best option for your prescription needs.
          </p>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#E1F5FE] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob" />
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#0288D1] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <div className="space-y-4">
            {/* Location & Medicine Search */}
            <form onSubmit={(e) => { e.preventDefault(); searchPharmacies(); }} className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your location (address, city, or ZIP code)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0288D1] focus:border-[#0288D1] outline-none w-full transition-colors duration-200"
                />
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by medicine name (e.g. Paracetamol)"
                  value={searchMedicine}
                  onChange={(e) => {
                    setSearchMedicine(e.target.value);
                    setSelectedMedicine(null);
                  }}
                  className={`pl-10 ${selectedMedicine ? 'pr-10' : 'pr-4'} py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0288D1] focus:border-[#0288D1] outline-none w-full ${
                    selectedMedicine ? 'bg-[#E1F5FE] border-[#0288D1]' : ''
                  } transition-colors duration-200`}
                />
                {selectedMedicine && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMedicine(null);
                      setSearchMedicine('');
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {loading && !selectedMedicine && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="sm" color="primary" />
                  </div>
                )}
                {/* Medicine Dropdown */}
                {showMedicineDropdown && medicines.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {medicines.map((medicine) => (
                      <button
                        key={medicine.id}
                        type="button"
                        onClick={() => handleMedicineSelect(medicine)}
                        className="w-full px-4 py-3 text-left hover:bg-[#E1F5FE] border-b border-slate-200 last:border-b-0 transition-colors duration-200"
                      >
                        <div className="font-medium text-[#01579B]">{medicine.brandName}</div>
                        <div className="text-sm text-[#0288D1]">{medicine.genericName}</div>
                        <div className="text-xs text-slate-500">{medicine.manufacturer}</div>
                        <div className="text-xs text-[#0288D1] font-semibold">Price: {medicine.price}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                type="submit"
                disabled={!selectedMedicine || !userLocation || searching}
                className="px-4 py-3 bg-[#0288D1] text-white rounded-lg hover:bg-[#01579B] disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
              >
                {searching ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={getUserLocation}
                className="px-4 py-3 border border-slate-200 text-[#0288D1] rounded-lg hover:bg-[#E1F5FE] hover:border-[#0288D1] transition-colors duration-200"
                title="Use current location"
              >
                <Crosshair className="w-5 h-5" />
              </button>
            </form>

            {/* Location Status */}
            {userLocation && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700">
                  Location detected: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Services Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter by services:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedServices.includes(service.id)
                        ? 'bg-[#E1F5FE] text-[#0288D1] shadow-sm ring-2 ring-[#0288D1] ring-opacity-50'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-[#E1F5FE]/50 hover:text-[#0288D1] hover:border-[#0288D1]/30'
                    }`}
                  >
                    <service.icon className="w-4 h-4 mr-2" />
                    {service.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center justify-between bg-slate-50/50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#0288D1]/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#0288D1]" />
                </div>
                <span className="text-sm font-medium text-slate-600">
                  Found <span className="text-[#0288D1] font-semibold">{sortedPharmacies.length}</span> pharmacies
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:ring-2 focus:ring-[#0288D1] focus:border-[#0288D1] outline-none cursor-pointer hover:border-[#0288D1]/30 transition-colors"
                >
                  <option value="distance">Distance</option>
                  <option value="stock">Stock Status</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {searching ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" color="primary" />
            <span className="ml-3 text-gray-600">Searching for pharmacies...</span>
          </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
              <div className="lg:col-span-3">
                {/* Map View */}
              <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-lg border border-slate-200 overflow-hidden group">
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0288D1]/10 flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors duration-200">
                        <MapPin className="w-4 h-4 text-[#0288D1]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Interactive Map</h3>
                        <p className="text-xs text-slate-500">View pharmacies near you</p>
                      </div>
                    </div>
                    {userLocation && (
                      <div className="flex items-center space-x-2 px-2 py-1 bg-[#E1F5FE] text-[#0288D1] rounded-lg text-xs">
                        <Crosshair className="w-3.5 h-3.5" />
                        <span className="font-medium">Location Active</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-[400px] border-4 border-white">
                  <MapContainer 
                    center={mapCenter} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Recenter map when center changes */}
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
                            <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${getStockStatusColor(pharmacy.stockStatus)}`}>
                              {getStockStatusText(pharmacy.stockStatus)}
                            </span><br />
                            <span className="text-sm">{pharmacy.distance.toFixed(1)} km away</span>
                            <div className="mt-2">
                              <button 
                                onClick={() => setSelectedPharmacy(pharmacy)}
                                className="px-2 py-1 bg-medical-600 text-white rounded text-xs hover:bg-medical-700"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {/* Pharmacies List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {sortedPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="group bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-md border border-slate-200 hover:shadow-xl hover:border-[#0288D1]/30 transition-all duration-200 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedPharmacy(pharmacy)}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0288D1]/10 flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors">
                        <Building2 className="w-5 h-5 text-[#0288D1]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#0288D1] transition-colors">
                              {pharmacy.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center text-slate-600">
                                <Navigation className="w-4 h-4 mr-1.5 text-[#0288D1]" />
                                <span className="text-sm">{pharmacy.distance.toFixed(1)} km away</span>
                              </div>
                              <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStockStatusColor(pharmacy.stockStatus)}`}>
                                {getStockStatusText(pharmacy.stockStatus)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 group-hover:bg-[#E1F5FE]/50 transition-colors">
                            <MapPin className="w-5 h-5 text-[#0288D1] mt-0.5" />
                            <span className="text-sm text-slate-600">{pharmacy.address}</span>
                          </div>
                          {selectedMedicine && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 group-hover:bg-[#E1F5FE]/50 transition-colors">
                              <Pill className="w-5 h-5 text-[#0288D1]" />
                              <span className="text-sm text-slate-600">{selectedMedicine.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                      <button className="inline-flex items-center px-4 py-2 text-[#0288D1] font-medium text-sm hover:bg-[#E1F5FE] rounded-lg transition-colors">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center px-3 py-2 text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-lg transition-colors"
                        >
                          <Navigation className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center px-3 py-2 text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-lg transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {sortedPharmacies.length === 0 && !searching && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pharmacies found</h3>
                  <p className="text-gray-500">
                    {selectedMedicine 
                      ? `No pharmacies found with ${selectedMedicine.name} in your area.`
                      : 'Search for a medicine to find nearby pharmacies.'
                    }
                  </p>
                </div>
              )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FindPharmacies;