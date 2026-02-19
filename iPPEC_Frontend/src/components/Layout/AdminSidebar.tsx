import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BookOpen,
  Shield,
  BarChart3,
  Settings,
  UserCheck,
  FileText,
  Bell,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Pill,
  X
} from 'lucide-react';
import IPPECLogo from '../common/iPPECLogo';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['users']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      color: 'text-[#0288D1]'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      color: 'text-[#0288D1]',
      submenu: [
        { label: 'All Users', path: '/admin/registered-users', icon: Users },
        { label: 'Register User', path: '/admin/register', icon: UserCheck }
      ]
    },
    {
      id: 'facilities',
      label: 'Facilities',
      icon: Building2,
      color: 'text-[#0288D1]',
      submenu: [
        { label: 'Hospitals', path: '/admin/hospital-management', icon: Building2 },
        { label: 'Pharmacies', path: '/admin/pharmacy-management', icon: Building2 },
        { label: 'Medicines', path: '/admin/medicine-management', icon: Pill }
      ]
    },
    {
      id: 'articles',
      label: 'Health Articles',
      icon: BookOpen,
      color: 'text-[#0288D1]',
      submenu: [
        { label: 'All Articles', path: '/admin/articles', icon: BookOpen },
        { label: 'Pending Review', path: '/admin/articles/pending', icon: FileText },
        { label: 'Published', path: '/admin/articles/published', icon: FileText }
      ]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      path: '/admin/notifications',
      color: 'text-[#0288D1]'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      path: '/admin/messages',
      color: 'text-[#0288D1]'
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      path: '/admin/reports',
      color: 'text-[#0288D1]'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      color: 'text-[#0288D1]'
    }
  ];

  return (
    <aside className="h-full bg-white flex flex-col">
      <div className="flex flex-col h-full">
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <IPPECLogo size="sm" showText={true} showTagline={true} />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {expandedMenus.includes(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedMenus.includes(item.id) && (
                    <div className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">
                      {item.submenu.map((subItem, index) => (
                        <NavLink
                          key={index}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 p-2 rounded-lg text-sm ${
                              isActive
                                ? 'text-[#0288D1] bg-[#E1F5FE] font-medium'
                                : 'text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE]'
                            } transition-colors`
                          }
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path!}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-lg ${
                      isActive
                        ? 'text-[#0288D1] bg-[#E1F5FE] font-medium'
                        : 'text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE]'
                    } transition-colors`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-50">
            <div className="w-10 h-10 rounded-lg bg-[#0288D1] flex items-center justify-center text-white font-medium">
              {user?.name?.[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <div className="flex items-center">
                <Shield className="w-3 h-3 text-[#0288D1] mr-1" />
                <span className="text-xs text-slate-600">Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
