import React, { useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  ShoppingCart,
  CreditCard,
  Calendar,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Activity,
  Globe,
  Clock,
  DollarSign,
  Building2,
  Stethoscope,
  Pill,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminSystemAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock analytics data with more realistic structure
  const analyticsData = {
    overview: {
      totalUsers: 2847,
      totalDoctors: 156,
      totalPatients: 2234,
      totalPharmacists: 89,
      totalPharmacies: 145,
      totalArticles: 234,
      publishedArticles: 198,
      pendingArticles: 12,
      systemUptime: 99.8,
      growthRates: {
        users: 12.5,
        doctors: 8.3,
        patients: 15.7,
        pharmacies: 22.1
      }
    },
    userMetrics: {
      newUsersDaily: [
        { date: '2024-01-20', count: 45 },
        { date: '2024-01-21', count: 52 },
        { date: '2024-01-22', count: 38 },
        { date: '2024-01-23', count: 67 },
        { date: '2024-01-24', count: 71 },
        { date: '2024-01-25', count: 59 },
        { date: '2024-01-26', count: 83 }
      ],
      usersByRole: {
        patients: 2234,
        doctors: 156,
        pharmacists: 89,
        insurers: 12,
        admins: 8
      },
      activeUsers: 1847,
      retentionRate: 78.5
    },
    contentMetrics: {
      articlesPublished: [
        { month: 'Jan', count: 23 },
        { month: 'Feb', count: 31 },
        { month: 'Mar', count: 28 },
        { month: 'Apr', count: 35 },
        { month: 'May', count: 42 },
        { month: 'Jun', count: 39 }
      ],
      topCategories: [
        { name: 'Cardiovascular Health', count: 45 },
        { name: 'Mental Health', count: 38 },
        { name: 'Preventive Care', count: 32 },
        { name: 'Diabetes Care', count: 28 },
        { name: 'Fitness & Exercise', count: 25 }
      ],
      averageReadTime: 4.2
    },
    pharmacyMetrics: {
      registrationTrend: [
        { month: 'Jan', count: 12 },
        { month: 'Feb', count: 18 },
        { month: 'Mar', count: 15 },
        { month: 'Apr', count: 22 },
        { month: 'May', count: 28 },
        { month: 'Jun', count: 25 }
      ],
      verificationStatus: {
        verified: 132,
        pending: 13,
        rejected: 8
      },
      averageRating: 4.6
    },
    systemHealth: {
      uptime: 99.8,
      responseTime: 245,
      errorRate: 0.12,
      activeConnections: 1247,
      serverLoad: 68,
      memoryUsage: 72
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const ChangeIndicator: React.FC<{ value: number }> = ({ value }) => (
    <div className={`flex items-center ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
      <span className="text-sm font-medium">{Math.abs(value)}%</span>
    </div>
  );

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <AdminLayout title="System Analytics & Reports">
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
            <p className="text-gray-600 mt-1">Monitor platform performance and user engagement</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button 
              onClick={refreshData}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg text-sm font-medium hover:bg-medical-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.overview.totalUsers)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">vs last period</span>
              <ChangeIndicator value={analyticsData.overview.growthRates.users} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.overview.totalDoctors)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">vs last period</span>
              <ChangeIndicator value={analyticsData.overview.growthRates.doctors} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Partner Pharmacies</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.overview.totalPharmacies)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">vs last period</span>
              <ChangeIndicator value={analyticsData.overview.growthRates.pharmacies} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published Articles</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.overview.publishedArticles)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">{analyticsData.overview.pendingArticles} pending review</span>
              <span className="text-sm text-orange-600 font-medium">+{analyticsData.overview.pendingArticles}</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Registration Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Registration Trend</h3>
              <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.userMetrics.newUsersDaily.map((data, index) => {
                const height = (data.count / Math.max(...analyticsData.userMetrics.newUsersDaily.map(d => d.count))) * 100;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-blue-100 rounded-t relative" style={{ height: `${height * 2}px` }}>
                      <div 
                        className="w-full bg-blue-600 rounded-t absolute bottom-0 transition-all duration-500" 
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">
                      {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Content Performance</h3>
              <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                <option>Articles</option>
                <option>Categories</option>
                <option>Authors</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.contentMetrics.articlesPublished.map((data, index) => {
                const height = (data.count / Math.max(...analyticsData.contentMetrics.articlesPublished.map(d => d.count))) * 100;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-green-100 rounded-t relative" style={{ height: `${height * 2}px` }}>
                      <div 
                        className="w-full bg-green-600 rounded-t absolute bottom-0 transition-all duration-500" 
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.userMetrics.usersByRole).map(([role, count]) => {
                const percentage = (count / analyticsData.overview.totalUsers) * 100;
                const colors = {
                  patients: 'bg-blue-500',
                  doctors: 'bg-green-500',
                  pharmacists: 'bg-purple-500',
                  insurers: 'bg-orange-500',
                  admins: 'bg-red-500'
                };
                return (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[role as keyof typeof colors]}`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{role}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full ${colors[role as keyof typeof colors]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatNumber(count)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Content Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Content Categories</h3>
            <div className="space-y-3">
              {analyticsData.contentMetrics.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-medical-100 rounded-full flex items-center justify-center">
                      <span className="text-medical-600 font-semibold text-xs">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{category.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Uptime</span>
                </div>
                <span className="text-sm font-semibold text-green-600">{analyticsData.systemHealth.uptime}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Response Time</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{analyticsData.systemHealth.responseTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">Error Rate</span>
                </div>
                <span className="text-sm font-semibold text-red-600">{analyticsData.systemHealth.errorRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Active Sessions</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(analyticsData.systemHealth.activeConnections)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Server Load</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{analyticsData.systemHealth.serverLoad}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pharmacy Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pharmacy Network Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{analyticsData.pharmacyMetrics.verificationStatus.verified}</p>
              <p className="text-sm text-gray-500">Verified Pharmacies</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{analyticsData.pharmacyMetrics.verificationStatus.pending}</p>
              <p className="text-sm text-gray-500">Pending Verification</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{analyticsData.pharmacyMetrics.verificationStatus.rejected}</p>
              <p className="text-sm text-gray-500">Rejected Applications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{analyticsData.pharmacyMetrics.averageRating}</p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Platform Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">User Registrations</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">+{analyticsData.userMetrics.newUsersDaily[analyticsData.userMetrics.newUsersDaily.length - 1].count}</p>
              <p className="text-sm text-blue-700">New users today</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Content Activity</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{analyticsData.overview.pendingArticles}</p>
              <p className="text-sm text-green-700">Articles pending review</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">Pharmacy Network</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{analyticsData.pharmacyMetrics.verificationStatus.pending}</p>
              <p className="text-sm text-purple-700">Pending verifications</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSystemAnalytics;