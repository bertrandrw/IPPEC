import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Pill,
  MapPin,
  ShoppingCart,
  CreditCard,
  User,
  BookOpen,
  Users,
  UserCheck,
  Package,
  BarChart3,
  Settings,
  Stethoscope,
  Building2,
  Shield,
  Activity,
  TrendingUp,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import IPPECLogo from '../common/iPPECLogo';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'patient':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
          { icon: BookOpen, label: 'Health Articles', path: '/patient/articles' },
          { icon: FileText, label: 'My Prescriptions', path: '/patient/prescriptions' },
          { icon: MapPin, label: 'Find Pharmacies', path: '/patient/pharmacies' },
          { icon: ShoppingCart, label: 'My Orders', path: '/patient/orders' },
          { icon: Shield, label: 'Private Orders', path: '/patient/private-orders' },
          { icon: User, label: 'Profile & History', path: '/patient/profile' },
        ];
      
      case 'doctor':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
          { icon: Users, label: 'My Patients', path: '/doctor/patients' },
          { icon: FileText, label: 'My Prescriptions', path: '/doctor/my-prescriptions' },
          { icon: Stethoscope, label: 'E-Prescription Tool', path: '/doctor/e-prescription' },
          { icon: BookOpen, label: 'Health Articles', path: '/doctor/articles' },
          { icon: User, label: 'Profile', path: '/doctor/profile' },
        ];
      
      case 'pharmacist':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/pharmacist/dashboard' },
          { icon: FileText, label: 'Prescriptions', path: '/pharmacist/prescriptions' },
          { icon: ShoppingCart, label: 'Orders', path: '/pharmacist/orders' },
          { icon: Package, label: 'Inventory', path: '/pharmacist/inventory' },
          { icon: Shield, label: 'Private Orders', path: '/pharmacist/private-orders' },
          { icon: CreditCard, label: 'Insurance Claims', path: '/pharmacist/insurance-claims' },
          { icon: User, label: 'Profile', path: '/pharmacist/profile' },
        ];
      
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'User Management', path: '/admin/users' },
          { icon: UserCheck, label: 'Register User', path: '/admin/register' },
          { icon: BookOpen, label: 'Health Articles', path: '/admin/articles' },
          { icon: Building2, label: 'Pharmacy Management', path: '/admin/pharmacy-management' },
          { icon: BarChart3, label: 'System Analytics', path: '/admin/analytics' },
          { icon: Activity, label: 'System Activity', path: '/admin/activity' },
          { icon: Settings, label: 'System Settings', path: '/admin/settings' },
        ];
      
      case 'insurer':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/insurer/dashboard' },
          { icon: Building2, label: 'Pharmacy Management', path: '/insurer/pharmacies' },
          { icon: FileText, label: 'Claims Processing', path: '/insurer/claims' },
          { icon: BarChart3, label: 'Reports & Analytics', path: '/insurer/reports' },
          { icon: TrendingUp, label: 'Financial Overview', path: '/insurer/financial' },
          { icon: Shield, label: 'Fraud Detection', path: '/insurer/fraud' },
          { icon: Users, label: 'Member Management', path: '/insurer/members' },
          { icon: Settings, label: 'Settings', path: '/insurer/settings' },
        ];
      
      default:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        ];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 lg:static bg-white w-[280px] lg:w-64 h-full border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:transform-none z-40 overflow-hidden flex flex-col">
      <div className="p-4 sm:p-5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IPPECLogo size="sm" showText={true} showTagline={true} />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-[#0288D1] hover:bg-[#E1F5FE] transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 pb-4 mt-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E1F5FE] text-[#0288D1] shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#0288D1]'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0 transition-colors duration-200" />
                <span className="flex-1 truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Role Badge */}
      <div className="mt-auto px-3">
        <div className="p-3 bg-gradient-to-br from-[#E1F5FE] to-white rounded-lg border border-[#E1F5FE]">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0288D1] to-[#01579B] flex items-center justify-center shadow-sm ring-2 ring-white">
                {user?.role === 'admin' && <Shield className="w-4.5 h-4.5 text-white" />}
                {user?.role === 'doctor' && <Stethoscope className="w-4.5 h-4.5 text-white" />}
                {user?.role === 'pharmacist' && <Pill className="w-4.5 h-4.5 text-white" />}
                {user?.role === 'patient' && <User className="w-4.5 h-4.5 text-white" />}
                {user?.role === 'insurer' && <Building2 className="w-4.5 h-4.5 text-white" />}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4CAF50] border-2 border-white rounded-full"></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-700 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize mt-0.5">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;