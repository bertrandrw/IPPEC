import React, { useState } from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import PatientRegistration from './PatientRegistration';
import DoctorRegistration from './DoctorRegistration';
import PharmacistRegistration from './PharmacistRegistration';
import InsurerRegistration from './InsurerRegistration';
import { User, Stethoscope, Pill, Building2 } from 'lucide-react';
import { useToast } from '../../../components/common/ToastContainer';

const UserRegistration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'pharmacist' | 'insurer'>('patient');
  const { showToast } = useToast();

  const handleRegistrationSuccess = (userType: string) => {
    showToast('success', `${userType} registered successfully!`);
  };

  const handleRegistrationError = (error: string) => {
    showToast('error', error || 'Registration failed. Please try again.');
  };

  return (
    <AdminLayout title="User Registration">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Register New User</h2>
          <p className="text-gray-600 mt-1">Add new users to the healthcare platform</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('patient')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'patient'
                  ? 'text-medical-600 border-b-2 border-medical-600 bg-medical-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Patient</span>
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'doctor'
                  ? 'text-medical-600 border-b-2 border-medical-600 bg-medical-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Stethoscope className="w-5 h-5" />
              <span>Doctor</span>
            </button>
            <button
              onClick={() => setActiveTab('pharmacist')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'pharmacist'
                  ? 'text-medical-600 border-b-2 border-medical-600 bg-medical-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Pill className="w-5 h-5" />
              <span>Pharmacist</span>
            </button>
            <button
              onClick={() => setActiveTab('insurer')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'insurer'
                  ? 'text-medical-600 border-b-2 border-medical-600 bg-medical-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Insurer</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {activeTab === 'patient' && (
              <PatientRegistration 
                onSuccess={() => handleRegistrationSuccess('Patient')} 
                onError={handleRegistrationError} 
              />
            )}
            {activeTab === 'doctor' && (
              <DoctorRegistration 
                onSuccess={() => handleRegistrationSuccess('Doctor')} 
                onError={handleRegistrationError} 
              />
            )}
            {activeTab === 'pharmacist' && (
              <PharmacistRegistration 
                onSuccess={() => handleRegistrationSuccess('Pharmacist')} 
                onError={handleRegistrationError} 
              />
            )}
            {activeTab === 'insurer' && (
              <InsurerRegistration 
                onSuccess={() => handleRegistrationSuccess('Insurer')} 
                onError={handleRegistrationError} 
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserRegistration;