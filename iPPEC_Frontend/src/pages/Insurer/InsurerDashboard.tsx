import React from 'react';
import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Dashboard/StatsCard';
import { 
  Building2, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Activity,
  BarChart3,
  CreditCard
} from 'lucide-react';

const InsurerDashboard: React.FC = () => {
  const stats = {
    totalPharmacies: 156,
    pendingClaims: 23,
    monthlyPayouts: 245680,
    claimsProcessed: 1247
  };

  const recentClaims = [
    {
      id: 'CLM001',
      pharmacy: 'HealthFirst Pharmacy',
      patient: 'John Smith',
      amount: 125.50,
      status: 'pending',
      submittedDate: '2024-01-25',
      priority: 'medium'
    },
    {
      id: 'CLM002',
      pharmacy: 'MediCare Plus',
      patient: 'Sarah Johnson',
      amount: 89.75,
      status: 'approved',
      submittedDate: '2024-01-24',
      priority: 'high'
    },
    {
      id: 'CLM003',
      pharmacy: 'QuickMeds Pharmacy',
      patient: 'Mike Wilson',
      amount: 234.20,
      status: 'under_review',
      submittedDate: '2024-01-23',
      priority: 'high'
    }
  ];

  const topPharmacies = [
    {
      id: '1',
      name: 'HealthFirst Pharmacy',
      location: 'Downtown',
      claims: 45,
      amount: 12450.00,
      rating: 4.8
    },
    {
      id: '2',
      name: 'MediCare Plus',
      location: 'Midtown',
      claims: 38,
      amount: 9875.50,
      rating: 4.6
    },
    {
      id: '3',
      name: 'QuickMeds Pharmacy',
      location: 'Uptown',
      claims: 32,
      amount: 8234.75,
      rating: 4.4
    }
  ];

  const alerts = [
    {
      id: '1',
      type: 'high_volume',
      message: 'Unusual claim volume detected at HealthFirst Pharmacy',
      time: '2 hours ago',
      severity: 'warning'
    },
    {
      id: '2',
      type: 'fraud_alert',
      message: 'Potential duplicate claim flagged for review',
      time: '4 hours ago',
      severity: 'high'
    },
    {
      id: '3',
      type: 'payment_due',
      message: '15 approved claims pending payment processing',
      time: '6 hours ago',
      severity: 'medium'
    }
  ];

  const monthlyMetrics = [
    { month: 'Jan', claims: 1247, amount: 245680 },
    { month: 'Feb', claims: 1356, amount: 267890 },
    { month: 'Mar', claims: 1189, amount: 234560 },
    { month: 'Apr', claims: 1423, amount: 289340 },
    { month: 'May', claims: 1567, amount: 312450 },
    { month: 'Jun', claims: 1634, amount: 325670 }
  ];

  return (
    <Layout title="Insurance Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-success-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Insurance Claims Management</h2>
          <p className="text-primary-100">
            Monitor pharmacy partnerships and process insurance claims efficiently
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Partner Pharmacies"
            value={stats.totalPharmacies}
            change="+12"
            changeType="positive"
            icon={Building2}
            color="primary"
          />
          <StatsCard
            title="Pending Claims"
            value={stats.pendingClaims}
            icon={Clock}
            color="warning"
          />
          <StatsCard
            title="Monthly Payouts"
            value={`$${(stats.monthlyPayouts / 1000).toFixed(0)}K`}
            change="+8.5%"
            changeType="positive"
            icon={DollarSign}
            color="success"
          />
          <StatsCard
            title="Claims Processed"
            value={stats.claimsProcessed}
            change="+156"
            changeType="positive"
            icon={FileText}
            color="medical"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Claims */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All Claims
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentClaims.map((claim) => (
                  <div key={claim.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            claim.status === 'pending' ? 'bg-yellow-100' :
                            claim.status === 'approved' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {claim.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
                            {claim.status === 'approved' && <CheckCircle className="w-5 h-5 text-green-600" />}
                            {claim.status === 'under_review' && <Activity className="w-5 h-5 text-blue-600" />}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Claim #{claim.id}</p>
                          <p className="text-sm text-gray-500">{claim.pharmacy} • {claim.patient}</p>
                          <p className="text-xs text-gray-500">{new Date(claim.submittedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${claim.amount}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            claim.priority === 'high' ? 'bg-red-100 text-red-800' :
                            claim.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {claim.priority}
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {claim.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">Process Claims</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-success-600" />
                    <span className="font-medium">Manage Pharmacies</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-medical-600" />
                    <span className="font-medium">View Reports</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`border-l-4 pl-4 ${
                    alert.severity === 'high' ? 'border-red-400' :
                    alert.severity === 'warning' ? 'border-yellow-400' : 'border-blue-400'
                  }`}>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Pharmacies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Partner Pharmacies</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All Pharmacies
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
                    Claims This Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPharmacies.map((pharmacy) => (
                  <tr key={pharmacy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-8 h-8 text-primary-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{pharmacy.name}</div>
                          <div className="text-sm text-gray-500">{pharmacy.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pharmacy.claims}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${pharmacy.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{pharmacy.rating}</span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Claims Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Claims Volume Chart */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Claims Volume</h4>
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyMetrics.map((data, index) => {
                  const height = (data.claims / Math.max(...monthlyMetrics.map(d => d.claims))) * 100;
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

            {/* Payout Amount Chart */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Payout Amount</h4>
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyMetrics.map((data, index) => {
                  const height = (data.amount / Math.max(...monthlyMetrics.map(d => d.amount))) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full bg-green-100 rounded-t relative" style={{ height: `${height * 2}px` }}>
                        <div 
                          className="w-full bg-green-600 rounded-t absolute bottom-0" 
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
        </div>
      </div>
    </Layout>
  );
};

export default InsurerDashboard;