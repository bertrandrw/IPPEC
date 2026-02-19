import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Eye,
  AlertCircle,
  Package,
  MapPin,
  DollarSign,
  Phone,
  Calendar,
  FileText
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ordersAPI, apiClient } from '../../utils/api';
import { Prescription } from '../../types/prescription';

interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  price: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  medicine: Medicine;
  totalPrice?: number;
}

interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  patientId: string;
  pharmacyId: string;
  pharmacy: {
    name: string;
    companyCode?: string;
    address?: string;
    contactPhone?: string;
    contactEmail?: string;
  };
  totalAmount?: number;
  _count: {
    orderItems: number;
  };
  orderItems?: OrderItem[];
  deliveryAddress?: string;
  prescription?: Prescription;
  expectedDeliveryDate?: string;
  trackingNumber?: string;
}

const statusTypes = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'] as const;
type OrderStatus = typeof statusTypes[number];

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const calculateTotal = () => {
    if (order.totalAmount) return order.totalAmount.toFixed(2);
    return order.orderItems?.reduce((total, item) => {
      return total + (Number(item.medicine.price) * item.quantity);
    }, 0).toFixed(2) || '0.00';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-teal-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={onClose} 
            className="text-white hover:text-teal-100 mb-6"
          >
            ← Back to Orders
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Order #{order.id.slice(-6)}</h1>
              <p className="text-sm text-teal-50">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="px-4 py-2 rounded-full bg-yellow-400 text-yellow-800 font-medium text-sm">
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Pharmacy</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-gray-900 font-medium">Pharmacy #{order.pharmacy.companyCode || 'N/A'}</p>
                  <p className="text-gray-600">{order.pharmacy.name}</p>
                  <p className="text-gray-600">{order.pharmacy.address || 'Address not available'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-gray-600">{order.pharmacy.contactPhone || 'Phone not available'}</p>
                  <p className="text-gray-600">{order.pharmacy.contactEmail || 'Email not available'}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-teal-600" />
                  <span className="text-gray-600">Items</span>
                </div>
                <span className="font-medium text-gray-900">{order.orderItems?.length || order._count?.orderItems || 0} item(s)</span>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-teal-600" />
                  <span className="text-gray-600">Total</span>
                </div>
                <span className="font-medium text-gray-900">${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Ordered Medicines</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.orderItems?.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.medicine.brandName}</div>
                        <div className="text-sm text-gray-500">{item.medicine.genericName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${Number(item.medicine.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.totalPrice?.toFixed(2) || (Number(item.medicine.price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {!order.orderItems || order.orderItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No items in this order
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {order.prescription && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
              <FileText className="w-5 h-5" />
              View Prescription
            </button>
          )}
          {order.trackingNumber && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded border border-gray-200 hover:bg-gray-50">
              <Truck className="w-5 h-5" />
              Track Delivery
            </button>
          )}
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded border border-gray-200 hover:bg-gray-50">
            <Eye className="w-5 h-5" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  const handleOrderClick = async (order: Order) => {
    try {
      setLoadingOrderDetails(true);
      
      const response = await apiClient.get(`/orders/${order.id}`);
      if (response.success) {
        setSelectedOrder(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch order details');
      }
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      setError(error.message || 'An error occurred while fetching order details');
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const response = await ordersAPI.getPatientOrders();
        console.log('Orders response:', response); // For debugging

        if (response.success) {
          const formattedOrders = (response.data || []).map(order => ({
            ...order,
            status: order.status.toUpperCase() as OrderStatus
          }));
          setOrders(formattedOrders);
        } else {
          throw new Error(response.message || 'Failed to fetch orders');
        }
        
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'An error occurred while fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };



  if (loading) {
    return <Layout title="My Orders"><LoadingSpinner /></Layout>;
  }

  if (error) {
    return (
      <Layout title="My Orders">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading orders</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Orders">
      {loadingOrderDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
      
      <div className="space-y-6">
        {/* Header with Gradient */}
        <div className="relative text-center bg-gradient-to-br from-[#E1F5FE] via-white to-[#E1F5FE]/20 py-8 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <h2 className="text-3xl font-bold text-[#01579B] mb-3 drop-shadow-sm">My Orders</h2>
          <p className="text-[#0288D1] max-w-2xl mx-auto text-base">
            Track and manage all your pharmacy orders in one place
          </p>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#E1F5FE] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob" />
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#0288D1] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-[#E1F5FE] flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors">
                <Package className="w-5 h-5 text-[#0288D1]" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-xl font-bold text-[#01579B]">
                  {orders.filter(o => o.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-[#E1F5FE] flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors">
                <Truck className="w-5 h-5 text-[#0288D1]" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">In Transit</p>
                <p className="text-xl font-bold text-[#01579B]">
                  {orders.filter(o => o.status === 'IN_TRANSIT').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-[#E1F5FE] flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors">
                <CheckCircle className="w-5 h-5 text-[#0288D1]" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Delivered</p>
                <p className="text-xl font-bold text-[#01579B]">
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-[#E1F5FE] flex items-center justify-center group-hover:bg-[#0288D1]/20 transition-colors">
                <ShoppingCart className="w-5 h-5 text-[#0288D1]" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Total</p>
                <p className="text-xl font-bold text-[#01579B]">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by ID or pharmacy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0288D1] focus:border-[#0288D1] outline-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-[#0288D1]" />
                <span className="text-sm font-medium text-slate-600">Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gradient-to-b from-white to-slate-50/50 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-[#0288D1]/30 transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div 
                className="p-6"
                onClick={() => handleOrderClick(order)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0288D1]/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#0288D1]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            Order #{order.id}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-[#0288D1]" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button 
                        className="p-2 text-slate-400 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order);
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <MapPin className="w-4 h-4 text-[#0288D1]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Pharmacy</p>
                          <p className="text-sm text-slate-600">{order.pharmacy.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <Package className="w-4 h-4 text-[#0288D1]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Items</p>
                          <p className="text-sm text-slate-600">{order._count.orderItems} items</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <ShoppingCart className="w-12 h-12 text-[#0288D1] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No orders found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                You haven't placed any orders yet. Your pharmacy orders will appear here once you make a purchase.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrders;
