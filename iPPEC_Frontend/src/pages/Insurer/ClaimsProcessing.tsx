import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  FileText, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Building2,
  Download,
  AlertCircle,
  Pill,
  Activity,
  Send,
  MessageSquare
} from 'lucide-react';

interface Claim {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  patientName: string;
  patientId: string;
  prescriptionId: string;
  doctorName: string;
  medications: ClaimMedication[];
  totalAmount: number;
  claimedAmount: number;
  approvedAmount?: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'paid';
  submittedDate: string;
  reviewedDate?: string;
  paidDate?: string;
  rejectionReason?: string;
  priority: 'low' | 'medium' | 'high';
  membershipNumber: string;
  diagnosis: string;
  reviewNotes?: string;
}

interface ClaimMedication {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  covered: boolean;
  copayAmount?: number;
  deductibleApplied?: number;
}

const ClaimsProcessing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const claims: Claim[] = [
    {
      id: 'CLM001',
      pharmacyId: 'PH001',
      pharmacyName: 'HealthFirst Pharmacy',
      patientName: 'John Smith',
      patientId: 'P001',
      prescriptionId: 'RX001',
      doctorName: 'Dr. Sarah Johnson',
      totalAmount: 125.50,
      claimedAmount: 125.50,
      approvedAmount: 100.50,
      status: 'approved',
      submittedDate: '2024-01-25',
      reviewedDate: '2024-01-26',
      priority: 'medium',
      membershipNumber: 'MEM123456',
      diagnosis: 'Hypertension',
      reviewNotes: 'Standard hypertension treatment. Approved with standard copay.',
      medications: [
        {
          name: 'Lisinopril 10mg',
          quantity: 30,
          unitPrice: 2.50,
          totalPrice: 75.00,
          covered: true,
          copayAmount: 10.00
        },
        {
          name: 'Hydrochlorothiazide 25mg',
          quantity: 30,
          unitPrice: 1.68,
          totalPrice: 50.50,
          covered: true,
          copayAmount: 15.00
        }
      ]
    },
    {
      id: 'CLM002',
      pharmacyId: 'PH002',
      pharmacyName: 'MediCare Plus',
      patientName: 'Sarah Johnson',
      patientId: 'P002',
      prescriptionId: 'RX002',
      doctorName: 'Dr. Michael Chen',
      totalAmount: 89.75,
      claimedAmount: 89.75,
      status: 'pending',
      submittedDate: '2024-01-24',
      priority: 'high',
      membershipNumber: 'MEM789012',
      diagnosis: 'Upper Respiratory Infection',
      medications: [
        {
          name: 'Amoxicillin 500mg',
          quantity: 21,
          unitPrice: 4.27,
          totalPrice: 89.75,
          covered: true,
          copayAmount: 20.00
        }
      ]
    },
    {
      id: 'CLM003',
      pharmacyId: 'PH001',
      pharmacyName: 'HealthFirst Pharmacy',
      patientName: 'Mike Wilson',
      patientId: 'P003',
      prescriptionId: 'RX003',
      doctorName: 'Dr. Lisa Thompson',
      totalAmount: 234.20,
      claimedAmount: 234.20,
      status: 'under_review',
      submittedDate: '2024-01-23',
      priority: 'high',
      membershipNumber: 'MEM345678',
      diagnosis: 'Type 2 Diabetes',
      medications: [
        {
          name: 'Insulin Glargine',
          quantity: 5,
          unitPrice: 35.00,
          totalPrice: 175.00,
          covered: true,
          copayAmount: 50.00
        },
        {
          name: 'Blood Glucose Test Strips',
          quantity: 100,
          unitPrice: 0.59,
          totalPrice: 59.20,
          covered: true,
          copayAmount: 10.00
        }
      ]
    },
    {
      id: 'CLM004',
      pharmacyId: 'PH003',
      pharmacyName: 'QuickMeds Pharmacy',
      patientName: 'Emily Davis',
      patientId: 'P004',
      prescriptionId: 'RX004',
      doctorName: 'Dr. James Wilson',
      totalAmount: 45.30,
      claimedAmount: 45.30,
      status: 'rejected',
      submittedDate: '2024-01-22',
      reviewedDate: '2024-01-23',
      rejectionReason: 'Medication not covered under current plan',
      priority: 'low',
      membershipNumber: 'MEM901234',
      diagnosis: 'Allergic Reaction',
      reviewNotes: 'EpiPen not covered under basic plan. Patient needs to upgrade coverage.',
      medications: [
        {
          name: 'EpiPen Auto-Injector',
          quantity: 2,
          unitPrice: 22.65,
          totalPrice: 45.30,
          covered: false
        }
      ]
    }
  ];

  const getStatusIcon = (status: Claim['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'under_review':
        return <Activity className="w-4 h-4 text-blue-500" />;
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

  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
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

  const getPriorityColor = (priority: Claim['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || claim.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const claimStats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'pending').length,
    underReview: claims.filter(c => c.status === 'under_review').length,
    approved: claims.filter(c => c.status === 'approved').length,
    rejected: claims.filter(c => c.status === 'rejected').length,
    paid: claims.filter(c => c.status === 'paid').length,
    totalAmount: claims.reduce((sum, claim) => sum + claim.claimedAmount, 0),
    approvedAmount: claims.reduce((sum, claim) => sum + (claim.approvedAmount || 0), 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (selectedClaim) {
    return (
      <Layout title="Claim Details">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedClaim(null)}
            className="mb-6 inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            ← Back to Claims
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-success-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Claim #{selectedClaim.id}</h1>
                  <p className="text-primary-100">Insurance Claim Review</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedClaim.priority)} text-gray-800`}>
                    {selectedClaim.priority} priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClaim.status)} text-gray-800`}>
                    {selectedClaim.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Patient & Pharmacy Info */}
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
                      <span className="w-5 h-5 mr-3"></span>
                      <span className="text-gray-600">Membership: {selectedClaim.membershipNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-5 h-5 mr-3"></span>
                      <span className="text-gray-600">Diagnosis: {selectedClaim.diagnosis}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pharmacy & Doctor</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium">{selectedClaim.pharmacyName}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{selectedClaim.doctorName}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">Prescription: {selectedClaim.prescriptionId}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">
                        Submitted: {new Date(selectedClaim.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
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
                        <div className="flex items-center">
                          <Pill className="w-5 h-5 text-primary-600 mr-3" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                            <p className="text-gray-600">Quantity: {medication.quantity} • Unit Price: {formatCurrency(medication.unitPrice)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(medication.totalPrice)}</p>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            medication.covered 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {medication.covered ? 'Covered' : 'Not Covered'}
                          </div>
                        </div>
                      </div>
                      
                      {medication.covered && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg">
                          {medication.copayAmount !== undefined && (
                            <div>
                              <span className="text-sm text-blue-600 font-medium">Patient Copay:</span>
                              <span className="ml-2 text-blue-800">{formatCurrency(medication.copayAmount)}</span>
                            </div>
                          )}
                          {medication.deductibleApplied !== undefined && (
                            <div>
                              <span className="text-sm text-blue-600 font-medium">Deductible Applied:</span>
                              <span className="ml-2 text-blue-800">{formatCurrency(medication.deductibleApplied)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Notes */}
              {selectedClaim.reviewNotes && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Review Notes</h3>
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    {selectedClaim.reviewNotes}
                  </p>
                </div>
              )}

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
                    <p className="text-sm text-gray-500">Total Claimed Amount</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedClaim.claimedAmount)}</p>
                  </div>
                  {selectedClaim.approvedAmount !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Approved Amount</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(selectedClaim.approvedAmount)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Patient Responsibility</p>
                    <p className="text-xl font-bold text-orange-600">
                      {formatCurrency(selectedClaim.medications.reduce((sum, med) => sum + (med.copayAmount || 0), 0))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {selectedClaim.status === 'pending' && (
                  <>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Activity className="w-4 h-4 mr-2" />
                      Start Review
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Quick Approve
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Claim
                    </button>
                  </>
                )}
                {selectedClaim.status === 'under_review' && (
                  <>
                    <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Claim
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Claim
                    </button>
                  </>
                )}
                {selectedClaim.status === 'approved' && (
                  <button className="inline-flex items-center px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700">
                    <Send className="w-4 h-4 mr-2" />
                    Process Payment
                  </button>
                )}
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Pharmacy
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Claims Processing">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Claims Processing</h2>
            <p className="text-gray-600 mt-1">Review and process insurance claims from partner pharmacies</p>
          </div>
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Download className="w-4 h-4 mr-2" />
            Export Claims
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{claimStats.underReview}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(claimStats.totalAmount).replace('.00', '')}</p>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full sm:w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
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
                      {claim.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(claim.priority)}`}>
                      {claim.priority} priority
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Patient</p>
                      <p className="font-medium text-gray-900">{claim.patientName}</p>
                      <p className="text-sm text-gray-600">{claim.membershipNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pharmacy</p>
                      <p className="font-medium text-gray-900">{claim.pharmacyName}</p>
                      <p className="text-sm text-gray-600">{claim.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Diagnosis</p>
                      <p className="font-medium text-gray-900">{claim.diagnosis}</p>
                      <p className="text-sm text-gray-600">{claim.medications.length} medication(s)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-bold text-gray-900">{formatCurrency(claim.claimedAmount)}</p>
                      {claim.approvedAmount && (
                        <p className="text-sm text-green-600">Approved: {formatCurrency(claim.approvedAmount)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Submitted: {new Date(claim.submittedDate).toLocaleDateString()}
                    </div>
                    {claim.reviewedDate && (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Reviewed: {new Date(claim.reviewedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClaim(claim);
                    }}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredClaims.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClaimsProcessing;