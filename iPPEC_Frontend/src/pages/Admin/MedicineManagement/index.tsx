import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import MedicineList from './MedicineList';
import MedicineForm from './MedicineForm';
import { Pill, Search, Filter, AlertCircle, TrendingDown, Package, DollarSign, Upload, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { BASE_URL } from '../../../utils/api';
import { useToast } from '../../../components/common/ToastContainer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

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

// Add PaginationMeta type
interface PaginationMeta {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

const MedicineManagement: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const { showToast } = useToast();

  // Mock categories for filtering
  const categories = [
    'Analgesic', 'Antibiotic', 'Antidiabetic', 'Antihypertensive',
    'Antihistamine', 'Antidepressant', 'Vitamin', 'Supplement'
  ];

  useEffect(() => {
    fetchMedicines(currentPage, searchTerm, categoryFilter);
    // eslint-disable-next-line
  }, [currentPage, searchTerm, categoryFilter]);

  const fetchMedicines = async (page = 1, search = '', category = 'all') => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      let url = `${BASE_URL}/medicines?page=${page}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (category && category !== 'all') url += `&category=${encodeURIComponent(category)}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const result = await response.json();
      if (result.statusCode === 200) {
        // Updated to match new API response format
        const medicinesArray = result.data?.data || [];
        const transformedData = medicinesArray.map((medicine: any) => ({
          id: medicine.id,
          brandName: medicine.brandName,
          genericName: medicine.genericName,
          manufacturer: medicine.manufacturer,
          price: parseFloat(medicine.price),
          createdAt: medicine.createdAt,
          updatedAt: medicine.updatedAt,
          category: getRandomCategory(),
          dosageForm: getRandomDosageForm(),
          strength: getRandomStrength(),
          currentStock: Math.floor(Math.random() * 200),
          minStock: 20,
          expiryDate: getRandomFutureDate(),
          requiresPrescription: Math.random() > 0.5
        }));
        setMedicines(transformedData);
        if (result.data?.meta) {
          setPaginationMeta({
            totalRecords: result.data.meta.totalRecords || 0,
            currentPage: result.data.meta.currentPage || 1,
            totalPages: result.data.meta.totalPages || 1,
            limit: result.data.meta.limit || 10,
          });
        }
      } else {
        throw new Error(result.message || 'Failed to fetch medicines');
      }
    } catch (err: any) {
      console.error('Error fetching medicines:', err);
      setError(err.message || 'An error occurred while fetching medicines');
      setMedicines([]);
      setPaginationMeta(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for mock data
  const getRandomCategory = () => {
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const getRandomDosageForm = () => {
    const forms = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops'];
    return forms[Math.floor(Math.random() * forms.length)];
  };

  const getRandomStrength = () => {
    const strengths = ['250mg', '500mg', '10mg', '20mg', '40mg', '100mg', '5%', '10%'];
    return strengths[Math.floor(Math.random() * strengths.length)];
  };

  const getRandomFutureDate = () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + Math.floor(Math.random() * 24)); // Random date up to 24 months in future
    return futureDate.toISOString().split('T')[0];
  };

  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setShowForm(true);
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setShowForm(true);
  };

  const handleSaveMedicine = async (medicineData: Partial<Medicine>) => {
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      
      const method = editingMedicine ? 'PATCH' : 'POST';
      const url = editingMedicine 
        ? `${BASE_URL}/medicines/${editingMedicine.id}` 
        : `${BASE_URL}/medicines`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(medicineData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('success', editingMedicine 
          ? 'Medicine updated successfully' 
          : 'Medicine added successfully');
        
        setShowForm(false);
        fetchMedicines();
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (err: any) {
      console.error('Error saving medicine:', err);
      showToast('error', err.message || 'Failed to save medicine');
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      
      const response = await fetch(`${BASE_URL}/medicines/${id}`, {
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
        showToast('success', 'Medicine deleted successfully');
        fetchMedicines();
      } else {
        throw new Error(result.message || 'Failed to delete medicine');
      }
    } catch (err: any) {
      console.error('Error deleting medicine:', err);
      showToast('error', err.message || 'Failed to delete medicine');
    }
  };

  const handleBulkImport = async () => {
    if (!importFile) {
      showToast('error', 'Please select a file to import');
      return;
    }
    
    setIsImporting(true);
    
    try {
      const token = localStorage.getItem('mediflow_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      
      const formData = new FormData();
      formData.append('file', importFile);
      
      const response = await fetch(`${BASE_URL}/medicines/bulk-import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('success', `Successfully imported ${result.data?.imported || 'multiple'} medicines`);
        setShowBulkImport(false);
        setImportFile(null);
        fetchMedicines();
      } else {
        throw new Error(result.message || 'Import failed');
      }
    } catch (err: any) {
      console.error('Error importing medicines:', err);
      showToast('error', err.message || 'Failed to import medicines');
    } finally {
      setIsImporting(false);
    }
  };

  const medicineStats = {
    total: medicines.length,
    lowStock: medicines.filter(m => (m.currentStock || 0) < (m.minStock || 20)).length,
    requiresPrescription: medicines.filter(m => m.requiresPrescription).length,
    totalValue: medicines.reduce((total, med) => total + (med.price * (med.currentStock || 0)), 0)
  };

  if (showForm) {
    return (
      <AdminLayout title={editingMedicine ? "Edit Medicine" : "Add New Medicine"}>
        <MedicineForm 
          medicine={editingMedicine}
          onSave={handleSaveMedicine}
          onCancel={() => setShowForm(false)}
        />
      </AdminLayout>
    );
  }

  if (showBulkImport) {
    return (
      <AdminLayout title="Bulk Import Medicines">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Upload a CSV or Excel file with the following columns: brandName, genericName, manufacturer, price.
                    The first row should be the header row with these exact column names.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-medical-600 hover:text-medical-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-medical-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImportFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  CSV or Excel up to 10MB
                </p>
                {importFile && (
                  <p className="text-sm text-medical-600">
                    Selected file: {importFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkImport(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                disabled={!importFile || isImporting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-medical-600 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                    Importing...
                  </>
                ) : (
                  'Import Medicines'
                )}
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Medicine Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Medicine Management</h2>
            <p className="text-gray-600 mt-1">Manage the master list of medicines in the system</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowBulkImport(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import
            </button>
            <button
              onClick={() => {
                // In a real app, this would generate and download a CSV template
                showToast('info', 'CSV template download started');
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
            <button
              onClick={handleAddMedicine}
              className="inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700"
            >
              <Pill className="w-4 h-4 mr-2" />
              Add Medicine
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                <p className="text-2xl font-bold text-gray-900">{medicineStats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{medicineStats.lowStock}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prescription Only</p>
                <p className="text-2xl font-bold text-gray-900">{medicineStats.requiresPrescription}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">${medicineStats.totalValue.toFixed(0)}</p>
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
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on new search
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none w-full sm:w-64"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Medicine List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" color="primary" />
            <span className="ml-3 text-gray-600">Loading medicines...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading medicines</h3>
            <p className="text-gray-500">{error}</p>
            <button 
              onClick={() => fetchMedicines(currentPage, searchTerm, categoryFilter)}
              className="mt-4 px-4 py-2 bg-medical-600 text-white rounded-lg text-sm font-medium hover:bg-medical-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <MedicineList 
              medicines={medicines} 
              onEdit={handleEditMedicine} 
              onDelete={handleDeleteMedicine}
            />
            
            {/* Pagination */}
            {paginationMeta && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm border border-gray-200 mt-8">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationMeta.totalPages))}
                    disabled={currentPage === paginationMeta.totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === paginationMeta.totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * paginationMeta.limit + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * paginationMeta.limit, paginationMeta.totalRecords)}</span>{' '}
                      of <span className="font-medium">{paginationMeta.totalRecords}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      {/* Page numbers - show max 5 */}
                      {(() => {
                        const total = paginationMeta.totalPages;
                        const maxPages = 5;
                        let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
                        let end = start + maxPages - 1;
                        if (end > total) {
                          end = total;
                          start = Math.max(1, end - maxPages + 1);
                        }
                        return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                              page === currentPage
                                ? 'bg-medical-50 text-medical-600 hover:bg-medical-100'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ));
                      })()}
                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationMeta.totalPages))}
                        disabled={currentPage === paginationMeta.totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === paginationMeta.totalPages 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default MedicineManagement;
