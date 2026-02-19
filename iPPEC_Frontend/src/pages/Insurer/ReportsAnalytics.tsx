import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Calendar,
  Filter,
  Building2,
  DollarSign,
  FileText,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

const ReportsAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [reportType, setReportType] = useState('overview');
  const [selectedPharmacy, setSelectedPharmacy] = useState('all');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalClaims: 1247,
      totalPayouts: 245680,
      averageClaimAmount: 197.25,
      approvalRate: 87.5,
      processingTime: 2.3,
      fraudDetected: 12
    },
    monthlyTrends: [
      { month: 'Jan', claims: 1089, payouts: 215430, approvalRate: 85.2 },
      { month: 'Feb', claims: 1156, payouts: 228950, approvalRate: 86.8 },
      { month: 'Mar', claims: 1247, payouts: 245680, approvalRate: 87.5 },
      { month: 'Apr', claims: 1334, payouts: 262340, approvalRate: 88.1 },
      { month: 'May', claims: 1423, payouts: 279850, approvalRate: 89.3 },
      { month: 'Jun', claims: 1512, payouts: 298760, approvalRate: 90.1 }
    ],
    pharmacyPerformance: [
      {
        id: 'PH001',
        name: 'HealthFirst Pharmacy',
        claims: 234,
        payouts: 45680,
        approvalRate: 92.3,
        avgProcessingTime: 1.8,
        riskScore: 'Low'
      },
      {
        id: 'PH002',
        name: 'MediCare Plus',
        claims: 189,
        payouts: 38950,
        approvalRate: 89.7,
        avgProcessingTime: 2.1,
        riskScore: 'Low'
      },
      {
        id: 'PH003',
        name: 'QuickMeds Pharmacy',
        claims: 156,
        payouts: 32450,
        approvalRate: 85.2,
        avgProcessingTime: 2.8,
        riskScore: 'Medium'
      },
      {
        id: 'PH004',
        name: 'Metro Pharmacy Network',
        claims: 98,
        payouts: 19870,
        approvalRate: 76.5,
        avgProcessingTime: 3.5,
        riskScore: 'High'
      }
    ],
    claimsByCategory: [
      { category: 'Cardiovascular', claims: 312, percentage: 25.0 },
      { category: 'Diabetes', claims: 287, percentage: 23.0 },
      { category: 'Respiratory', claims: 199, percentage: 16.0 },
      { category: 'Pain Management', claims: 174, percentage: 14.0 },
      { category: 'Mental Health', claims: 137, percentage: 11.0 },
      { category: 'Other', claims: 138, percentage: 11.0 }
    ],
    fraudAlerts: [
      {
        id: 'FA001',
        pharmacy: 'Metro Pharmacy Network',
        type: 'Duplicate Claims',
        severity: 'High',
        amount: 2340.50,
        date: '2024-01-25'
      },
      {
        id: 'FA002',
        pharmacy: 'QuickMeds Pharmacy',
        type: 'Unusual Volume',
        severity: 'Medium',
        amount: 1567.80,
        date: '2024-01-24'
      }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
            <p className="text-gray-600 mt-1">Comprehensive insights into claims and pharmacy performance</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalClaims.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payouts</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.overview.totalPayouts)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Claim Amount</p>
                <p className="text-2xl font-bold text-gray-900">${analyticsData.overview.averageClaimAmount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.approvalRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.processingTime}d</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fraud Detected</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.fraudDetected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
              <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                <option>Claims Volume</option>
                <option>Payout Amount</option>
                <option>Approval Rate</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.monthlyTrends.map((data, index) => {
                const height = (data.claims / Math.max(...analyticsData.monthlyTrends.map(d => d.claims))) * 100;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-blue-100 rounded-t relative" style={{ height: `${height * 2}px` }}>
                      <div 
                        className="w-full bg-blue-600 rounded-t absolute bottom-0" 
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Claims by Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Claims by Category</h3>
            <div className="space-y-4">
              {analyticsData.claimsByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-blue-${(index + 1) * 100}`}></div>
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full bg-blue-${(index + 1) * 100}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{category.claims}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pharmacy Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pharmacy Performance</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Detailed Report
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pharmacy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Claims
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Payouts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Processing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.pharmacyPerformance.map((pharmacy) => (
                  <tr key={pharmacy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-8 h-8 text-primary-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{pharmacy.name}</div>
                          <div className="text-sm text-gray-500">ID: {pharmacy.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pharmacy.claims}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(pharmacy.payouts)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pharmacy.approvalRate}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pharmacy.avgProcessingTime}d</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(pharmacy.riskScore)}`}>
                        {pharmacy.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fraud Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Fraud Alerts</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {analyticsData.fraudAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        alert.severity === 'High' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <AlertCircle className={`w-5 h-5 ${
                          alert.severity === 'High' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                      <p className="text-sm text-gray-500">{alert.pharmacy}</p>
                      <p className="text-xs text-gray-500">{new Date(alert.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(alert.amount)}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <button className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700">
                      Investigate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <Download className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Claims Summary</p>
                <p className="text-xs text-gray-500">Monthly claims report</p>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <Download className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Pharmacy Performance</p>
                <p className="text-xs text-gray-500">Detailed pharmacy analytics</p>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <Download className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Fraud Report</p>
                <p className="text-xs text-gray-500">Security and fraud analysis</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsAnalytics;