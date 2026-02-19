import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { apiClient } from '../../utils/api';
import { 
  Search, 
  RefreshCw,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Settings,
  Pill,
  AlertCircle
} from 'lucide-react';

interface InventoryItem {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  price: string;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
}

interface InventoryResponse {
  data: InventoryItem[];
  meta: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

interface UpdateStockRequest {
  items: {
    medicineId: string;
    stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  }[];
}

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(20);
  const [sortBy, setSortBy] = useState('brandName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkUpdateLoading, setBulkUpdateLoading] = useState(false);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState<'IN_STOCK' | 'OUT_OF_STOCK'>('IN_STOCK');

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sortBy: `${sortBy}_${sortOrder}`,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await apiClient.get<InventoryResponse>(`/pharmacies/me/inventory?${params}`);
      
      if (response.success) {
        setInventory(response.data.data);
        setTotalPages(response.data.meta.totalPages);
        setTotalRecords(response.data.meta.totalRecords);
      } else {
        setError('Failed to fetch inventory data');
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  // Update stock status
  const updateStockStatus = async (items: UpdateStockRequest['items']) => {
    try {
      setBulkUpdateLoading(true);
      const response = await apiClient.put<{ message: string }>('/pharmacies/me/inventory', { items });
      
      if (response.success) {
        // Refresh the inventory data
        await fetchInventory();
        setSelectedItems([]);
        setShowBulkUpdateModal(false);
        return true;
      } else {
        setError('Failed to update stock status');
        return false;
      }
    } catch (err) {
      console.error('Error updating stock status:', err);
      setError('Failed to update stock status');
      return false;
    } finally {
      setBulkUpdateLoading(false);
    }
  };

  // Handle bulk update
  const handleBulkUpdate = async () => {
    if (selectedItems.length === 0) return;
    
    const items = selectedItems.map(id => ({
      medicineId: id,
      stockStatus: bulkUpdateStatus
    }));

    await updateStockStatus(items);
  };

  // Handle individual item update
  const handleItemUpdate = async (itemId: string, newStatus: 'IN_STOCK' | 'OUT_OF_STOCK') => {
    await updateStockStatus([{
      medicineId: itemId,
      stockStatus: newStatus
    }]);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchInventory();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data when page, sort, or limit changes
  useEffect(() => {
    fetchInventory();
  }, [currentPage, sortBy, sortOrder]);

  const getStatusIcon = (status: 'IN_STOCK' | 'OUT_OF_STOCK') => {
    return status === 'IN_STOCK' 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status: 'IN_STOCK' | 'OUT_OF_STOCK') => {
    return status === 'IN_STOCK'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const handleSelectAll = () => {
    if (selectedItems.length === inventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inventory.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <Layout title="Inventory Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
            <p className="text-gray-600 mt-1">Manage your pharmacy's medicine inventory</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={fetchInventory}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search medicines by name, generic name, or manufacturer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none w-full sm:w-80"
                />
              </div>
              <select
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('_');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
              >
                <option value="brandName_asc">Brand Name (A-Z)</option>
                <option value="brandName_desc">Brand Name (Z-A)</option>
                <option value="stockStatus_asc">Stock Status (In Stock First)</option>
                <option value="stockStatus_desc">Stock Status (Out of Stock First)</option>
              </select>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} item(s) selected
                </span>
                <button
                  onClick={() => setShowBulkUpdateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg text-sm font-medium hover:bg-medical-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Bulk Update
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-medical-600 animate-spin mr-3" />
              <span className="text-gray-600">Loading inventory...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading inventory</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={fetchInventory}
                className="inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg text-sm font-medium hover:bg-medical-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === inventory.length && inventory.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-medical-600 focus:ring-medical-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manufacturer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="rounded border-gray-300 text-medical-600 focus:ring-medical-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-medical-100 rounded-lg flex items-center justify-center mr-3">
                              <Pill className="w-5 h-5 text-medical-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.brandName}</div>
                              <div className="text-sm text-gray-500">{item.genericName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.manufacturer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${parseFloat(item.price).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.stockStatus)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.stockStatus)}`}>
                              {item.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleItemUpdate(item.id, item.stockStatus === 'IN_STOCK' ? 'OUT_OF_STOCK' : 'IN_STOCK')}
                              className={`px-3 py-1 rounded text-xs font-medium ${
                                item.stockStatus === 'IN_STOCK'
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {item.stockStatus === 'IN_STOCK' ? 'Mark Out of Stock' : 'Mark In Stock'}
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {inventory.length === 0 && (
                <div className="text-center py-12">
                  <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or add new medicines.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-700">
                    <span>
                      Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords} results
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'border-medical-500 text-medical-600 bg-medical-50'
                              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk Update Modal */}
      {showBulkUpdateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Update Stock Status</h3>
              <p className="text-sm text-gray-600 mb-4">
                Update stock status for {selectedItems.length} selected item(s)
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Stock Status
                </label>
                <select
                  value={bulkUpdateStatus}
                  onChange={(e) => setBulkUpdateStatus(e.target.value as 'IN_STOCK' | 'OUT_OF_STOCK')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBulkUpdateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkUpdate}
                  disabled={bulkUpdateLoading}
                  className="px-4 py-2 bg-medical-600 text-white rounded-lg text-sm font-medium hover:bg-medical-700 disabled:opacity-50"
                >
                  {bulkUpdateLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InventoryManagement;