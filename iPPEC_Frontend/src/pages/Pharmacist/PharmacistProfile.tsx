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
  Award,
  Building2,
  FileText,
  Clock,
  CheckCircle,
  Star,
  Activity,
  Eye,
  EyeOff
} from 'lucide-react';

interface EditableField {
  field: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'password';
  value: string;
  required?: boolean;
  readonly?: boolean;
}

const PharmacistProfile: React.FC = () => {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'activity'>('profile');

  // Mock additional profile data that would come from database
  const profileData = {
    ...user,
    fullName: user?.name || 'Pharmacist',
    licenseNumber: user?.licenseNumber || 'PHARM-RW-2024-001',
    pharmacyName: 'Kigali Central Pharmacy',
    specialization: 'Clinical Pharmacy',
    experience: '8 years',
    dateJoined: '2020-03-15',
    lastLogin: '2024-10-02 09:30 AM',
    address: 'KG 123 St, Gasabo, Kigali',
    bio: 'Experienced clinical pharmacist dedicated to providing excellent patient care and medication management services.',
    certifications: [
      'Rwanda Pharmacy Board License',
      'Clinical Pharmacy Certification',
      'Medication Therapy Management',
      'Pharmaceutical Care Specialist'
    ],
    stats: {
      prescriptionsProcessed: 2845,
      patientsServed: 1267,
      insuranceClaimsProcessed: 892,
      customerRating: 4.8,
      yearsOfService: 8
    }
  };

  const editableFields: EditableField[] = [
    { field: 'fullName', label: 'Full Name', type: 'text', value: profileData.fullName, required: true },
    { field: 'email', label: 'Email Address', type: 'email', value: profileData.email || '', required: true },
    { field: 'phone', label: 'Phone Number', type: 'tel', value: profileData.phone || '', required: true },
    { field: 'address', label: 'Address', type: 'textarea', value: profileData.address, required: true },
    { field: 'bio', label: 'Professional Bio', type: 'textarea', value: profileData.bio, required: false },
    { field: 'specialization', label: 'Specialization', type: 'text', value: profileData.specialization, required: false },
    { field: 'licenseNumber', label: 'License Number', type: 'text', value: profileData.licenseNumber, readonly: true },
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

  if (loading) {
    return (
      <Layout title="Profile">
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
                <p className="text-blue-100 text-lg mb-2">{profileData.specialization}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{profileData.pharmacyName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">{profileData.experience} experience</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-xl font-bold">{profileData.stats.customerRating}/5.0</span>
              </div>
              <p className="text-blue-100 text-sm">Customer Rating</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'profile', label: 'Profile Information', icon: User },
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
            {/* Profile Information Tab */}
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
                            <span className="text-gray-900">{field.value}</span>
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

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="w-5 h-5 text-[#397dc0]" />
                        <h4 className="font-medium text-gray-900">License Information</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">License Number: {profileData.licenseNumber}</p>
                      <p className="text-sm text-gray-600">Status: <span className="text-green-600 font-medium">Active</span></p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Calendar className="w-5 h-5 text-[#397dc0]" />
                        <h4 className="font-medium text-gray-900">Employment</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Joined: {formatDate(profileData.dateJoined)}</p>
                      <p className="text-sm text-gray-600">Experience: {profileData.experience}</p>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-[#397dc0] mb-1">{profileData.stats.prescriptionsProcessed.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Prescriptions Processed</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{profileData.stats.patientsServed.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Patients Served</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">{profileData.stats.insuranceClaimsProcessed.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Insurance Claims</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{profileData.stats.yearsOfService}</div>
                      <div className="text-sm text-gray-600">Years of Service</div>
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

                  {/* Login History */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Recent Login Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-900">Current Session</span>
                        </div>
                        <span className="text-sm text-gray-500">{profileData.lastLogin}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span className="text-sm text-gray-900">Previous Session</span>
                        </div>
                        <span className="text-sm text-gray-500">Yesterday, 5:45 PM</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span className="text-sm text-gray-900">Previous Session</span>
                        </div>
                        <span className="text-sm text-gray-500">Oct 1, 2024, 8:20 AM</span>
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
                    { action: 'Processed prescription for patient ID #P2024-1001', time: '2 hours ago', type: 'prescription' },
                    { action: 'Updated inventory for Amoxicillin 500mg', time: '4 hours ago', type: 'inventory' },
                    { action: 'Processed insurance claim #INS-2024-0892', time: '6 hours ago', type: 'insurance' },
                    { action: 'Handled private order for discrete medication', time: '1 day ago', type: 'private' },
                    { action: 'Updated profile information', time: '2 days ago', type: 'profile' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        activity.type === 'prescription' ? 'bg-blue-500' :
                        activity.type === 'inventory' ? 'bg-green-500' :
                        activity.type === 'insurance' ? 'bg-orange-500' :
                        activity.type === 'private' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
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

export default PharmacistProfile;