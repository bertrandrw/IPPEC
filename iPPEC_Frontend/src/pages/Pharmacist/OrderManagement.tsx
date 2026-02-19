import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  ShoppingCart, 
  Search, 
  Filter,
  Eye,
  Calendar,
  Clock,
  User,
  Package,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ordersAPI } from '../../utils/api';

interface Order {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  patientId: string;
  pharmacyId: string;
  patient: {
    id: string;
    userId: string;
    fullName: string;
    dateOfBirth: string;
    sex: string;
    nid: string;
    insuranceCompanyId: string | null;
    insurancePolicyNumber: string | null;
  };
  orderItems: Array<{
    id: string;
    quantity: number;
    orderId: string;
    medicineId: string;
    prescriptionId: string;
    medicine: {
      id: string;
      brandName: string;
      genericName: string;
      manufacturer: string;
      price: string;
      createdAt: string;
    };
    prescription: {
      id: string;
      createdAt: string;
      patientId: string;
      doctorId: string;
      hospitalId: string;
      chiefComplaints: string;
      findingsOnExam: string;
      investigations: string | null;
      advice: string;
      followUpDate: string;
      status: string;
      dispensedById: string | null;
      dispensedAt: string | null;
      doctor: {
        fullName: string;
        specialty: string;
        credentials: string;
        hospital: {
          name: string;
        };
      };
    };
  }>;
  prescription: {
    id: string;
    createdAt: string;
    doctor: {
      fullName: string;
      specialty: string;
      credentials: string;
      hospital: {
        name: string;
      };
    };
  };
}

interface OrderListItem {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  patientId: string;
  pharmacyId: string;
  patient: {
    fullName: string;
  };
  _count: {
    orderItems: number;
  };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  READY: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusIcons: Record<string, JSX.Element> = {
  PENDING: <Clock className="w-5 h-5 text-yellow-500" />,
  CONFIRMED: <CheckCircle className="w-5 h-5 text-blue-500" />,
  PREPARING: <Package className="w-5 h-5 text-orange-500" />,
  READY: <CheckCircle className="w-5 h-5 text-green-500" />,
  DELIVERED: <Truck className="w-5 h-5 text-green-500" />,
  CANCELLED: <XCircle className="w-5 h-5 text-red-500" />,
};

const paymentLabels: Record<string, string> = {
  CASH: 'Cash',
  CARD: 'Card',
  INSURANCE: 'Insurance',
  ONLINE: 'Online',
};

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrescription, setShowPrescription] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getPharmacyOrders();
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await ordersAPI.getPharmacyOrderDetails(orderId);
      if (response.success) {
        setSelectedOrder(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch order details');
      }
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      toast.error('Failed to fetch order details');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        // Update the order in the list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        
        // Update selected order if it's the same one
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
        
        toast.success(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        toast.error(response.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Calculate total amount for an order
  const calculateTotalAmount = (order: Order) => {
    return order.orderItems.reduce((total, item) => {
      return total + (parseFloat(item.medicine.price) * item.quantity);
    }, 0);
  };

  // Stats
  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
  };

  if (loading) {
    return <Layout title="Order Management"><LoadingSpinner /></Layout>;
  }

  if (error) {
    return (
      <Layout title="Order Management">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading orders</h3>
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-4 inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  if (selectedOrder) {
    const totalAmount = calculateTotalAmount(selectedOrder);
    
    return (
      <Layout title="Order Details">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedOrder(null)}
            className="mb-6 inline-flex items-center text-medical-600 hover:text-medical-700"
          >
            ← Back to Orders
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-medical-600 to-primary-600 p-6 text-white flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Order #{selectedOrder.id.slice(-6)}</h1>
                <p className="text-medical-100">Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-3">
                {statusIcons[selectedOrder.status]}
                <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Order Info */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Information</h3>
                <div className="flex items-center space-x-3 mb-2">
                  <User className="w-5 h-5 text-medical-600" />
                  <span className="text-gray-700">{selectedOrder.patient.fullName}</span>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">DOB: {new Date(selectedOrder.patient.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">NID: {selectedOrder.patient.nid}</span>
                </div>
                {selectedOrder.patient.insurancePolicyNumber && (
                  <div className="flex items-center space-x-3 mb-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Insurance: {selectedOrder.patient.insurancePolicyNumber}</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h3>
                <div className="flex items-center space-x-3 mb-2">
                  <ShoppingCart className="w-5 h-5 text-medical-600" />
                  <span className="text-gray-700">{selectedOrder.orderItems.length} item(s)</span>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Total: <span className="font-bold">${totalAmount.toFixed(2)}</span></span>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Doctor: {selectedOrder.prescription.doctor.fullName}</span>
                </div>
                {/* View Full Prescription Button */}
                <button
                  className="mt-4 px-4 py-2 bg-[#E1F5FE] text-[#0288D1] rounded-lg font-semibold hover:bg-[#B3E5FC]"
                  onClick={() => setShowPrescription(true)}
                >
                  View Full Prescription
                </button>
              </div>
            </div>

            {/* Modal for full prescription details */}
            {showPrescription && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 border-4 border-[#0288D1] relative animate-fadeIn">
                  <button
                    className="absolute top-3 right-3 text-[#0288D1] hover:text-[#01579B] text-2xl font-bold focus:outline-none"
                    onClick={() => setShowPrescription(false)}
                    aria-label="Close"
                    tabIndex={0}
                  >
                    &times;
                  </button>
                  {/* Patient Avatar & Quick Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#E1F5FE] flex items-center justify-center text-2xl font-bold text-[#0288D1] shadow" aria-label="Patient Avatar">
                      {selectedOrder.patient.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-lg text-[#0288D1]">{selectedOrder.patient.fullName}</div>
                      <div className="text-sm text-slate-700">Sex: {selectedOrder.patient.sex} | Age: {Math.floor((Date.now() - new Date(selectedOrder.patient.dateOfBirth).getTime()) / (365.25*24*60*60*1000))}</div>
                      <div className="text-sm text-slate-700">Insurance: {selectedOrder.patient.insurancePolicyNumber ? 'Active' : 'None'}</div>
                    </div>
                  </div>
                  {/* Prescription Info & Doctor Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="font-semibold text-[#0288D1] mb-1">Prescription Info</div>
                      <div className="text-sm text-slate-700">ID: <span className="font-bold">{selectedOrder.prescription.id}</span></div>
                      <div className="text-sm text-slate-700">Created: {new Date(selectedOrder.prescription.createdAt).toLocaleString()}</div>
                      <div className="text-sm text-slate-700">Status: <span className="font-bold">{selectedOrder.orderItems[0]?.prescription.status}</span></div>
                      <div className="text-sm text-slate-700">Follow Up: {selectedOrder.orderItems[0]?.prescription.followUpDate ? new Date(selectedOrder.orderItems[0].prescription.followUpDate).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#0288D1] mb-1">Doctor Info</div>
                      <div className="text-sm text-slate-700">Name: <span className="font-bold">{selectedOrder.prescription.doctor.fullName}</span></div>
                      <div className="text-sm text-slate-700">Specialty: {selectedOrder.prescription.doctor.specialty}</div>
                      <div className="text-sm text-slate-700">Credentials: {selectedOrder.prescription.doctor.credentials}</div>
                      <div className="text-sm text-slate-700">Hospital: {selectedOrder.prescription.doctor.hospital.name}</div>
                    </div>
                  </div>
                  {/* Prescription Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="font-semibold text-[#0288D1] mb-1">Chief Complaints</div>
                      <div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800 shadow">{selectedOrder.orderItems[0]?.prescription.chiefComplaints}</div>
                      <div className="font-semibold text-[#0288D1] mt-4 mb-1">Findings on Exam</div>
                      <div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800 shadow">{selectedOrder.orderItems[0]?.prescription.findingsOnExam}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#0288D1] mb-1">Advice</div>
                      <div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800 shadow">{selectedOrder.orderItems[0]?.prescription.advice}</div>
                      {selectedOrder.orderItems[0]?.prescription.investigations && (
                        <>
                          <div className="font-semibold text-[#0288D1] mt-4 mb-1">Investigations</div>
                          <div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800 shadow">{selectedOrder.orderItems[0].prescription.investigations}</div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Dispensed Info */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="font-semibold text-[#0288D1] mb-1">Dispensed By</div>
                      <div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800 shadow">{selectedOrder.orderItems[0]?.prescription.dispensedById || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#0288D1] mb-1">Dispensed At</div>
                      <div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800 shadow">{selectedOrder.orderItems[0]?.prescription.dispensedAt ? new Date(selectedOrder.orderItems[0].prescription.dispensedAt).toLocaleString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medications List */}
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ordered Medicines</h3>
              <div className="space-y-4">
                {selectedOrder.orderItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.medicine.brandName}</h4>
                      <p className="text-gray-600 text-sm">{item.medicine.genericName}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 md:mt-0">
                      <span className="text-gray-700 font-medium">${(parseFloat(item.medicine.price) * item.quantity).toFixed(2)}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 p-6 border-t border-gray-200">
              {selectedOrder.status === 'PENDING' && (
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'CONFIRMED')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Order
                </button>
              )}
              {selectedOrder.status === 'CONFIRMED' && (
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'PREPARING')}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Start Preparing
                </button>
              )}
              {selectedOrder.status === 'PREPARING' && (
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'READY')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Ready
                </button>
              )}
              {selectedOrder.status === 'READY' && (
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'DELIVERED')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Mark as Delivered
                </button>
              )}
              {selectedOrder.status !== 'DELIVERED' && selectedOrder.status !== 'CANCELLED' && (
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'CANCELLED')}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Order Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
            <p className="text-gray-600 mt-1">Manage and track customer orders</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                placeholder="Search orders..."
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
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => fetchOrderDetails(order.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {statusIcons[order.status]}
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-6)}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Patient</p>
                      <p className="font-medium text-gray-900">{order.patient.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Items</p>
                      <p className="font-medium text-gray-900">{order._count.orderItems} medicine(s)</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchOrderDetails(order.id);
                    }}
                    className="p-2 text-gray-400 hover:text-medical-600 hover:bg-medical-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderManagement;
