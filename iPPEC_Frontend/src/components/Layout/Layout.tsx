import React, { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  title: string;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showFooter = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-slate-50/40">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`lg:relative ${sidebarOpen ? '' : 'hidden lg:block'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header title={title} onMenuClick={toggleSidebar} />
        <main className="flex-1 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 overflow-x-hidden">
          <div className="max-w-[1920px] mx-auto">
            {children}
          </div>
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;