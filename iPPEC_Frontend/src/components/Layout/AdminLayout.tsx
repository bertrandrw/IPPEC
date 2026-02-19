import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import Footer from './Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${showMobileMenu ? '' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-slate-900/50 transition-opacity duration-300 ${
            showMobileMenu ? 'opacity-100' : 'opacity-0'
          }`} 
          onClick={toggleMobileMenu}
        />
        {/* Sidebar */}
        <div className={`absolute left-0 top-0 h-full w-64 transform transition-transform duration-300 ${
          showMobileMenu ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <AdminSidebar onClose={toggleMobileMenu} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r border-slate-200">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 lg:pl-64">
        <div className="flex flex-col min-h-screen">
          <AdminHeader title={title} onMenuClick={toggleMobileMenu} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
