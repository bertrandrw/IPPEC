import React from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import StatsCard from '../../components/Dashboard/StatsCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Building2, 
  BarChart3,
  TrendingUp,
  Shield,
  Activity,
  BookOpen,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = {
    totalUsers: 2847,
    newUsersToday: 23,
    totalDoctors: 156,
    totalPatients: 2234,
    totalPharmacists: 89,
    totalInsurers: 12,
    totalPharmacies: 145,
    totalArticles: 234,
    publishedArticles: 198,
    pendingArticles: 12,
    systemUptime: 99.9
  };

  const recentActivity = [
    {
      id: '1',
      type: 'user_registration',
      message: 'New doctor registered: Dr. Emily Johnson',
      time: '2 hours ago',
      status: 'pending',
      icon: UserCheck,
      color: 'text-blue-600'
    },
    {
      id: '2',
      type: 'pharmacy_verification',
      message: 'Pharmacy verification completed: MediCare Plus',
      time: '4 hours ago',
      status: 'completed',
      icon: Building2,
      color: 'text-green-600'
    },
    {
      id: '3',
      type: 'article_submission',
      message: 'New article submitted for review',
      time: '6 hours ago',
      status: 'pending',
      icon: BookOpen,
      color: 'text-orange-600'
    },
    {
      id: '4',
      type: 'system_alert',
      message: 'High user registration volume detected',
      time: '8 hours ago',
      status: 'info',
      icon: AlertCircle,
      color: 'text-yellow-600'
    }
  ];

  const quickActions = [
    {
      title: 'Register New User',
      description: 'Add doctors, patients, or staff',
      icon: UserCheck,
      color: 'bg-blue-500',
      action: '/admin/users/new'
    },
    {
      title: 'Approve Registrations',
      description: 'Review pending applications',
      icon: CheckCircle,
      color: 'bg-green-500',
      action: '/admin/approvals'
    },
    {
      title: 'Publish Article',
      description: 'Create health content',
      icon: BookOpen,
      color: 'bg-purple-500',
      action: '/admin/articles/new'
    },
    {
      title: 'Add Pharmacy',
      description: 'Register new pharmacy',
      icon: Building2,
      color: 'bg-orange-500',
      action: '/admin/pharmacies/new'
    }
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-[#0288D1] to-[#01579B] rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back, {user?.name}</h2>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date().toLocaleString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <span className="hidden md:inline">•</span>
                <div className="hidden md:flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">System Status: Healthy</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white"
                onClick={() => window.location.href = '/admin/register'}
              >
                <UserCheck className="w-4 h-4" />
                New User
              </Button>
              <Button 
                variant="secondary"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white"
                onClick={() => window.location.href = '/admin/articles/new'}
              >
                <BookOpen className="w-4 h-4" />
                New Article
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change={`+${stats.newUsersToday} today`}
            changeType="positive"
            icon={Users}
            color="primary"
            className="hover:shadow-md transition-shadow duration-200"
          />
          <StatsCard
            title="Healthcare Providers"
            value={(stats.totalDoctors + stats.totalPharmacists).toString()}
            change={`${stats.totalPharmacies} active facilities`}
            changeType="positive"
            icon={UserCheck}
            color="success"
            className="hover:shadow-md transition-shadow duration-200"
          />
          <StatsCard
            title="Published Articles"
            value={stats.publishedArticles.toString()}
            change={`${stats.pendingArticles} pending review`}
            changeType="positive"
            icon={BookOpen}
            color="warning"
            className="hover:shadow-md transition-shadow duration-200"
          />
          <StatsCard
            title="Platform Health"
            value={`${stats.systemUptime}%`}
            change="All systems operational"
            changeType="positive"
            icon={Activity}
            color="primary"
            className="hover:shadow-md transition-shadow duration-200"
          />
        </div>

        {/* User Categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 hover:shadow-md transition-all duration-200 hover:border-[#0288D1] group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <UserCheck className="w-5 h-5 text-[#0288D1]" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Doctors</h3>
                <p className="text-xs text-slate-500 mt-0.5">Medical Professionals</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-slate-900">{stats.totalDoctors}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>12% growth</span>
                </div>
                <span className="text-xs text-slate-500">this month</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-all duration-200 hover:border-[#0288D1] group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Patients</h3>
                <p className="text-xs text-slate-500 mt-0.5">Registered Users</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-slate-900">{stats.totalPatients}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>8% growth</span>
                </div>
                <span className="text-xs text-slate-500">this month</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-all duration-200 hover:border-[#0288D1] group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Pharmacists</h3>
                <p className="text-xs text-slate-500 mt-0.5">Licensed Professionals</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-slate-900">{stats.totalPharmacists}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>5% growth</span>
                </div>
                <span className="text-xs text-slate-500">this month</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-all duration-200 hover:border-[#0288D1] group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Insurers</h3>
                <p className="text-xs text-slate-500 mt-0.5">Partner Companies</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-slate-900">{stats.totalInsurers}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>3% growth</span>
                </div>
                <span className="text-xs text-slate-500">this month</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Latest updates and notifications</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#0288D1] hover:text-[#01579B] hover:bg-[#E1F5FE]">
                    View All
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-slate-50 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 p-2.5 rounded-xl ${
                        activity.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        activity.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-[#0288D1]'
                      }`}>
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs text-slate-500">
                              {activity.time}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            activity.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                            activity.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                            'bg-blue-50 text-[#0288D1]'
                          }`}>
                            {activity.status === 'completed' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : activity.status === 'pending' ? (
                              <Clock className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="overflow-hidden border-[#0288D1]/10">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                <p className="text-sm text-slate-500 mt-0.5">Frequently used actions</p>
              </div>
              <div className="p-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left p-3 rounded-lg hover:bg-[#E1F5FE] group"
                    onClick={() => window.location.href = action.action}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${action.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                        <action.icon className={`w-5 h-5 ${action.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{action.title}</div>
                        <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              <div className="p-3 bg-[#E1F5FE]/30 border-t border-[#0288D1]/10">
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-[#0288D1] hover:text-[#01579B] hover:bg-[#E1F5FE]"
                  onClick={() => window.location.href = '/admin/settings'}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Actions
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* System Health */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.systemUptime}%</p>
              <p className="text-sm text-gray-500 mt-1">System Uptime</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">Operational</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-gray-500 mt-1">Active Sessions</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-xs text-blue-600">Normal Load</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">245ms</p>
              <p className="text-sm text-gray-500 mt-1">Response Time</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-xs text-purple-600">Excellent</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">99.8%</p>
              <p className="text-sm text-gray-500 mt-1">Security Score</p>
              <div className="flex items-center mt-2">
                <Shield className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-xs text-orange-600">Protected</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;