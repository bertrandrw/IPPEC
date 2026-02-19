import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Calendar,
  Shield,
  Edit3,
  Save,
  X,
  Camera,
  FileText,
  Clock,
  CheckCircle,
  Activity,
  Eye,
  EyeOff,
  Heart,
  CreditCard,
  ShoppingCart
} from 'lucide-react';

interface EditableField {
  field: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'password' | 'date';
  value: string;
  required?: boolean;
  readonly?: boolean;
}

const PatientProfile: React.FC = () => {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'medical' | 'security' | 'activity'>('profile');

  // Mock additional profile data that would come from database
  const profileData = {
    ...user,
    fullName: user?.name || 'Patient',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    nationalId: 'NID123456789012345',
    address: 'KG 456 St, Kicukiro, Kigali',
    emergencyContact: '+250 788 123 456',
    emergencyContactName: 'Uwimana Marie',
    bloodType: 'O+',
    allergies: 'Penicillin, Latex',
    chronicConditions: 'Hypertension, Diabetes Type 2',
    insurance: {
      provider: 'RSSB - Community Based Health Insurance',
      policyNumber: 'CBHI-2024-001234',
      validUntil: '2024-12-31',
      coverageLevel: 'Premium'
    },
    medicalHistory: [
      { condition: 'Hypertension', diagnosedDate: '2020-03-15', status: 'Ongoing' },
      { condition: 'Diabetes Type 2', diagnosedDate: '2019-08-22', status: 'Managed' },
      { condition: 'Migraine', diagnosedDate: '2018-11-10', status: 'Occasional' }
    ],
    stats: {
      totalPrescriptions: 156,
      activeOrders: 3,
      privateOrders: 12,
      totalVisits: 89,
      lastVisit: '2024-09-28',
      memberSince: '2020-01-15',
      healthScore: 85
    }
  };

  const editableFields: EditableField[] = [
    { field: 'fullName', label: 'Full Name', type: 'text', value: profileData.fullName, required: true },
    { field: 'email', label: 'Email Address', type: 'email', value: profileData.email || '', required: true },
    { field: 'phone', label: 'Phone Number', type: 'tel', value: profileData.phone || '', required: true },
    { field: 'dateOfBirth', label: 'Date of Birth', type: 'date', value: profileData.dateOfBirth, required: true },
    { field: 'address', label: 'Address', type: 'textarea', value: profileData.address, required: true },
    { field: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text', value: profileData.emergencyContactName, required: true },
    { field: 'emergencyContact', label: 'Emergency Contact Phone', type: 'tel', value: profileData.emergencyContact, required: true },
    { field: 'nationalId', label: 'National ID', type: 'text', value: profileData.nationalId, readonly: true },
  ];

  const medicalFields: EditableField[] = [
    { field: 'bloodType', label: 'Blood Type', type: 'text', value: profileData.bloodType, required: false },
    { field: 'allergies', label: 'Known Allergies', type: 'textarea', value: profileData.allergies, required: false },
    { field: 'chronicConditions', label: 'Chronic Conditions', type: 'textarea', value: profileData.chronicConditions, required: false },
  ];

  const handleEdit = (field: string) => {
    setIsEditing(field);
    setEditedData({ ...editedData, [field]: profileData[field as keyof typeof profileData] });
  };

  const handleSave = async (field: string) => {
    try {
      // Here you would make an API call to update the user profile
      console.log('Saving field:', field, 'with value:', editedData[field]);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state (in real app, this would come from API response)
      setIsEditing(null);
      setEditedData({});
      
      // Show success message (you could use toast here)
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditedData({});
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-RW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <Layout title="My Profile">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#397dc0]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Profile">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#397dc0] to-blue-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#397dc0] hover:bg-gray-100 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{profileData.fullName}</h1>
                <p className="text-blue-100 text-lg mb-2">
                  Age: {calculateAge(profileData.dateOfBirth)} • {profileData.gender}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">{profileData.insurance.provider}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Member since {new Date(profileData.stats.memberSince).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-xl font-bold">{profileData.stats.healthScore}/100</span>
              </div>
              <p className="text-blue-100 text-sm">Health Score</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'profile', label: 'Personal Information', icon: User },
                { key: 'medical', label: 'Medical Information', icon: Heart },
                { key: 'security', label: 'Security Settings', icon: Shield },
                { key: 'activity', label: 'Recent Activity', icon: Activity }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-[#397dc0] text-[#397dc0]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {editableFields.map((field) => (
                      <div key={field.field} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                          {field.readonly && <span className="text-gray-400 ml-2 text-xs">(Read-only)</span>}
                        </label>
                        
                        {isEditing === field.field ? (
                          <div className="space-y-2">
                            {field.type === 'textarea' ? (
                              <textarea
                                value={editedData[field.field] || ''}
                                onChange={(e) => setEditedData({ ...editedData, [field.field]: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-transparent"
                                rows={3}
                                placeholder={field.label}
                              />
                            ) : (
                              <input
                                type={field.type}
                                value={editedData[field.field] || ''}
                                onChange={(e) => setEditedData({ ...editedData, [field.field]: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-transparent"
                                placeholder={field.label}
                              />
                            )}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleSave(field.field)}
                                className="flex items-center space-x-1 px-3 py-1 bg-[#397dc0] text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                              >
                                <Save className="w-3 h-3" />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={handleCancel}
                                className="flex items-center space-x-1 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-900">
                              {field.type === 'date' ? formatDate(field.value) : field.value}
                            </span>
                            {!field.readonly && (
                              <button
                                onClick={() => handleEdit(field.field)}
                                className="text-[#397dc0] hover:text-blue-700 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insurance Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Insurance Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-gray-900">Insurance Details</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Provider: {profileData.insurance.provider}</p>
                      <p className="text-sm text-gray-600 mb-2">Policy: {profileData.insurance.policyNumber}</p>
                      <p className="text-sm text-gray-600">Coverage: <span className="text-green-600 font-medium">{profileData.insurance.coverageLevel}</span></p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Calendar className="w-5 h-5 text-[#397dc0]" />
                        <h4 className="font-medium text-gray-900">Membership</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Valid Until: {formatDate(profileData.insurance.validUntil)}</p>
                      <p className="text-sm text-gray-600">Member Since: {formatDate(profileData.stats.memberSince)}</p>
                    </div>
                  </div>
                </div>

                {/* Healthcare Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Healthcare Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-[#397dc0] mb-1">{profileData.stats.totalPrescriptions}</div>
                      <div className="text-sm text-gray-600">Total Prescriptions</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">{profileData.stats.activeOrders}</div>
                      <div className="text-sm text-gray-600">Active Orders</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{profileData.stats.privateOrders}</div>
                      <div className="text-sm text-gray-600">Private Orders</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{profileData.stats.totalVisits}</div>
                      <div className="text-sm text-gray-600">Healthcare Visits</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical Information Tab */}
            {activeTab === 'medical' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Medical Information</h3>
                  
                  {/* Editable Medical Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {medicalFields.map((field) => (
                      <div key={field.field} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                        
                        {isEditing === field.field ? (
                          <div className="space-y-2">
                            {field.type === 'textarea' ? (
                              <textarea
                                value={editedData[field.field] || ''}
                                onChange={(e) => setEditedData({ ...editedData, [field.field]: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-transparent"
                                rows={3}
                                placeholder={field.label}
                              />
                            ) : (
                              <input
                                type={field.type}
                                value={editedData[field.field] || ''}
                                onChange={(e) => setEditedData({ ...editedData, [field.field]: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-transparent"
                                placeholder={field.label}
                              />
                            )}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleSave(field.field)}
                                className="flex items-center space-x-1 px-3 py-1 bg-[#397dc0] text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                              >
                                <Save className="w-3 h-3" />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={handleCancel}
                                className="flex items-center space-x-1 px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-900">{field.value || 'Not specified'}</span>
                            <button
                              onClick={() => handleEdit(field.field)}
                              className="text-[#397dc0] hover:text-blue-700 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Medical History */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h4>
                    <div className="space-y-4">
                      {profileData.medicalHistory.map((condition, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">{condition.condition}</h5>
                              <p className="text-sm text-gray-600">Diagnosed: {formatDate(condition.diagnosedDate)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              condition.status === 'Ongoing' ? 'bg-red-100 text-red-800' :
                              condition.status === 'Managed' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {condition.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                  
                  {/* Change Password */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Current Password</label>
                        <div className="relative mt-1">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-transparent pr-10"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <input
                          type="password"
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-transparent"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                          type="password"
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button className="px-4 py-2 bg-[#397dc0] text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Account Verification */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Account Verification</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-gray-900">Email Verified</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Verified</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-gray-900">Phone Verified</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Verified</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-gray-900">National ID Verified</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'Placed private order for discrete medication', time: '1 hour ago', type: 'private', icon: Shield },
                    { action: 'Received prescription from Dr. Mukamana', time: '3 hours ago', type: 'prescription', icon: FileText },
                    { action: 'Updated emergency contact information', time: '5 hours ago', type: 'profile', icon: User },
                    { action: 'Ordered medicine from Kigali Central Pharmacy', time: '1 day ago', type: 'order', icon: ShoppingCart },
                    { action: 'Read health article about Diabetes Management', time: '2 days ago', type: 'health', icon: Heart },
                    { action: 'Insurance claim processed successfully', time: '3 days ago', type: 'insurance', icon: CreditCard },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'prescription' ? 'bg-blue-100' :
                        activity.type === 'private' ? 'bg-purple-100' :
                        activity.type === 'order' ? 'bg-orange-100' :
                        activity.type === 'health' ? 'bg-red-100' :
                        activity.type === 'insurance' ? 'bg-green-100' :
                        'bg-gray-100'
                      }`}>
                        <activity.icon className={`w-5 h-5 ${
                          activity.type === 'prescription' ? 'text-blue-600' :
                          activity.type === 'private' ? 'text-purple-600' :
                          activity.type === 'order' ? 'text-orange-600' :
                          activity.type === 'health' ? 'text-red-600' :
                          activity.type === 'insurance' ? 'text-green-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientProfile;