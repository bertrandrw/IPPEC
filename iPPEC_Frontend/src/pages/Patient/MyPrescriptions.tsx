import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  FileText, 
  Search, 
  Filter,
  Download,
  Eye,
  Calendar,
  Clock,
  User,
  Pill,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Share2,
  QrCode,
  Loader,
  Send
} from 'lucide-react';
import { Prescription } from '../../types/prescription';
import { apiClient } from '../../utils/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SharePrescriptionModal from './SharePrescriptionModal';

const MyPrescriptions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Prescription[]>('/prescriptions/patient/me');
        if (response.success) {
          setPrescriptions(response.data);
        } else {
          toast.error(response.message);
          setError(response.message);
        }
      } catch (error: any) {
        toast.error(error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const getStatusIcon = (status: Prescription['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'EXPIRED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'FULFILLED':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Prescription['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'FULFILLED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.chiefComplaints.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medicines.some(med => med.medicine.brandName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || prescription.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <Layout title="My Prescriptions"><LoadingSpinner /></Layout>;
  }

  if (error) {
    return (
      <Layout title="My Prescriptions">
        <div className="text-center py-8 lg:py-12 px-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading prescriptions</h3>
          <p className="text-gray-500 text-sm lg:text-base">{error}</p>
        </div>
      </Layout>
    );
  }

  if (selectedPrescription) {
    return (
      <>
        <Layout title="Prescription Details">
          <div className="max-w-4xl mx-auto px-4">
                        <button
              onClick={() => setSelectedPrescription(null)}
              className="mb-4 lg:mb-6 inline-flex items-center text-medical-600 hover:text-medical-700 text-sm lg:text-base"
            >
              ← Back to Prescriptions
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-medical-600 to-primary-600 p-4 lg:p-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold">Prescription #{selectedPrescription.id.slice(-6)}</h1>
                    <p className="text-medical-100 text-sm lg:text-base">Digital Prescription from {selectedPrescription.hospital.name}</p>
                  </div>
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <button
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <QrCode className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                      <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                      <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 lg:p-6">
                {/* Doctor Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Prescribing Doctor</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 mr-2 lg:mr-3 flex-shrink-0" />
                        <span className="font-medium text-sm lg:text-base">{selectedPrescription.doctor.fullName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3"></span>
                        <span className="text-gray-600 text-sm lg:text-base">{selectedPrescription.doctor.specialty}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Prescription Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 mr-2 lg:mr-3 flex-shrink-0" />
                        <span className="text-sm lg:text-base">Issued: {new Date(selectedPrescription.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 mr-2 lg:mr-3 flex-shrink-0" />
                        <span className="text-sm lg:text-base">Follow-up: {selectedPrescription.followUpDate ? new Date(selectedPrescription.followUpDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(selectedPrescription.status)}
                        <span className={`ml-2 lg:ml-3 px-2 py-1 rounded-full text-xs lg:text-sm font-medium ${getStatusColor(selectedPrescription.status)}`}>
                          {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="mb-6 lg:mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Chief Complaints</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 lg:p-4 rounded-lg text-sm lg:text-base">{selectedPrescription.chiefComplaints}</p>
                </div>

                {/* Medications */}
                <div className="mb-6 lg:mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Prescribed Medications</h3>
                  <div className="space-y-3 lg:space-y-4">
                    {selectedPrescription.medicines.map((medication, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 lg:p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <Pill className="w-5 h-5 text-medical-600 mr-3" />
                            <div>
                              <h4 className="font-semibold text-gray-900">{medication.medicine.brandName}</h4>
                              <p className="text-gray-600">{medication.medicine.genericName}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">Qty: {medication.totalQuantity}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Route:</span>
                            <span className="ml-2 text-gray-600">{medication.route}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Form:</span>
                            <span className="ml-2 text-gray-600">{medication.form}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Frequency:</span>
                            <span className="ml-2 text-gray-600">{medication.frequency}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Duration:</span>
                            <span className="ml-2 text-gray-600">{medication.durationInDays} days</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Instructions:</span> {medication.fullInstruction}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedPrescription.advice && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Doctor's Advice</h3>
                    <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      {selectedPrescription.advice}
                    </p>
                  </div>
                )}

                {/* QR Code */}
                {showQRCode && (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code for Pharmacy</h3>
                    <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Show this QR code to your pharmacist to access your prescription
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                  <button className="inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    onClick={() => setShareModalOpen(true)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share with Pharmacy
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Request Refill
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Layout>
        <SharePrescriptionModal
          prescription={selectedPrescription}
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
        />
      </>
    );
  }

  return (
    <Layout title="My Prescriptions">
      <div className="space-y-6">
        {/* Header */}
        <div className="relative text-center bg-gradient-to-br from-[#E1F5FE] via-white to-[#E1F5FE]/20 py-8 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <h2 className="text-3xl font-bold text-[#01579B] mb-3 drop-shadow-sm">My Digital Prescriptions</h2>
          <p className="text-[#0288D1] max-w-2xl mx-auto text-base">
            Access and manage all your digital prescriptions in one secure place
          </p>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#E1F5FE] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob" />
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#0288D1] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          </div>
          <div className="mt-6">
            
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-md border border-slate-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-[#E1F5FE] flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors duration-200">
                <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-[#0288D1]" />
              </div>
              <div className="ml-3 lg:ml-4">
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-xl lg:text-3xl font-bold text-[#01579B]">
                  {prescriptions.filter(p => p.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-md border border-slate-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-[#E1F5FE] flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors duration-200">
                <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-[#0288D1]" />
              </div>
              <div className="ml-3 lg:ml-4">
                <p className="text-sm font-medium text-slate-600">Fulfilled</p>
                <p className="text-xl lg:text-3xl font-bold text-[#01579B]">
                  {prescriptions.filter(p => p.status === 'FULFILLED').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-md border border-slate-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-[#E1F5FE] flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors duration-200">
                <XCircle className="w-5 h-5 lg:w-7 lg:h-7 text-[#0288D1]" />
              </div>
              <div className="ml-3 lg:ml-4">
                <p className="text-sm font-medium text-slate-600">Expired</p>
                <p className="text-xl lg:text-3xl font-bold text-[#01579B]">
                  {prescriptions.filter(p => p.status === 'EXPIRED').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-md border border-slate-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-[#E1F5FE] flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors duration-200">
                <FileText className="w-5 h-5 lg:w-7 lg:h-7 text-[#0288D1]" />
              </div>
              <div className="ml-3 lg:ml-4">
                <p className="text-sm font-medium text-slate-600">Total</p>
                <p className="text-xl lg:text-3xl font-bold text-[#01579B]">{prescriptions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by doctor, condition, or medicine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0288D1] focus:border-[#0288D1] outline-none w-full transition-colors duration-200"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-[#0288D1]" />
                  <span className="text-sm font-medium text-slate-600">Filter by status:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:ring-2 focus:ring-[#0288D1] focus:border-[#0288D1] outline-none cursor-pointer hover:border-[#0288D1]/30 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50/50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#0288D1]/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#0288D1]" />
                </div>
                <span className="text-sm font-medium text-slate-600">
                  Found <span className="text-[#0288D1] font-semibold">{filteredPrescriptions.length}</span> prescriptions
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-600">Sort by:</span>
                <select
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:ring-2 focus:ring-[#0288D1] focus:border-[#0288D1] outline-none cursor-pointer hover:border-[#0288D1]/30 transition-colors"
                >
                  <option value="date">Date</option>
                  <option value="status">Status</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="group bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-md border border-slate-200 hover:shadow-xl hover:border-[#0288D1]/30 transition-all duration-200 cursor-pointer overflow-hidden"
              onClick={() => setSelectedPrescription(prescription)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0288D1]/10 flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors">
                    <FileText className="w-6 h-6 text-[#0288D1]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#0288D1] transition-colors">
                            Prescription #{prescription.id.slice(-6)}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(prescription.status)}`}>
                            {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1).toLowerCase()}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-[#0288D1]" />
                          <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-lg transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPrescription(prescription);
                            setShareModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-lg transition-colors"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 group-hover:bg-[#E1F5FE]/50 transition-colors">
                        <User className="w-5 h-5 text-[#0288D1] mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">{prescription.doctor.fullName}</p>
                          <p className="text-sm text-slate-600">{prescription.doctor.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 group-hover:bg-[#E1F5FE]/50 transition-colors">
                        <AlertCircle className="w-5 h-5 text-[#0288D1] mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">Chief Complaints</p>
                          <p className="text-sm text-slate-600">{prescription.chiefComplaints}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Pill className="w-4 h-4 text-[#0288D1]" />
                          <span>{prescription.medicines.length} medication(s)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#0288D1]" />
                          <span>Follow-up: {prescription.followUpDate ? new Date(prescription.followUpDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                      <button className="inline-flex items-center px-4 py-2 text-[#0288D1] font-medium text-sm hover:bg-[#E1F5FE] rounded-lg transition-colors">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <FileText className="w-12 h-12 text-[#0288D1] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No prescriptions found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? "No prescriptions match your search criteria. Try adjusting your filters or search terms."
                  : "You don't have any prescriptions yet. Your digital prescriptions will appear here when they are issued."}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyPrescriptions;