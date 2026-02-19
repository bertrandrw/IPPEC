import React from 'react';
import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Dashboard/StatsCard';
import { 
  FileText, 
  ShoppingCart, 
  CreditCard, 
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  BookOpen,
  MapPin,
  Bell
} from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const stats = {
    activePrescriptions: 3,
    pendingOrders: 2,
    insuranceClaims: 5,
    healthScore: 85
  };

  const recentPrescriptions = [
    {
      id: '1',
      doctor: 'Dr. John Smith',
      medication: 'Amoxicillin 500mg',
      date: '2024-01-25',
      status: 'active',
      refills: 2
    },
    {
      id: '2',
      doctor: 'Dr. Sarah Johnson',
      medication: 'Lisinopril 10mg',
      date: '2024-01-20',
      status: 'active',
      refills: 5
    }
  ];

  const recentArticles = [
    {
      id: '1',
      title: 'Understanding Hypertension: Prevention and Management',
      category: 'Cardiovascular Health',
      readTime: '5 min read',
      publishedDate: '2024-01-25'
    },
    {
      id: '2',
      title: 'The Importance of Regular Health Checkups',
      category: 'Preventive Care',
      readTime: '3 min read',
      publishedDate: '2024-01-24'
    }
  ];

  const upcomingReminders = [
    {
      id: '1',
      type: 'medication',
      message: 'Take Amoxicillin - 2 tablets',
      time: '2:00 PM'
    },
    {
      id: '2',
      type: 'appointment',
      message: 'Follow-up with Dr. Smith',
      time: 'Tomorrow 10:00 AM'
    }
  ];

  return (
    <Layout title="Patient Dashboard">
      <div className="min-h-screen bg-gradient-to-b from-[#E6F2FF] to-white space-y-4 lg:space-y-6 p-4 lg:p-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] rounded-2xl p-6 lg:p-8 text-white shadow-lg">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Welcome to Your Health Dashboard</h2>
          <p className="text-blue-100 text-sm lg:text-base">
            Stay on top of your health with digital prescriptions and personalized care
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatsCard
            title="Active Prescriptions"
            value={stats.activePrescriptions}
            icon={FileText}
            color="medical"
          />
          <StatsCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={ShoppingCart}
            color="warning"
          />
          <StatsCard
            title="Insurance Claims"
            value={stats.insuranceClaims}
            change="+2"
            changeType="positive"
            icon={CreditCard}
            color="success"
          />
          <StatsCard
            title="Health Score"
            value={`${stats.healthScore}%`}
            change="+5%"
            changeType="positive"
            icon={Heart}
            color="error"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Recent Prescriptions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-[#E6F2FF]">
              <div className="p-6 border-b border-[#E6F2FF]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Prescriptions</h3>
                  <button className="text-[#2196F3] hover:text-[#1976D2] text-sm font-medium transition-colors">
                    View All
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="p-6 hover:bg-[#F8FBFF] transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            <CheckCircle className="w-6 h-6 text-[#4CAF50]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-gray-900 truncate">{prescription.medication}</p>
                            <p className="text-sm text-[#2196F3] mt-1">Prescribed by {prescription.doctor}</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              <span className="text-xs bg-white px-2 py-1 rounded-full border border-[#E6F2FF]">
                                {new Date(prescription.date).toLocaleDateString()}
                              </span>
                              <span className="text-xs bg-white px-2 py-1 rounded-full border border-[#E6F2FF]">
                                {prescription.refills} refills remaining
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#4CAF50] bg-opacity-10 text-[#4CAF50]">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-4 lg:space-y-6">
            {/* Quick Actions */}
            <div className="bg-[#F8FBFF] rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 text-left bg-white border border-[#E6F2FF] rounded-xl hover:shadow-md hover:border-[#2196F3] transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-[#2196F3] flex-shrink-0" />
                    <span className="font-medium text-sm lg:text-base">Find Nearby Pharmacies</span>
                  </div>
                  <span className="text-[#2196F3] flex-shrink-0">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 text-left bg-white border border-[#E6F2FF] rounded-xl hover:shadow-md hover:border-[#2196F3] transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-5 h-5 text-[#2196F3] flex-shrink-0" />
                    <span className="font-medium text-sm lg:text-base">Order Medicines</span>
                  </div>
                  <span className="text-[#2196F3] flex-shrink-0">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 text-left bg-white border border-[#E6F2FF] rounded-xl hover:shadow-md hover:border-[#2196F3] transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-[#2196F3] flex-shrink-0" />
                    <span className="font-medium text-sm lg:text-base">Insurance Claims</span>
                  </div>
                  <span className="text-[#2196F3] flex-shrink-0">→</span>
                </button>
              </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E6F2FF] p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Today's Reminders</h3>
              <div className="space-y-4">
                {upcomingReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-start space-x-3 p-3 bg-[#F8FBFF] rounded-xl">
                    <div className="w-2 h-2 bg-[#2196F3] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{reminder.message}</p>
                      <p className="text-xs text-[#2196F3]">{reminder.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Health Articles */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E6F2FF]">
          <div className="p-6 border-b border-[#E6F2FF]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Latest Health Articles</h3>
              <button className="text-[#2196F3] hover:text-[#1976D2] text-sm font-medium transition-colors">
                View All Articles
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {recentArticles.map((article) => (
              <div key={article.id} className="bg-[#F8FBFF] rounded-xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer border border-[#E6F2FF] hover:border-[#2196F3]">
                <div className="flex items-start space-x-4">
                  <BookOpen className="w-6 h-6 text-[#2196F3] mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-3 text-base lg:text-lg">{article.title}</h4>
                    <div className="flex flex-wrap gap-3 text-xs text-[#2196F3]">
                      <span className="bg-white px-2 py-1 rounded-full">{article.category}</span>
                      <span className="bg-white px-2 py-1 rounded-full">{article.readTime}</span>
                      <span className="bg-white px-2 py-1 rounded-full">{new Date(article.publishedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;