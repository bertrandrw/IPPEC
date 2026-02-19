import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import PharmacyList from './PharmacyList';
import PharmacyForm from './PharmacyForm';
import { Building2, Search, Filter, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { BASE_URL } from '../../../utils/api';
import { useToast } from '../../../components/common/ToastContainer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

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

const PharmacyManagement: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();

  useEffect(() => {
    fetchPharmacies();
  }, [currentPage]);

  const fetchPharmacies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      
      const response = await fetch(`${BASE_URL}/pharmacies?page=${currentPage}&limit=10`, {
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
        // Transform the data to match our interface
        const transformedData = (result.data.data || []).map((pharmacy: any) => ({
          id: pharmacy.id,
          name: pharmacy.name,
          address: pharmacy.address || 'No address provided',
          licenseNumber: pharmacy.licenseNumber || 'Not provided',
          latitude: pharmacy.latitude || 0,
          longitude: pharmacy.longitude || 0,
          companyCode: pharmacy.companyCode || '',
          managingDirector: pharmacy.managingDirector || '',
          contactPhone: pharmacy.contactPhone || '',
          contactEmail: pharmacy.contactEmail || '',
          licenseExpiryDate: pharmacy.licenseExpiryDate || '',
          authorizedPharmacistId: pharmacy.authorizedPharmacistId || '',
          status: pharmacy.status || 'active',
          createdAt: pharmacy.createdAt || new Date().toISOString()
        }));
        
        setPharmacies(transformedData);
        
        // Set pagination data
        if (result.data.meta) {
          setTotalPages(result.data.meta.totalPages || 1);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch pharmacies');
      }
    } catch (err: any) {
      console.error('Error fetching pharmacies:', err);
      setError(err.message || 'An error occurred while fetching pharmacies');
      
      // Use mock data for development
      setPharmacies([
        {
          id: 'ph1',
          name: 'Kigali Central Pharmacy',
          address: 'KN 4 Ave, Kigali, Rwanda',
          licenseNumber: 'RWA-FDA-12345',
          latitude: -1.9441,
          longitude: 30.0619,
          companyCode: '102345678',
          managingDirector: 'Mr. John Bosco',
          contactPhone: '0788123456',
          contactEmail: 'contact@kigalipharm.rw',
          licenseExpiryDate: '2025-12-31T00:00:00.000Z',
          status: 'active',
          createdAt: '2023-01-15T00:00:00Z'
        },
        {
          id: 'ph2',
          name: 'MediCare Plus',
          address: '456 Oak Avenue, Midtown, City 12346',
          licenseNumber: 'RWA-FDA-67890',
          latitude: -1.9541,
          longitude: 30.0719,
          status: 'active',
          createdAt: '2023-03-20T00:00:00Z'
        },
        {
          id: 'ph3',
          name: 'Community Health Pharmacy',
          address: 'KG 123 St, Kigali, Rwanda',
          licenseNumber: 'RWA-FDA-54321',
          latitude: -1.9341,
          longitude: 30.0519,
          status: 'pending',
          createdAt: '2023-09-05T00:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPharmacy = () => {
    setEditingPharmacy(null);
    setShowForm(true);
  };

  const handleEditPharmacy = (pharmacy: Pharmacy) => {
    setEditingPharmacy(pharmacy);
    setShowForm(true);
  };

  const handleSavePharmacy = async (pharmacyData: Partial<Pharmacy>) => {
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      
      const method = editingPharmacy ? 'PUT' : 'POST';
      const url = editingPharmacy 
        ? `${BASE_URL}/admin/pharmacies/${editingPharmacy.id}` 
        : `${BASE_URL}/admin/pharmacies`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pharmacyData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('success', editingPharmacy 
          ? 'Pharmacy updated successfully' 
          : 'Pharmacy added successfully');
        
        setShowForm(false);
        fetchPharmacies();
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (err: any) {
      console.error('Error saving pharmacy:', err);
      showToast('error', err.message || 'Failed to save pharmacy');
    }
  };

  const handleDeletePharmacy = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this pharmacy?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      
      const response = await fetch(`${BASE_URL}/admin/pharmacies/${id}`, {
        method: 'DELETE',
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
        showToast('success', 'Pharmacy deleted successfully');
        fetchPharmacies();
      } else {
        throw new Error(result.message || 'Failed to delete pharmacy');
      }
    } catch (err: any) {
      console.error('Error deleting pharmacy:', err);
      showToast('error', err.message || 'Failed to delete pharmacy');
    }
  };

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharmacy.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pharmacy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pharmacyStats = {
    total: pharmacies.length,
    active: pharmacies.filter(p => p.status === 'active').length,
    pending: pharmacies.filter(p => p.status === 'pending').length,
    inactive: pharmacies.filter(p => p.status === 'inactive').length
  };

  if (showForm) {
    return (
      <AdminLayout title={editingPharmacy ? "Edit Pharmacy" : "Register New Pharmacy"}>
        <PharmacyForm 
          pharmacy={editingPharmacy}
          onSave={handleSavePharmacy}
          onCancel={() => setShowForm(false)}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pharmacy Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pharmacy Management</h2>
            <p className="text-gray-600 mt-1">Register and manage pharmacies in the system</p>
          </div>
          <button
            onClick={handleAddPharmacy}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Add Pharmacy
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pharmacies</p>
                <p className="text-2xl font-bold text-gray-900">{pharmacyStats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{pharmacyStats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pharmacyStats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{pharmacyStats.inactive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search pharmacies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none w-full sm:w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Pharmacy List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" color="primary" />
            <span className="ml-3 text-gray-600">Loading pharmacies...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading pharmacies</h3>
            <p className="text-gray-500">{error}</p>
            <button 
              onClick={fetchPharmacies}
              className="mt-4 px-4 py-2 bg-medical-600 text-white rounded-lg text-sm font-medium hover:bg-medical-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <PharmacyList 
              pharmacies={filteredPharmacies} 
              onEdit={handleEditPharmacy} 
              onDelete={handleDeletePharmacy}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-medical-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default PharmacyManagement;
