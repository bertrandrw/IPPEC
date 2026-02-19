import { FC, useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import api from '../../utils/api';
import { 
  Building2, 
  Eye,
  MapPin,
  Phone,
  Mail,
  Plus,
  Trash2,
  Check,
  Search,
  AlertCircle
} from 'lucide-react';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  licenseNumber: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  companyCode: string;
  managingDirector: string;
  licenseExpiryDate: string;
  contactPhone: string;
  contactEmail: string;
  authorizedPharmacistId: string | null;
}

const PharmacyManagement: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [allPharmacies, setAllPharmacies] = useState<Pharmacy[]>([]);
  const [networkPharmacies, setNetworkPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addingPharmacy, setAddingPharmacy] = useState<string | null>(null);
  const [removingPharmacy, setRemovingPharmacy] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'network'>('available');

  // Fetch all available pharmacies
  const fetchAvailablePharmacies = async () => {
    try {
      // Check if we have an auth token
      const token = localStorage.getItem('mediflow_token');
      console.log('Auth token exists:', !!token);
      setLoading(true);
      setError(null);
      console.log('Fetching pharmacies from:', `/pharmacies?page=${page}&limit=10`);
      const response = await api.get(`/pharmacies?page=${page}&limit=10`);
      if (response.data.success && response.data.data) {
        setAllPharmacies(response.data.data.data);
        setTotalPages(response.data.data.meta.totalPages);
      }
    } catch (error: any) {
      console.error('Error fetching available pharmacies:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch available pharmacies.';
      setError(`Error: ${errorMessage}`);
      console.log('Full error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch pharmacies in our network
  const fetchNetworkPharmacies = async () => {
    try {
      const response = await api.get(`/portal/insurer/pharmacies?page=1&limit=100`);
      if (response.data.success && response.data.data) {
        setNetworkPharmacies(response.data.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching network pharmacies:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchAvailablePharmacies(),
          fetchNetworkPharmacies()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [page]);

  const addToNetwork = async (pharmacyId: string) => {
    try {
      setAddingPharmacy(pharmacyId);
      await api.post(`/portal/insurer/pharmacies`, { pharmacyId });
      await fetchNetworkPharmacies();
      setError(null);
    } catch (error: any) {
      console.error('Error adding pharmacy:', error);
      setError('Failed to add pharmacy to network.');
    } finally {
      setAddingPharmacy(null);
    }
  };

  const removeFromNetwork = async (pharmacyId: string) => {
    try {
      setRemovingPharmacy(pharmacyId);
      await api.delete(`/portal/insurer/pharmacies/${pharmacyId}`);
      await fetchNetworkPharmacies();
      setError(null);
    } catch (error: any) {
      console.error('Error removing pharmacy:', error);
      setError('Failed to remove pharmacy from network.');
    } finally {
      setRemovingPharmacy(null);
    }
  };

  const isInNetwork = (pharmacyId: string): boolean => {
    return networkPharmacies.some(p => p.id === pharmacyId);
  };

  const currentPharmacies = activeTab === 'available' ? allPharmacies : networkPharmacies;
  const filteredPharmacies = currentPharmacies.filter(pharmacy => {
    const searchString = searchTerm.toLowerCase();
    return (
      pharmacy.name.toLowerCase().includes(searchString) ||
      pharmacy.address.toLowerCase().includes(searchString) ||
      pharmacy.licenseNumber.toLowerCase().includes(searchString)
    );
  });

  if (selectedPharmacy) {
    return (
      <Layout title="Pharmacy Details">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedPharmacy(null)}
            className="mb-6 inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            ← Back to Pharmacies
          </button>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{selectedPharmacy.name}</h1>
                <p className="text-gray-600">License: {selectedPharmacy.licenseNumber}</p>
              </div>
              {isInNetwork(selectedPharmacy.id) ? (
                <button
                  onClick={() => {
                    removeFromNetwork(selectedPharmacy.id);
                    setSelectedPharmacy(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove from Network
                </button>
              ) : (
                <button
                  onClick={() => {
                    addToNetwork(selectedPharmacy.id);
                    setSelectedPharmacy(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Network
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {selectedPharmacy.contactPhone}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {selectedPharmacy.contactEmail}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedPharmacy.address}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">Company Code: {selectedPharmacy.companyCode}</p>
                  <p className="text-gray-600">Director: {selectedPharmacy.managingDirector}</p>
                  <p className="text-gray-600">
                    License Expires: {new Date(selectedPharmacy.licenseExpiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Pharmacy Network">
      <div className="space-y-6">
        {/* Header and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50/50">
            <div className="px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Building2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeTab === 'available' ? 'Available Pharmacies' : 'Network Pharmacies'}
                  </h2>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search pharmacies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 py-3 flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2.5 relative ${
                activeTab === 'available'
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Available Pharmacies
              {activeTab === 'available' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`px-4 py-2.5 relative ${
                activeTab === 'network'
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Network
              {activeTab === 'network' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
              {networkPharmacies.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
                  {networkPharmacies.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pharmacies...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary-50 group-hover:bg-primary-100 transition-colors">
                          <Building2 className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{pharmacy.name}</h3>
                          <p className="text-sm text-gray-500">License: {pharmacy.licenseNumber}</p>
                        </div>
                      </div>
                      {isInNetwork(pharmacy.id) && (
                        <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <Check className="w-3 h-3 mr-1" />
                          Partner
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{pharmacy.address}</span>
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{pharmacy.contactPhone}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{pharmacy.contactEmail}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedPharmacy(pharmacy)}
                      className="inline-flex items-center text-gray-600 hover:text-primary-600 text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      Details
                    </button>
                    {isInNetwork(pharmacy.id) ? (
                      <button
                        onClick={() => removeFromNetwork(pharmacy.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                        disabled={removingPharmacy === pharmacy.id}
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        {removingPharmacy === pharmacy.id ? 'Removing...' : 'Remove'}
                      </button>
                    ) : (
                      <button
                        onClick={() => addToNetwork(pharmacy.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                        disabled={addingPharmacy === pharmacy.id}
                      >
                        <Plus className="w-4 h-4 mr-1.5" />
                        {addingPharmacy === pharmacy.id ? 'Adding...' : 'Add to Network'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPharmacies.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pharmacies found</h3>
                <p className="text-gray-500">
                  {activeTab === 'network'
                    ? "You haven't added any pharmacies to your network yet"
                    : 'No available pharmacies match your search'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {activeTab === 'available' && (
              <div className="flex justify-center mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border rounded-l bg-white disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 border-t border-b bg-white">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border rounded-r bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default PharmacyManagement;
