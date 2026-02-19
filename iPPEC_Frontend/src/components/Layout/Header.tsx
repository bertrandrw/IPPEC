import React from 'react';
import { User, Settings, LogOut, Bell, Search, MessageSquare, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'pharmacist': return 'bg-green-100 text-green-800';
      case 'patient': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between max-w-[1920px] mx-auto">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] transition-all duration-200 -ml-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold bg-gradient-to-r from-[#0288D1] to-[#01579B] bg-clip-text text-transparent truncate">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              Welcome back, <span className="text-[#0288D1] hidden xs:inline">{user?.name}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Search Bar - Responsive */}
          <div className="items-center space-x-2 hidden sm:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0288D1] focus:ring-offset-1 focus:border-[#0288D1] outline-none w-[180px] md:w-[240px] lg:w-[320px] text-sm transition-all duration-200"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-1">
              <button className="relative p-2 text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-lg transition-all duration-200">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 bg-[#0288D1] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  3
                </span>
              </button>

              <button className="relative p-2 text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-lg transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 bg-[#ED6C02] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  7
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-1 sm:hidden">
            <button className="p-2 text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-lg transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>
            <button className="relative p-2 text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-lg transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-[#ED6C02] text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                7
              </span>
            </button>
          </div>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#E1F5FE] transition-all duration-200">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0288D1] to-[#01579B] flex items-center justify-center shadow-sm ring-2 ring-white">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-lg object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#4CAF50] border-2 border-white rounded-full"></div>
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#E1F5FE] text-[#0288D1]">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                  {user?.isVerified && (
                    <Shield className="w-3.5 h-3.5 text-[#4CAF50]" />
                  )}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 translate-y-1">
              <div className="p-2">
                <button className="flex items-center w-full px-3 py-2 text-sm text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-md transition-all duration-200">
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <button className="flex items-center w-full px-3 py-2 text-sm text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] rounded-md transition-all duration-200">
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                <div className="h-px bg-slate-200 my-2"></div>
                <button 
                  onClick={logout}
                  className="flex items-center w-full px-3 py-2 text-sm text-[#D32F2F] hover:bg-[#FFEBEE] rounded-md transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;