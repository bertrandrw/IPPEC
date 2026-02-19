import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import { 
  Users, 
  Search, 
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Shield,
  Stethoscope,
  Pill,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sliders
} from 'lucide-react';
import { useToast } from '../../../components/common/ToastContainer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { BASE_URL } from '../../../utils/api';

interface SystemUser {
  id: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  name?: string;
}

interface PaginationMeta {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

const UserList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserDetails, setShowUserDetails] = useState<string | null>(null);
  const { showToast } = useToast();

  // API data state
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('mediflow_token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        
        const response = await fetch(
          `${BASE_URL}/users?page=${currentPage}&limit=5`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setUsers(result.data.data.map((user: any) => ({
            ...user,
            name: user.email.split('@')[0], // Use email as name if not provided
            role: user.role.toLowerCase()
          })));
          setPaginationMeta(result.data.meta);
        } else {
          throw new Error(result.message || 'Failed to fetch users');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching users');
        showToast('error', err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [currentPage, showToast]);

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'pharmacist':
        return <Pill className="w-4 h-4 text-green-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'patient':
        return <User className="w-4 h-4 text-orange-600" />;
      case 'insurer':
        return <Building2 className="w-4 h-4 text-indigo-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'pharmacist':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'patient':
        return 'bg-orange-100 text-orange-800';
      case 'insurer':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (isVerified: boolean) => {
    return isVerified 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'verified' && user.isVerified) ||
                         (statusFilter === 'pending' && !user.isVerified);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    doctors: users.filter(u => u.role.toLowerCase() === 'doctor').length,
    pharmacists: users.filter(u => u.role.toLowerCase() === 'pharmacist').length,
    patients: users.filter(u => u.role.toLowerCase() === 'patient').length,
    insurers: users.filter(u => u.role.toLowerCase() === 'insurer').length,
    pending: users.filter(u => !u.isVerified).length,
    verified: users.filter(u => u.isVerified).length
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const toggleUserDetails = (userId: string) => {
    setShowUserDetails(prev => prev === userId ? null : userId);
  };

  const handleApproveUser = (userId: string) => {
    console.log('Approving user:', userId);
    showToast('success', 'User approved successfully');
  };

  const handleRejectUser = (userId: string) => {
    console.log('Rejecting user:', userId);
    showToast('success', 'User rejected successfully');
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Deleting user:', userId);
    showToast('success', 'User deleted successfully');
  };

  const handleNextPage = () => {
    if (paginationMeta && currentPage < paginationMeta.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        {/* Header with Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{paginationMeta?.totalRecords || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Stethoscope className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Doctors</p>
                <p className="text-xl font-bold text-gray-900">{userStats.doctors}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Patients</p>
                <p className="text-xl font-bold text-gray-900">{userStats.patients}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Pill className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pharmacists</p>
                <p className="text-xl font-bold text-gray-900">{userStats.pharmacists}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Insurers</p>
                <p className="text-xl font-bold text-gray-900">{userStats.insurers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none w-full sm:w-64"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
              >
                <option value="all">All Roles</option>
                <option value="doctor">Doctors</option>
                <option value="patient">Patients</option>
                <option value="pharmacist">Pharmacists</option>
                <option value="insurer">Insurers</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              {selectedUsers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedUsers.length} selected</span>
                  <button 
                    onClick={() => {
                      showToast('success', `${selectedUsers.length} users approved successfully`);
                      setSelectedUsers([]);
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => {
                      showToast('success', `${selectedUsers.length} users suspended successfully`);
                      setSelectedUsers([]);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Suspend
                  </button>
                </div>
              )}
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Sliders className="w-4 h-4 mr-2" />
                Advanced Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" color="primary" />
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading users</h3>
              <p className="text-gray-500">{error}</p>
              <button 
                onClick={() => setCurrentPage(1)}
                className="mt-4 px-4 py-2 bg-medical-600 text-white rounded-lg text-sm font-medium hover:bg-medical-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-medical-600 focus:ring-medical-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>User</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Role</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Registration</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <React.Fragment key={user.id}>
                      <tr className={`hover:bg-gray-50 ${showUserDetails === user.id ? 'bg-gray-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="rounded border-gray-300 text-medical-600 focus:ring-medical-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {getRoleIcon(user.role)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name || user.email.split('@')[0]}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.phone && (
                                <div className="text-xs text-gray-400">{user.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1 capitalize">{user.role}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(user.isVerified)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.isVerified)}`}>
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => toggleUserDetails(user.id)}
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {showUserDetails === user.id && (
                        <tr className="bg-gray-50">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm">
                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                    <span>{user.email}</span>
                                  </div>
                                  {user.phone && (
                                    <div className="flex items-center text-sm">
                                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                      <span>{user.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Account Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">User ID:</span>
                                    <span className="ml-2">{user.id}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Role:</span>
                                    <span className="ml-2 capitalize">{user.role}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Verification:</span>
                                    <span className="ml-2">{user.isVerified ? 'Verified' : 'Pending'}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
                                <div className="flex flex-wrap gap-2">
                                  {!user.isVerified && (
                                    <>
                                      <button 
                                        onClick={() => handleApproveUser(user.id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                      >
                                        Approve
                                      </button>
                                      <button 
                                        onClick={() => handleRejectUser(user.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                                    Edit Details
                                  </button>
                                  <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                                    Reset Password
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or add new users.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {paginationMeta && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button 
                onClick={handlePrevPage}
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
                onClick={handleNextPage}
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
                  <span className="font-medium">
                    {Math.min(currentPage * paginationMeta.limit, paginationMeta.totalRecords)}
                  </span>{' '}
                  of <span className="font-medium">{paginationMeta.totalRecords}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: paginationMeta.totalPages }, (_, i) => i + 1).map(page => (
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
                  ))}
                  
                  <button 
                    onClick={handleNextPage}
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
      </div>
    </AdminLayout>
  );
};

export default UserList;
