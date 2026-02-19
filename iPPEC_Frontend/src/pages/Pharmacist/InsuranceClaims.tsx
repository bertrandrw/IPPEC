import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  CreditCard, 
  Search, 
  Filter,
  Plus,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  User,
  FileText,
  Calendar,
  DollarSign,
  Building2,
  Send
} from 'lucide-react';

interface InsuranceClaim {
  id: string;
  patientName: string;
  patientId: string;
  insuranceProvider: string;
  policyNumber: string;
  prescriptionId: string;
  orderId: string;
  claimAmount: number;
  approvedAmount?: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'paid';
  submittedDate: string;
  processedDate?: string;
  rejectionReason?: string;
  medications: ClaimMedication[];
  doctorName: string;
  notes?: string;
}

interface ClaimMedication {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  covered: boolean;
  copayAmount?: number;
}

const InsuranceClaims: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);

  const claims: InsuranceClaim[] = [
    {
      id: 'CLM001',
      patientName: 'John Smith',
      patientId: 'P001',
      insuranceProvider: 'BlueCross BlueShield',
      policyNumber: 'BC123456789',
      prescriptionId: 'RX001',
      orderId: 'ORD001',
      claimAmount: 44.49,
      approvedAmount: 39.49,
      status: 'approved',
      submittedDate: '2024-01-25',
      processedDate: '2024-01-27',
      doctorName: 'Dr. Sarah Johnson',
      medications: [
        {
          name: 'Lisinopril 10mg',
          quantity: 30,
          unitPrice: 0.87,
          totalPrice: 25.99,
          covered: true,
          copayAmount: 5.00
        },
        {
          name: 'Hydrochlorothiazide 25mg',
          quantity: 30,
          unitPrice: 0.62,
          totalPrice: 18.50,
          covered: true,
          copayAmount: 0.00
        }
      ]
    },
    {
      id: 'CLM002',
      patientName: 'Emily Davis',
      patientId: 'P002',
      insuranceProvider: 'Aetna',
      policyNumber: 'AET987654321',
      prescriptionId: 'RX002',
      orderId: 'ORD002',
      claimAmount: 122.74,
      status: 'pending',
      submittedDate: '2024-01-24',
      doctorName: 'Dr. Michael Chen',
      medications: [
        {
          name: 'Metformin 500mg',
          quantity: 60,
          unitPrice: 0.55,
          totalPrice: 32.75,
          covered: true,
          copayAmount: 10.00
        },
        {
          name: 'Insulin Glargine',
          quantity: 5,
          unitPrice: 18.00,
          totalPrice: 89.99,
          covered: true,
          copayAmount: 25.00
        }
      ]
    },
    {
      id: 'CLM003',
      patientName: 'Robert Wilson',
      patientId: 'P003',
      insuranceProvider: 'Cigna',
      policyNumber: 'CIG456789123',
      prescriptionId: 'RX003',
      orderId: 'ORD003',
      claimAmount: 15.25,
      status: 'rejected',
      submittedDate: '2024-01-23',
      processedDate: '2024-01-25',
      rejectionReason: 'Medication not covered under current plan',
      doctorName: 'Dr. Lisa Thompson',
      medications: [
        {
          name: 'Amoxicillin 500mg',
          quantity: 21,
          unitPrice: 0.73,
          totalPrice: 15.25,
          covered: false
        }
      ]
    },
    {
      id: 'CLM004',
      patientName: 'Sarah Martinez',
      patientId: 'P004',
      insuranceProvider: 'UnitedHealth',
      policyNumber: 'UH789123456',
      prescriptionId: 'RX004',
      orderId: 'ORD004',
      claimAmount: 67.50,
      approvedAmount: 67.50,
      status: 'paid',
      submittedDate: '2024-01-22',
      processedDate: '2024-01-24',
      doctorName: 'Dr. James Wilson',
      medications: [
        {
          name: 'Atorvastatin 20mg',
          quantity: 30,
          unitPrice: 1.43,
          totalPrice: 42.75,
          covered: true,
          copayAmount: 0.00
        },
        {
          name: 'Aspirin 81mg',
          quantity: 90,
          unitPrice: 0.28,
          totalPrice: 24.75,
          covered: true,
          copayAmount: 0.00
        }
      ]
    }
  ];

  const insuranceProviders = [
    'BlueCross BlueShield', 'Aetna', 'Cigna', 'UnitedHealth', 
    'Humana', 'Kaiser Permanente', 'Medicare', 'Medicaid'
  ];

  const getStatusIcon = (status: InsuranceClaim['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'submitted':
        return <Send className="w-4 h-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: InsuranceClaim['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || claim.insuranceProvider === providerFilter;
    return matchesSearch && matchesStatus && matchesProvider;
  });

  const claimStats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'pending').length,
    approved: claims.filter(c => c.status === 'approved').length,
    rejected: claims.filter(c => c.status === 'rejected').length,
    paid: claims.filter(c => c.status === 'paid').length,
    totalAmount: claims.reduce((sum, claim) => sum + claim.claimAmount, 0),
    approvedAmount: claims.reduce((sum, claim) => sum + (claim.approvedAmount || 0), 0)
  };

  if (selectedClaim) {
    return (
      <Layout title="Insurance Claim Details">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedClaim(null)}
            className="mb-6 inline-flex items-center text-medical-600 hover:text-medical-700"
          >
            ← Back to Claims
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-success-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Claim #{selectedClaim.id}</h1>
                  <p className="text-primary-100">Insurance Claim Processing</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClaim.status)} text-gray-800`}>
                    {selectedClaim.status.charAt(0).toUpperCase() + selectedClaim.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Patient & Insurance Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium">{selectedClaim.patientName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-5 h-5 mr-3"></span>
                      <span className="text-gray-600">ID: {selectedClaim.patientId}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">Prescription: {selectedClaim.prescriptionId}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-5 h-5 mr-3"></span>
                      <span className="text-gray-600">Order: {selectedClaim.orderId}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium">{selectedClaim.insuranceProvider}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-5 h-5 mr-3"></span>
                      <span className="text-gray-600">Policy: {selectedClaim.policyNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">
                        Submitted: {new Date(selectedClaim.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedClaim.processedDate && (
                      <div className="flex items-center">
                        <span className="w-5 h-5 mr-3"></span>
                        <span className="text-gray-600">
                          Processed: {new Date(selectedClaim.processedDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claimed Medications</h3>
                <div className="space-y-4">
                  {selectedClaim.medications.map((medication, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                          <p className="text-gray-600">Quantity: {medication.quantity} • Unit Price: ${medication.unitPrice}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${medication.totalPrice.toFixed(2)}</p>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            medication.covered 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {medication.covered ? 'Covered' : 'Not Covered'}
                          </div>
                        </div>
                      </div>
                      
                      {medication.covered && medication.copayAmount !== undefined && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Patient Copay:</span> ${medication.copayAmount.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedClaim.rejectionReason && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Rejection Reason</h3>
                  <p className="text-red-700 bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    {selectedClaim.rejectionReason}
                  </p>
                </div>
              )}

              {/* Claim Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Claim Amount</p>
                    <p className="text-xl font-bold text-gray-900">${selectedClaim.claimAmount.toFixed(2)}</p>
                  </div>
                  {selectedClaim.approvedAmount !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Approved Amount</p>
                      <p className="text-xl font-bold text-green-600">${selectedClaim.approvedAmount.toFixed(2)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Patient Responsibility</p>
                    <p className="text-xl font-bold text-orange-600">
                      ${selectedClaim.medications.reduce((sum, med) => sum + (med.copayAmount || 0), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {selectedClaim.status === 'pending' && (
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Claim
                  </button>
                )}
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-2" />
                  View Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Insurance Claims">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Insurance Claims</h2>
            <p className="text-gray-600 mt-1">Manage and track insurance claim submissions</p>
          </div>
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700">
            <Plus className="w-4 h-4 mr-2" />
            New Claim
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold text-gray-900">{claimStats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{claimStats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{claimStats.approved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{claimStats.rejected}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${claimStats.totalAmount.toFixed(0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Amount</p>
                <p className="text-2xl font-bold text-gray-900">${claimStats.approvedAmount.toFixed(0)}</p>
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
                  placeholder="Search claims..."
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
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
              </select>
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
              >
                <option value="all">All Providers</option>
                {insuranceProviders.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedClaim(claim)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(claim.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      Claim #{claim.id}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Patient</p>
                      <p className="font-medium text-gray-900">{claim.patientName}</p>
                      <p className="text-sm text-gray-600">ID: {claim.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Insurance</p>
                      <p className="font-medium text-gray-900">{claim.insuranceProvider}</p>
                      <p className="text-sm text-gray-600">{claim.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prescription</p>
                      <p className="font-medium text-gray-900">{claim.prescriptionId}</p>
                      <p className="text-sm text-gray-600">Dr. {claim.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-bold text-gray-900">${claim.claimAmount.toFixed(2)}</p>
                      {claim.approvedAmount && (
                        <p className="text-sm text-green-600">Approved: ${claim.approvedAmount.toFixed(2)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Submitted: {new Date(claim.submittedDate).toLocaleDateString()}
                    </div>
                    {claim.processedDate && (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Processed: {new Date(claim.processedDate).toLocaleDateString()}
                      </div>
                    )}
                    <span>{claim.medications.length} medication(s)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClaim(claim);
                    }}
                    className="p-2 text-gray-400 hover:text-medical-600 hover:bg-medical-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredClaims.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or create a new claim.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InsuranceClaims;