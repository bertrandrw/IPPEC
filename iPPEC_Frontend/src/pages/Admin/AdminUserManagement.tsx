import React, { useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { 
  Users, 
  Search, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Shield,
  Stethoscope,
  Pill,
  User,
  Building2,
  Download,
  Upload,
  MoreVertical,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sliders
} from 'lucide-react';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'pharmacist' | 'admin' | 'insurer';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  registrationDate: string;
  lastLogin?: string;
  avatar?: string;
  address?: string;
  licenseNumber?: string;
  specialization?: string;
  pharmacyName?: string;
  companyName?: string;
}

const AdminUserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showUserDetails, setShowUserDetails] = useState<string | null>(null);

  const users: SystemUser[] = [
    {
      id: 'U001',
      name: 'Dr. Sarah Johnson',
      email: 'dr.sarah@mediflow.com',
      phone: '+1 (555) 123-4567',
      role: 'doctor',
      status: 'active',
      verificationStatus: 'verified',
      registrationDate: '2024-01-15',
      lastLogin: '2024-01-26T09:30:00Z',
      address: '123 Medical Plaza, Health District',
      licenseNumber: 'MD123456',
      specialization: 'Internal Medicine'
    },
    {
      id: 'U002',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 987-6543',
      role: 'patient',
      status: 'active',
      verificationStatus: 'verified',
      registrationDate: '2024-01-20',
      lastLogin: '2024-01-25T14:20:00Z',
      address: '456 Oak Street, City Center'
    },
    {
      id: 'U003',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@pharmacy.com',
      phone: '+1 (555) 456-7890',
      role: 'pharmacist',
      status: 'active',
      verificationStatus: 'verified',
      registrationDate: '2024-01-10',
      lastLogin: '2024-01-26T11:45:00Z',
      address: '789 Pharmacy Lane, Medicine District',
      licenseNumber: 'PH789012',
      pharmacyName: 'HealthFirst Pharmacy'
    },
    {
      id: 'U004',
      name: 'HealthCare Insurance Co.',
      email: 'contact@healthcare-ins.com',
      phone: '+1 (555) 321-0987',
      role: 'insurer',
      status: 'active',
      verificationStatus: 'verified',
      registrationDate: '2024-01-05',
      lastLogin: '2024-01-26T08:15:00Z',
      companyName: 'HealthCare Insurance Co.',
      address: '321 Insurance Blvd, Financial District'
    },
    {
      id: 'U005',
      name: 'Dr. Michael Chen',
      email: 'dr.chen@mediflow.com',
      phone: '+1 (555) 654-3210',
      role: 'doctor',
      status: 'pending',
      verificationStatus: 'pending',
      registrationDate: '2024-01-25',
      address: '321 Medical Center, Health Plaza',
      licenseNumber: 'MD789456',
      specialization: 'Cardiology'
    }
  ];

  const getRoleIcon = (role: SystemUser['role']) => {
    switch (role) {
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

  const getRoleColor = (role: SystemUser['role']) => {
    switch (role) {
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

  const getStatusIcon = (status: SystemUser['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: SystemUser['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sortUsers = (a: SystemUser, b: SystemUser) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'role':
        comparison = a.role.localeCompare(b.role);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'registration':
        comparison = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
        break;
      case 'lastLogin':
        if (!a.lastLogin) return 1;
        if (!b.lastLogin) return -1;
        comparison = new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime();
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  }).sort(sortUsers);

  const userStats = {
    total: users.length,
    doctors: users.filter(u => u.role === 'doctor').length,
    pharmacists: users.filter(u => u.role === 'pharmacist').length,
    patients: users.filter(u => u.role === 'patient').length,
    insurers: users.filter(u => u.role === 'insurer').length,
    pending: users.filter(u => u.status === 'pending').length,
    verified: users.filter(u => u.verificationStatus === 'verified').length
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 text-medical-600" /> : <ArrowDown className="w-4 h-4 text-medical-600" />;
  };

  const toggleUserDetails = (userId: string) => {
    setShowUserDetails(prev => prev === userId ? null : userId);
  };

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        {/* Header with Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600 mt-1">Manage all system users and their permissions</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg text-sm font-medium hover:bg-medical-700">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{userStats.total}</p>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">{userStats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-xl font-bold text-gray-900">{userStats.verified}</p>
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
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              {selectedUsers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedUsers.length} selected</span>
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
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
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>User</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Role</span>
                      {getSortIcon('role')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('registration')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Registration</span>
                      {getSortIcon('registration')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastLogin')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Last Login</span>
                      {getSortIcon('lastLogin')}
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
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
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
                        {user.specialization && (
                          <div className="text-xs text-gray-500 mt-1">{user.specialization}</div>
                        )}
                        {user.pharmacyName && (
                          <div className="text-xs text-gray-500 mt-1">{user.pharmacyName}</div>
                        )}
                        {user.companyName && (
                          <div className="text-xs text-gray-500 mt-1">{user.companyName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(user.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Verification: {user.verificationStatus}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
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
                          <button className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {showUserDetails === user.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
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
                                {user.address && (
                                  <div className="flex items-start text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                    <span>{user.address}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Professional Details</h4>
                              <div className="space-y-2 text-sm">
                                {user.licenseNumber && (
                                  <div>
                                    <span className="text-gray-500">License:</span>
                                    <span className="ml-2">{user.licenseNumber}</span>
                                  </div>
                                )}
                                {user.specialization && (
                                  <div>
                                    <span className="text-gray-500">Specialization:</span>
                                    <span className="ml-2">{user.specialization}</span>
                                  </div>
                                )}
                                {user.pharmacyName && (
                                  <div>
                                    <span className="text-gray-500">Pharmacy:</span>
                                    <span className="ml-2">{user.pharmacyName}</span>
                                  </div>
                                )}
                                {user.companyName && (
                                  <div>
                                    <span className="text-gray-500">Company:</span>
                                    <span className="ml-2">{user.companyName}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
                              <div className="flex flex-wrap gap-2">
                                {user.status === 'pending' && (
                                  <>
                                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                      Approve
                                    </button>
                                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                                      Reject
                                    </button>
                                  </>
                                )}
                                {user.status === 'active' && (
                                  <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
                                    Suspend
                                  </button>
                                )}
                                {user.status === 'suspended' && (
                                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                    Reactivate
                                  </button>
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or add new users.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-medical-50 text-sm font-medium text-medical-600 hover:bg-medical-100">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserManagement;