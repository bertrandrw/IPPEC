import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import HospitalList from './HospitalList';
import HospitalForm from './HospitalForm';
import { Building2, Search, Filter, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { BASE_URL } from '../../../utils/api';
import { useToast } from '../../../components/common/ToastContainer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

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

const HospitalManagement: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();

  useEffect(() => {
    fetchHospitals();
  }, [currentPage]);

  const fetchHospitals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      
      const response = await fetch(`${BASE_URL}/hospitals?page=${currentPage}&limit=10`, {
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
        const transformedData = (result.data.data || []).map((hospital: any) => ({
          id: hospital.id,
          name: hospital.name,
          address: hospital.address || 'No address provided',
          type: hospital.type || 'HOSPITAL',
          ownership: hospital.ownership || 'PRIVATE',
          email: hospital.email || '',
          phone: hospital.phone || '',
          emergencyPhone: hospital.emergencyPhone || '',
          website: hospital.website || '',
          facilityHeadName: hospital.facilityHeadName || '',
          facilityHeadDesignation: hospital.facilityHeadDesignation || '',
          status: hospital.status || 'active',
          createdAt: hospital.createdAt || new Date().toISOString()
        }));
        
        setHospitals(transformedData);
        
        // Set pagination data
        if (result.data.meta) {
          setTotalPages(result.data.meta.totalPages || 1);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch hospitals');
      }
    } catch (err: any) {
      console.error('Error fetching hospitals:', err);
      setError(err.message || 'An error occurred while fetching hospitals');
      
      // Use mock data for development
      setHospitals([
        {
          id: 'h1',
          name: 'King Faisal Hospital, Kigali',
          address: 'KG 544 St, Gasabo, Kigali',
          type: 'HOSPITAL',
          ownership: 'GOVERNMENT',
          email: 'info@kfhk.rw',
          phone: '+250788123456',
          emergencyPhone: '+250252588888',
          website: 'https://kfh.rw',
          facilityHeadName: 'Dr. Zereihun Abebe',
          facilityHeadDesignation: 'Chief Executive Officer',
          status: 'active',
          createdAt: '2023-01-15T00:00:00Z'
        },
        {
          id: 'h2',
          name: 'Rwanda Military Hospital',
          address: 'KK 15 Ave, Kigali',
          type: 'HOSPITAL',
          ownership: 'GOVERNMENT',
          email: 'info@rmh.rw',
          phone: '+250788987654',
          status: 'active',
          createdAt: '2023-03-20T00:00:00Z'
        },
        {
          id: 'h3',
          name: 'Kigali Medical Center',
          address: 'KN 50 St, Kigali',
          type: 'CLINIC',
          ownership: 'PRIVATE',
          status: 'pending',
          createdAt: '2023-09-05T00:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHospital = () => {
    setEditingHospital(null);
    setShowForm(true);
  };

  const handleEditHospital = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setShowForm(true);
  };

  const handleSaveHospital = async (hospitalData: Partial<Hospital>) => {
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      
      const method = editingHospital ? 'PATCH' : 'POST';
      const url = editingHospital 
        ? `${BASE_URL}/hospitals/${editingHospital.id}` 
        : `${BASE_URL}/admin/hospitals`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(hospitalData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('success', editingHospital 
          ? 'Hospital updated successfully' 
          : 'Hospital added successfully');
        
        setShowForm(false);
        fetchHospitals();
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (err: any) {
      console.error('Error saving hospital:', err);
      showToast('error', err.message || 'Failed to save hospital');
    }
  };

  const handleDeleteHospital = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      
      const response = await fetch(`${BASE_URL}/hospitals/${id}`, {
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
        showToast('success', 'Hospital deleted successfully');
        fetchHospitals();
      } else {
        throw new Error(result.message || 'Failed to delete hospital');
      }
    } catch (err: any) {
      console.error('Error deleting hospital:', err);
      showToast('error', err.message || 'Failed to delete hospital');
    }
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hospital.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hospitalStats = {
    total: hospitals.length,
    active: hospitals.filter(h => h.status === 'active').length,
    pending: hospitals.filter(h => h.status === 'pending').length,
    inactive: hospitals.filter(h => h.status === 'inactive').length
  };

  if (showForm) {
    return (
      <AdminLayout title={editingHospital ? "Edit Hospital" : "Register New Hospital"}>
        <HospitalForm 
          hospital={editingHospital}
          onSave={handleSaveHospital}
          onCancel={() => setShowForm(false)}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Hospital Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hospital Management</h2>
            <p className="text-gray-600 mt-1">Register and manage hospitals in the system</p>
          </div>
          <button
            onClick={handleAddHospital}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Add Hospital
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
                <p className="text-sm font-medium text-gray-600">Total Hospitals</p>
                <p className="text-2xl font-bold text-gray-900">{hospitalStats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{hospitalStats.active}</p>
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
                <p className="text-2xl font-bold text-gray-900">{hospitalStats.pending}</p>
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
                <p className="text-2xl font-bold text-gray-900">{hospitalStats.inactive}</p>
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
                  placeholder="Search hospitals..."
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

        {/* Hospital List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" color="primary" />
            <span className="ml-3 text-gray-600">Loading hospitals...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading hospitals</h3>
            <p className="text-gray-500">{error}</p>
            <button 
              onClick={fetchHospitals}
              className="mt-4 px-4 py-2 bg-medical-600 text-white rounded-lg text-sm font-medium hover:bg-medical-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <HospitalList 
              hospitals={filteredHospitals} 
              onEdit={handleEditHospital} 
              onDelete={handleDeleteHospital}
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

export default HospitalManagement;
