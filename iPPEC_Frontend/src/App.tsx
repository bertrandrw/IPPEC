import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastContainer';

// Landing Page
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

// Auth Components
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Dashboard Pages
import PatientDashboard from './pages/Patient/PatientDashboard';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import PharmacistDashboard from './pages/Pharmacist/PharmacistDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import InsurerDashboard from './pages/Insurer/InsurerDashboard';

// Patient Pages
import HealthArticles from './pages/Patient/HealthArticles';
import MyPrescriptions from './pages/Patient/MyPrescriptions';
import FindPharmacies from './pages/Patient/FindPharmacies';
import MyOrders from './pages/Patient/MyOrders';
import PrivateOrders from './pages/Patient/PrivateOrders';
import PatientProfile from './pages/Patient/PatientProfile';

// Doctor Pages
import MyPatients from './pages/Doctor/MyPatients';
import EPrescription from './pages/Doctor/EPrescription';
import EditPrescriptionPage from './pages/Doctor/EditPrescriptionPage';
import MyPrescriptionsDoctor from './pages/Doctor/MyPrescriptions';
import PrescriptionDetails from './pages/Doctor/PrescriptionDetails';
import ArticlesPage from './pages/Doctor/DoctorArticles';
import DoctorProfile from './pages/Doctor/DoctorProfile';

// Pharmacist Pages
import PrescriptionManagement from './pages/Pharmacist/PrescriptionManagement';
import InventoryManagement from './pages/Pharmacist/InventoryManagement';
import OrderManagement from './pages/Pharmacist/OrderManagement';
import InsuranceClaims from './pages/Pharmacist/InsuranceClaims';
import PharmacistPrivateOrders from './pages/Pharmacist/PharmacistPrivateOrders';
import PharmacistProfile from './pages/Pharmacist/PharmacistProfile';

// Admin Pages
import AdminArticles from './pages/Admin/AdminArticles';
import AdminUserManagement from './pages/Admin/AdminUserManagement';
import AdminSystemAnalytics from './pages/Admin/AdminSystemAnalytics';
import UserRegistration from './pages/Admin/UserRegistration';
import UserList from './pages/Admin/UserRegistration/UserList';
import PharmacyManagement from './pages/Admin/PharmacyManagement';
import HospitalManagement from './pages/Admin/HospitalManagement';
import MedicineManagement from './pages/Admin/MedicineManagement';

// Insurer Pages
import PharmacyManagementInsurer from './pages/Insurer/PharmacyManagement';
import ClaimsProcessing from './pages/Insurer/ClaimsProcessing';
import ReportsAnalytics from './pages/Insurer/ReportsAnalytics';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// App Content Component
const AppContent: React.FC = () => {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'pharmacist': return '/pharmacist/dashboard';
      case 'patient': return '/patient/dashboard';
      case 'insurer': return '/insurer/dashboard';
      default: return '/login';
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to={getDashboardRoute()} replace /> : <LoginForm />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to={getDashboardRoute()} replace /> : <RegisterForm />} 
      />
      <Route 
        path="/forgot-password" 
        element={user ? <Navigate to={getDashboardRoute()} replace /> : <ForgotPassword />} 
      />
      <Route 
        path="/reset-password" 
        element={user ? <Navigate to={getDashboardRoute()} replace /> : <ResetPassword />} 
      />
      
      {/* Patient Routes */}
      <Route path="/patient/dashboard" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/patient/articles" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <HealthArticles />
        </ProtectedRoute>
      } />
      <Route path="/patient/prescriptions" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <MyPrescriptions />
        </ProtectedRoute>
      } />
      <Route path="/patient/pharmacies" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <FindPharmacies />
        </ProtectedRoute>
      } />
      <Route path="/patient/orders" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <MyOrders />
        </ProtectedRoute>
      } />
      <Route path="/patient/private-orders" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PrivateOrders />
        </ProtectedRoute>
      } />
      <Route path="/patient/profile" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientProfile />
        </ProtectedRoute>
      } />
      
      {/* Doctor Routes */}
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/doctor/patients" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <MyPatients />
        </ProtectedRoute>
      } />
      <Route path="/doctor/e-prescription" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <EPrescription />
        </ProtectedRoute>
      } />
      <Route path="/doctor/my-prescriptions" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <MyPrescriptionsDoctor />
        </ProtectedRoute>
      } />
      <Route path="/doctor/prescriptions/edit/:prescriptionId" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <EditPrescriptionPage />
        </ProtectedRoute>
      } />
      <Route path="/doctor/prescriptions/:id" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <PrescriptionDetails />
        </ProtectedRoute>
      } />
      <Route path="/doctor/articles" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <ArticlesPage />
        </ProtectedRoute>
      } />
      <Route path="/doctor/profile" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorProfile />
        </ProtectedRoute>
      } />
      
      {/* Pharmacist Routes */}
      <Route path="/pharmacist/dashboard" element={
        <ProtectedRoute allowedRoles={['pharmacist']}>
          <PharmacistDashboard />
        </ProtectedRoute>
      } />
      <Route path="/pharmacist/prescriptions" element={
        <ProtectedRoute allowedRoles={['pharmacist']}>
          <PrescriptionManagement />
        </ProtectedRoute>
      } />
      <Route path="/pharmacist/inventory" element={
        <ProtectedRoute allowedRoles={['pharmacist']}>
          <InventoryManagement />
        </ProtectedRoute>
      } />
      <Route path="/pharmacist/orders" element={
        <ProtectedRoute allowedRoles={['pharmacist']}>
          <OrderManagement />
        </ProtectedRoute>
      } />
      <Route path="/pharmacist/insurance-claims" element={
        <ProtectedRoute allowedRoles={['pharmacist']}>
          <InsuranceClaims />
        </ProtectedRoute>
      } />
      <Route path="/pharmacist/private-orders" element={
        <ProtectedRoute allowedRoles={['pharmacist']}>
          <PharmacistPrivateOrders />
        </ProtectedRoute>
      } />
      <Route path="/pharmacist/profile" element={
        <ProtectedRoute allowedRoles={['pharmacist']}>
          <PharmacistProfile />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/articles" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminArticles />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminUserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminSystemAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/admin/register" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserRegistration />
        </ProtectedRoute>
      } />
      <Route path="/admin/registered-users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserList />
        </ProtectedRoute>
      } />
      <Route path="/admin/pharmacy-management" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PharmacyManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/hospital-management" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <HospitalManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/medicine-management" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <MedicineManagement />
        </ProtectedRoute>
      } />
      
      {/* Insurer Routes */}
      <Route path="/insurer/dashboard" element={
        <ProtectedRoute allowedRoles={['insurer']}>
          <InsurerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/insurer/pharmacies" element={
        <ProtectedRoute allowedRoles={['insurer']}>
          <PharmacyManagementInsurer />
        </ProtectedRoute>
      } />
      <Route path="/insurer/claims" element={
        <ProtectedRoute allowedRoles={['insurer']}>
          <ClaimsProcessing />
        </ProtectedRoute>
      } />
      <Route path="/insurer/reports" element={
        <ProtectedRoute allowedRoles={['insurer']}>
          <ReportsAnalytics />
        </ProtectedRoute>
      } />
      
      {/* Generic Dashboard Route */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Navigate to={getDashboardRoute()} replace />
        </ProtectedRoute>
      } />
      
      {/* Landing Page */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Default Dashboard Redirect */}
      <Route path="/dashboard" element={
        user ? (
          <Navigate to={getDashboardRoute()} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <AppContent />
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;