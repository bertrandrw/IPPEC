import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  Heart,
  AlertCircle,
  User,
  Edit
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  lastVisit: string;
  nextAppointment?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insuranceInfo: {
    provider: string;
    policyNumber: string;
  };
  avatar?: string;
  status: 'active' | 'inactive';
}

const MyPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const patients: Patient[] = [
    {
      id: 'P001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1985-03-15',
      address: '123 Main St, City, State 12345',
      bloodType: 'A+',
      allergies: ['Penicillin', 'Shellfish'],
      chronicConditions: ['Hypertension'],
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-15',
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1 (555) 987-6543',
        relationship: 'Spouse'
      },
      insuranceInfo: {
        provider: 'BlueCross BlueShield',
        policyNumber: 'BC123456789'
      },
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'active'
    },
    {
      id: 'P002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 234-5678',
      dateOfBirth: '1992-07-22',
      address: '456 Oak Ave, City, State 12346',
      bloodType: 'O-',
      allergies: ['Latex'],
      chronicConditions: [],
      lastVisit: '2024-01-18',
      emergencyContact: {
        name: 'Michael Johnson',
        phone: '+1 (555) 876-5432',
        relationship: 'Father'
      },
      insuranceInfo: {
        provider: 'Aetna',
        policyNumber: 'AET987654321'
      },
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'active'
    },
    {
      id: 'P003',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 345-6789',
      dateOfBirth: '1978-11-08',
      address: '789 Pine St, City, State 12347',
      bloodType: 'B+',
      allergies: ['Aspirin', 'Nuts'],
      chronicConditions: ['Diabetes Type 2', 'High Cholesterol'],
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-10',
      emergencyContact: {
        name: 'Lisa Brown',
        phone: '+1 (555) 765-4321',
        relationship: 'Wife'
      },
      insuranceInfo: {
        provider: 'Cigna',
        policyNumber: 'CIG456789123'
      },
      status: 'active'
    },
    {
      id: 'P004',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      dateOfBirth: '1995-05-12',
      address: '321 Elm Dr, City, State 12348',
      bloodType: 'AB+',
      allergies: [],
      chronicConditions: [],
      lastVisit: '2024-01-10',
      emergencyContact: {
        name: 'Robert Davis',
        phone: '+1 (555) 654-3210',
        relationship: 'Brother'
      },
      insuranceInfo: {
        provider: 'UnitedHealth',
        policyNumber: 'UH789123456'
      },
      status: 'inactive'
    }
  ];

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (selectedPatient) {
    return (
      <Layout title="Patient Details">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedPatient(null)}
            className="mb-6 inline-flex items-center text-medical-600 hover:text-medical-700"
          >
            ← Back to Patients
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
                    {selectedPatient.avatar ? (
                      <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-gray-600">Patient ID: {selectedPatient.id}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    selectedPatient.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Age:</span>
                        <span className="text-gray-900">{calculateAge(selectedPatient.dateOfBirth)} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Blood Type:</span>
                        <span className="text-gray-900">{selectedPatient.bloodType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Visit:</span>
                        <span className="text-gray-900">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedPatient.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedPatient.phone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600">{selectedPatient.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Patient Info
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Medical Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Allergies</h4>
                    {selectedPatient.allergies.length > 0 ? (
                      <div className="space-y-2">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-700 bg-red-50 px-2 py-1 rounded">{allergy}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No known allergies</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Chronic Conditions</h4>
                    {selectedPatient.chronicConditions.length > 0 ? (
                      <div className="space-y-2">
                        {selectedPatient.chronicConditions.map((condition, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-orange-700 bg-orange-50 px-2 py-1 rounded">{condition}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No chronic conditions</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{selectedPatient.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedPatient.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="font-medium text-gray-900">{selectedPatient.emergencyContact.relationship}</p>
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Provider</p>
                    <p className="font-medium text-gray-900">{selectedPatient.insuranceInfo.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Policy Number</p>
                    <p className="font-medium text-gray-900">{selectedPatient.insuranceInfo.policyNumber}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="inline-flex items-center justify-center px-4 py-3 bg-medical-600 text-white rounded-lg hover:bg-medical-700">
                    <FileText className="w-5 h-5 mr-2" />
                    New Prescription
                  </button>
                  <button className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Appointment
                  </button>
                  <button className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Activity className="w-5 h-5 mr-2" />
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Patients">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Patients</h2>
          <p className="text-gray-600 mt-1">Manage your patient records and information</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-medical-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.nextAppointment).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none w-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
              >
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {patient.avatar ? (
                      <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-500">ID: {patient.id}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  patient.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {patient.status}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Age:</span>
                  <span className="text-gray-900">{calculateAge(patient.dateOfBirth)} years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Blood Type:</span>
                  <span className="text-gray-900">{patient.bloodType}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Visit:</span>
                  <span className="text-gray-900">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                </div>
              </div>

              {patient.allergies.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Allergies:</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.slice(0, 2).map((allergy, index) => (
                      <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {allergy}
                      </span>
                    ))}
                    {patient.allergies.length > 2 && (
                      <span className="text-xs text-gray-500">+{patient.allergies.length - 2} more</span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPatient(patient);
                  }}
                  className="inline-flex items-center text-medical-600 hover:text-medical-700 text-sm font-medium"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-gray-400 hover:text-medical-600 hover:bg-medical-50 rounded"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyPatients;