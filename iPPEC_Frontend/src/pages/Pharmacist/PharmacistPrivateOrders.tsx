import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  Shield, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  User,
  Phone,
  X,
  Save,
  Filter,
  Download
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../components/common/ToastContainer';

interface PrivateMedicine {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  inStock: boolean;
  quantity: number;
  discretePackaging: boolean;
  requiresAgeVerification: boolean;
  rating: number;
  reviewCount: number;
  badges: string[];
  isPopular: boolean;
  isFastDelivery: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface PrivateOrder {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  items: OrderItem[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    discreteDelivery: boolean;
  };
  paymentMethod: {
    type: 'mobile' | 'card';
    provider: string;
  };
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'private';
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const PharmacistPrivateOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'medicines' | 'orders'>('medicines');
  const [medicines, setMedicines] = useState<PrivateMedicine[]>([]);
  const [orders, setOrders] = useState<PrivateOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');
  const { showToast } = useToast();

  const [newMedicine, setNewMedicine] = useState<Partial<PrivateMedicine>>({
    name: '',
    category: 'contraceptives',
    description: '',
    price: 0,
    quantity: 0,
    discretePackaging: true,
    requiresAgeVerification: false,
    isFastDelivery: false,
    badges: []
  });

  const categories = [
    'all',
    'contraceptives',
    'emergency-contraception',
    'sexual-health',
    'personal-care',
    'pregnancy-tests',
    'fertility',
    'other'
  ];

  const categoryLabels: Record<string, string> = {
    'all': 'All Products',
    'contraceptives': 'Protection',
    'emergency-contraception': 'Emergency Care',
    'sexual-health': 'Wellness Products',
    'personal-care': 'Personal Care',
    'pregnancy-tests': 'Testing Kits',
    'fertility': 'Family Planning',
    'other': 'Other Products'
  };

  const orderStatuses = ['all', 'pending', 'confirmed', 'processing', 'ready', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockMedicines: PrivateMedicine[] = [
        {
          id: '1',
          name: 'Protection Pack - Premium',
          category: 'contraceptives',
          description: 'High-quality protection with ultra-thin design',
          price: 8500,
          inStock: true,
          quantity: 45,
          discretePackaging: true,
          requiresAgeVerification: true,
          rating: 4.8,
          reviewCount: 127,
          badges: ['Best Seller', 'Fast Delivery'],
          isPopular: true,
          isFastDelivery: true,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20'
        },
        {
          id: '2',
          name: 'Emergency Care Tablet',
          category: 'emergency-contraception',
          description: 'Emergency contraceptive pill - effective within 72 hours',
          price: 12000,
          inStock: true,
          quantity: 23,
          discretePackaging: true,
          requiresAgeVerification: true,
          rating: 4.6,
          reviewCount: 89,
          badges: ['Doctor Recommended', 'Urgent Care'],
          isPopular: false,
          isFastDelivery: true,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-18'
        }
      ];

      const mockOrders: PrivateOrder[] = [
        {
          id: 'ord1',
          patientId: 'pat1',
          patientName: 'Anonymous Patient',
          patientPhone: '+250 788 ***456',
          items: [
            {
              id: 'item1',
              medicineId: '1',
              medicineName: 'Protection Pack - Premium',
              quantity: 2,
              unitPrice: 8500,
              totalPrice: 17000
            }
          ],
          deliveryAddress: {
            fullName: 'John Doe',
            phone: '+250 788 123456',
            address: 'Kigali, Rwanda',
            city: 'Kigali',
            discreteDelivery: true
          },
          paymentMethod: {
            type: 'mobile',
            provider: 'mtn'
          },
          total: 17000,
          status: 'pending',
          orderType: 'private',
          createdAt: '2024-01-25T10:30:00Z',
          updatedAt: '2024-01-25T10:30:00Z'
        }
      ];

      setMedicines(mockMedicines);
      setOrders(mockOrders);
    } catch (error) {
      showToast('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async () => {
    if (!newMedicine.name || !newMedicine.description || !newMedicine.price) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    try {
      const medicine: PrivateMedicine = {
        id: Date.now().toString(),
        name: newMedicine.name!,
        category: newMedicine.category!,
        description: newMedicine.description!,
        price: newMedicine.price!,
        inStock: newMedicine.quantity! > 0,
        quantity: newMedicine.quantity!,
        discretePackaging: newMedicine.discretePackaging!,
        requiresAgeVerification: newMedicine.requiresAgeVerification!,
        rating: 0,
        reviewCount: 0,
        badges: newMedicine.badges!,
        isPopular: false,
        isFastDelivery: newMedicine.isFastDelivery!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setMedicines(prev => [...prev, medicine]);
      setShowAddMedicine(false);
      setNewMedicine({
        name: '',
        category: 'contraceptives',
        description: '',
        price: 0,
        quantity: 0,
        discretePackaging: true,
        requiresAgeVerification: false,
        isFastDelivery: false,
        badges: []
      });
      showToast('success', 'Medicine added successfully');
    } catch (error) {
      showToast('error', 'Failed to add medicine');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
            : order
        )
      );
      showToast('success', `Order status updated to ${newStatus}`);
    } catch (error) {
      showToast('error', 'Failed to update order status');
    }
  };

  const handleDeleteMedicine = async (medicineId: string) => {
    try {
      setMedicines(prev => prev.filter(med => med.id !== medicineId));
      showToast('success', 'Medicine deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete medicine');
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(order => {
    return orderFilter === 'all' || order.status === orderFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout title="Private Orders Management">
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Private Orders Management">
      <div className="min-h-screen bg-gradient-to-b from-[#E6F2FF] to-white p-4 lg:p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#397dc0] to-[#2c5f99] rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-2xl lg:text-3xl font-bold">Private Orders Management</h1>
          </div>
          <p className="text-blue-100 text-sm lg:text-base">
            Manage your private medicine inventory and process discrete orders with complete confidentiality
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-1">
          <div className="flex">
            <button
              onClick={() => setActiveTab('medicines')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'medicines'
                  ? 'bg-[#397dc0] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Package className="h-5 w-5 inline mr-2" />
              Manage Medicines ({medicines.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-[#397dc0] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock className="h-5 w-5 inline mr-2" />
              View Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Medicines Tab */}
        {activeTab === 'medicines' && (
          <>
            {/* Search and Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0] transition-all"
                    />
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0] bg-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {categoryLabels[category]}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowAddMedicine(true)}
                    className="flex items-center gap-2 bg-[#397dc0] text-white px-6 py-3 rounded-lg hover:bg-[#2c5f99] transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="h-5 w-5" />
                    Add Medicine
                  </button>
                </div>

                {/* Category Filter Chips */}
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-[#397dc0] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {categoryLabels[category]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Medicines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map(medicine => (
                <div key={medicine.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Medicine Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <Package className="h-16 w-16 text-blue-300" />
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {medicine.badges.map(badge => (
                        <span key={badge} className={`px-2 py-1 rounded-full text-xs font-bold ${
                          badge === 'Best Seller' ? 'bg-yellow-400 text-yellow-900' :
                          badge === 'Fast Delivery' ? 'bg-green-400 text-green-900' :
                          badge === 'Doctor Recommended' ? 'bg-blue-400 text-blue-900' :
                          'bg-gray-400 text-gray-900'
                        }`}>
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Stock Status */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                      medicine.inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {medicine.inStock ? `${medicine.quantity} in stock` : 'Out of Stock'}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Medicine Title and Rating */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        {medicine.name}
                      </h3>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{medicine.rating}</span>
                        <span className="text-xs text-gray-500">({medicine.reviewCount})</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {medicine.description}
                    </p>
                    
                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        {medicine.price.toLocaleString()} RWF
                      </span>
                      <div className="text-sm text-gray-500">
                        Category: {categoryLabels[medicine.category]}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {medicine.discretePackaging && (
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Discreet
                        </div>
                      )}
                      {medicine.isFastDelivery && (
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Fast Delivery
                        </div>
                      )}
                      {medicine.requiresAgeVerification && (
                        <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          18+ Only
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => showToast('info', 'Edit functionality coming soon!')}
                        className="flex-1 bg-[#397dc0] text-white py-2 px-4 rounded-lg hover:bg-[#2c5f99] transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMedicine(medicine.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMedicines.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No medicines found</h3>
                <p className="text-gray-600">Try adjusting your search or add a new medicine</p>
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {/* Order Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0] bg-white"
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Orders' : `${status.charAt(0).toUpperCase() + status.slice(1)} Orders`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{filteredOrders.length} orders</span>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        {order.total.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                    {/* Customer Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{order.deliveryAddress.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{order.deliveryAddress.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{order.deliveryAddress.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Items Ordered</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.medicineName} x{item.quantity}</span>
                            <span>{item.totalPrice.toLocaleString()} RWF</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment & Delivery */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment & Delivery</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>Payment: {order.paymentMethod.provider.toUpperCase()}</div>
                        <div>Discrete: {order.deliveryAddress.discreteDelivery ? 'Yes' : 'No'}</div>
                        <div>Type: Private Order</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => showToast('info', 'Detailed view coming soon!')}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Confirm
                      </button>
                    )}
                    
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Clock className="h-4 w-4" />
                        Start Processing
                      </button>
                    )}
                    
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        Mark Ready
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">No orders match your current filter</p>
              </div>
            )}
          </>
        )}

        {/* Add Medicine Modal */}
        {showAddMedicine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Add New Private Medicine</h2>
                  <button
                    onClick={() => setShowAddMedicine(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                      placeholder="Enter medicine name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={newMedicine.category}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>
                          {categoryLabels[category]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newMedicine.description}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                    rows={3}
                    placeholder="Enter medicine description"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (RWF) *
                    </label>
                    <input
                      type="number"
                      value={newMedicine.price}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity in Stock *
                    </label>
                    <input
                      type="number"
                      value={newMedicine.quantity}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397dc0] focus:border-[#397dc0]"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="discretePackaging"
                      checked={newMedicine.discretePackaging}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, discretePackaging: e.target.checked }))}
                      className="h-4 w-4 text-[#397dc0] border-gray-300 rounded focus:ring-[#397dc0]"
                    />
                    <label htmlFor="discretePackaging" className="text-sm text-gray-700">
                      Discrete packaging available
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ageVerification"
                      checked={newMedicine.requiresAgeVerification}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, requiresAgeVerification: e.target.checked }))}
                      className="h-4 w-4 text-[#397dc0] border-gray-300 rounded focus:ring-[#397dc0]"
                    />
                    <label htmlFor="ageVerification" className="text-sm text-gray-700">
                      Requires age verification (18+)
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="fastDelivery"
                      checked={newMedicine.isFastDelivery}
                      onChange={(e) => setNewMedicine(prev => ({ ...prev, isFastDelivery: e.target.checked }))}
                      className="h-4 w-4 text-[#397dc0] border-gray-300 rounded focus:ring-[#397dc0]"
                    />
                    <label htmlFor="fastDelivery" className="text-sm text-gray-700">
                      Fast delivery available
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddMedicine(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMedicine}
                    className="flex-1 bg-[#397dc0] text-white py-3 rounded-lg hover:bg-[#2c5f99] transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Add Medicine
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PharmacistPrivateOrders;