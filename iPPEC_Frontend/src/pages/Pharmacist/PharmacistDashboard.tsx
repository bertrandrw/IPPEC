import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  ShoppingCart, 
  Package, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Users,
  Star,
  Shield,
  Activity,
  Award,
  Zap,
  Eye
} from 'lucide-react';

const PharmacistDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  
  const [timeOfDay] = useState<'morning' | 'afternoon' | 'evening'>(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  });

  // Get the actual pharmacist's name from the authenticated user
  const pharmacistName = user?.name || 'Pharmacist';

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <Layout title="Pharmacy Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#397dc0]"></div>
        </div>
      </Layout>
    );
  }

  const stats = {
    newPrescriptions: 24,
    activeOrders: 16,
    lowStockItems: 3,
    insuranceClaims: 8,
    privateOrders: 12,
    totalPatients: 156,
    avgRating: 4.8
  };

  const recentActivities = [
    {
      id: '1',
      type: 'prescription',
      patient: 'Uwimana Marie',
      action: 'New prescription processed',
      medication: 'Amoxicillin 500mg',
      time: '2 minutes ago',
      urgent: false,
      amount: 15000
    },
    {
      id: '2',
      type: 'private_order',
      patient: 'Anonymous Patient',
      action: 'Private order completed',
      medication: 'Emergency contraception',
      time: '12 minutes ago',
      urgent: false,
      amount: 8500,
      discrete: true
    },
    {
      id: '3',
      type: 'insurance',
      patient: 'Mukamana Grace',
      action: 'Insurance claim approved',
      medication: 'Insulin Glargine',
      time: '25 minutes ago',
      urgent: true,
      amount: 45000
    },
    {
      id: '4',
      type: 'stock',
      patient: null,
      action: 'Stock level critical',
      medication: 'Paracetamol 500mg',
      time: '1 hour ago',
      urgent: true,
      amount: null
    }
  ];

  const topSellingMedicines = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      sales: 145,
      revenue: 435000, // RWF
      trend: '+12%',
      stock: 89
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      sales: 98,
      revenue: 588000,
      trend: '+8%',
      stock: 124
    },
    {
      id: '3',
      name: 'Omeprazole 20mg',
      category: 'Digestive',
      sales: 76,
      revenue: 456000,
      trend: '+15%',
      stock: 67
    },
    {
      id: '4',
      name: 'Emergency Contraception',
      category: 'Private Care',
      sales: 34,
      revenue: 289000,
      trend: '+22%',
      stock: 45,
      discrete: true
    }
  ];

  const getGreeting = () => {
    const greetings: Record<typeof timeOfDay, string> = {
      morning: 'Good Morning',
      afternoon: 'Good Afternoon', 
      evening: 'Good Evening'
    };
    return greetings[timeOfDay];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Layout title="Pharmacy Dashboard">
      <div className="space-y-8">
        {/* Enhanced Welcome Section */}
        <div className="bg-gradient-to-r from-[#397dc0] to-blue-700 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {pharmacistName}!</h1>
              <p className="text-blue-100 text-lg">
                Managing your pharmacy with excellence • Today: {new Date().toLocaleDateString('en-RW')}
              </p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">{stats.avgRating}/5.0 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{stats.totalPatients} Active Patients</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Prescriptions</p>
                <p className="text-3xl font-bold text-[#397dc0] mt-2">{stats.newPrescriptions}</p>
                <p className="text-sm text-green-600 font-medium mt-1">↗ +12% from yesterday</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#397dc0]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.activeOrders}</p>
                <p className="text-sm text-orange-600 font-medium mt-1">Processing now</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Private Orders</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.privateOrders}</p>
                <p className="text-sm text-purple-600 font-medium mt-1">Discrete handling</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Alerts</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.lowStockItems}</p>
                <p className="text-sm text-red-600 font-medium mt-1">Need attention</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Recent Activities</h3>
                  <button className="text-[#397dc0] hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>View All</span>
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'prescription' ? 'bg-blue-100' :
                            activity.type === 'private_order' ? 'bg-purple-100' :
                            activity.type === 'insurance' ? 'bg-green-100' :
                            'bg-red-100'
                          }`}>
                            {activity.type === 'prescription' && <FileText className="w-5 h-5 text-blue-600" />}
                            {activity.type === 'private_order' && <Shield className="w-5 h-5 text-purple-600" />}
                            {activity.type === 'insurance' && <CreditCard className="w-5 h-5 text-green-600" />}
                            {activity.type === 'stock' && <Package className="w-5 h-5 text-red-600" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            {activity.patient && (
                              <p className="text-sm text-gray-600">
                                {activity.discrete ? '🔒 ' : ''}{activity.patient}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">{activity.medication}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.amount && (
                          <p className="font-semibold text-gray-900">{formatCurrency(activity.amount)}</p>
                        )}
                        {activity.urgent && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Top Selling Medicines */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling This Month</h3>
              <div className="space-y-4">
                {topSellingMedicines.map((medicine, index) => (
                  <div key={medicine.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {medicine.discrete && <Shield className="w-3 h-3 inline mr-1" />}
                          {medicine.name}
                        </p>
                        <p className="text-xs text-gray-500">{medicine.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(medicine.revenue)}</p>
                      <p className="text-xs text-green-600">{medicine.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Processing Speed</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">Excellent</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Customer Rating</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{stats.avgRating}/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-700">Response Time</span>
                  </div>
                  <span className="text-sm font-semibold text-orange-600">2.3 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Completion Rate</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600">98.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PharmacistDashboard;