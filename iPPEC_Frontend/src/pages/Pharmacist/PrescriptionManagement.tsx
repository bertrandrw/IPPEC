import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  FileText, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Pill,
  Calendar,
  Phone,
  Download,
  QrCode,
  Shield
} from 'lucide-react';

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorSpecialty: string;
  medications: Medication[];
  diagnosis: string;
  issuedDate: string;
  validUntil: string;
  status: 'pending' | 'verified' | 'dispensed' | 'expired';
  urgent: boolean;
  notes?: string;
  qrCode: string;
}

interface Medication {
  name: string;
  dosage: string;
  quantity: number;
  instructions: string;
  available: boolean;
  price: number;
}

const PrescriptionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const prescriptions: Prescription[] = [
    {
      id: 'RX001',
      patientName: 'John Smith',
      patientId: 'P001',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialty: 'Internal Medicine',
      diagnosis: 'Hypertension',
      issuedDate: '2024-01-25',
      validUntil: '2024-02-25',
      status: 'pending',
      urgent: false,
      notes: 'Patient has mild allergies to penicillin',
      qrCode: 'QR_CODE_DATA',
      medications: [
        {
          name: 'Lisinopril 10mg',
          dosage: '10mg',
          quantity: 30,
          instructions: 'Take once daily with food',
          available: true,
          price: 25.99
        },
        {
          name: 'Hydrochlorothiazide 25mg',
          dosage: '25mg',
          quantity: 30,
          instructions: 'Take once daily in morning',
          available: true,
          price: 18.50
        }
      ]
    },
    {
      id: 'RX002',
      patientName: 'Emily Davis',
      patientId: 'P002',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialty: 'Endocrinology',
      diagnosis: 'Type 2 Diabetes',
      issuedDate: '2024-01-24',
      validUntil: '2024-03-24',
      status: 'verified',
      urgent: true,
      qrCode: 'QR_CODE_DATA',
      medications: [
        {
          name: 'Metformin 500mg',
          dosage: '500mg',
          quantity: 60,
          instructions: 'Take twice daily with meals',
          available: true,
          price: 32.75
        },
        {
          name: 'Insulin Glargine',
          dosage: '100 units/mL',
          quantity: 5,
          instructions: 'Inject once daily at bedtime',
          available: false,
          price: 89.99
        }
      ]
    },
    {
      id: 'RX003',
      patientName: 'Robert Wilson',
      patientId: 'P003',
      doctorName: 'Dr. Lisa Thompson',
      doctorSpecialty: 'Family Medicine',
      diagnosis: 'Upper Respiratory Infection',
      issuedDate: '2024-01-23',
      validUntil: '2024-01-30',
      status: 'dispensed',
      urgent: false,
      qrCode: 'QR_CODE_DATA',
      medications: [
        {
          name: 'Amoxicillin 500mg',
          dosage: '500mg',
          quantity: 21,
          instructions: 'Take three times daily for 7 days',
          available: true,
          price: 15.25
        }
      ]
    }
  ];

  const getStatusIcon = (status: Prescription['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'dispensed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Prescription['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      case 'dispensed':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateTotal = (medications: Medication[]) => {
    return medications.reduce((total, med) => total + med.price, 0);
  };

  if (selectedPrescription) {
    return (
      <Layout title="Prescription Details">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedPrescription(null)}
            className="mb-6 inline-flex items-center text-medical-600 hover:text-medical-700"
          >
            ← Back to Prescriptions
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-medical-600 to-primary-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Prescription #{selectedPrescription.id}</h1>
                  <p className="text-medical-100">Digital Prescription Verification</p>
                </div>
                <div className="flex items-center space-x-3">
                  {selectedPrescription.urgent && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Urgent
                    </span>
                  )}
                  <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium">{selectedPrescription.patientName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-5 h-5 mr-3"></span>
                      <span className="text-gray-600">ID: {selectedPrescription.patientId}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescribing Doctor</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium">{selectedPrescription.doctorName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-5 h-5 mr-3"></span>
                      <span className="text-gray-600">{selectedPrescription.doctorSpecialty}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescription Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Diagnosis:</span>
                      <span className="ml-2 font-medium">{selectedPrescription.diagnosis}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Issued:</span>
                      <span className="ml-2 font-medium">{new Date(selectedPrescription.issuedDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Valid Until:</span>
                      <span className="ml-2 font-medium">{new Date(selectedPrescription.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescribed Medications</h3>
                <div className="space-y-4">
                  {selectedPrescription.medications.map((medication, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <Pill className="w-5 h-5 text-medical-600 mr-3" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                            <p className="text-gray-600">Quantity: {medication.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${medication.price}</p>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            medication.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {medication.available ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Instructions:</span> {medication.instructions}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedPrescription.notes && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Doctor's Notes</h3>
                  <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    {selectedPrescription.notes}
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-medical-600">
                    ${calculateTotal(selectedPrescription.medications).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify Prescription
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Pill className="w-4 h-4 mr-2" />
                  Dispense Medication
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Patient
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Prescription Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Prescription Management</h2>
            <p className="text-gray-600 mt-1">Review and process digital prescriptions</p>
          </div>
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700">
            <QrCode className="w-4 h-4 mr-2" />
            Scan QR Code
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {prescriptions.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {prescriptions.filter(p => p.status === 'verified').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dispensed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {prescriptions.filter(p => p.status === 'dispensed').length}
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
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {prescriptions.filter(p => p.urgent).length}
                </p>
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
                  placeholder="Search prescriptions..."
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
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="dispensed">Dispensed</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPrescription(prescription)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(prescription.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      Prescription #{prescription.id}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </span>
                    {prescription.urgent && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Patient</p>
                      <p className="font-medium text-gray-900">{prescription.patientName}</p>
                      <p className="text-sm text-gray-600">ID: {prescription.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-medium text-gray-900">{prescription.doctorName}</p>
                      <p className="text-sm text-gray-600">{prescription.doctorSpecialty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Diagnosis</p>
                      <p className="font-medium text-gray-900">{prescription.diagnosis}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Issued: {new Date(prescription.issuedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Pill className="w-4 h-4 mr-1" />
                      {prescription.medications.length} medication(s)
                    </div>
                    <span>Total: ${calculateTotal(prescription.medications).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPrescription(prescription);
                    }}
                    className="p-2 text-gray-400 hover:text-medical-600 hover:bg-medical-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PrescriptionManagement;