import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  UserPlus, 
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  AlertCircle,
  Shield,
  FileText,
  CheckCircle
} from 'lucide-react';

interface PatientForm {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Medical Information
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  
  // Insurance Information
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  
  // Additional Information
  preferredPharmacy: string;
  notes: string;
}

const RegisterPatient: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientForm, setPatientForm] = useState<PatientForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bloodType: '',
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    preferredPharmacy: '',
    notes: ''
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const steps = [
    { id: 1, name: 'Basic Info', icon: User },
    { id: 2, name: 'Medical Info', icon: Heart },
    { id: 3, name: 'Emergency Contact', icon: AlertCircle },
    { id: 4, name: 'Insurance', icon: Shield },
    { id: 5, name: 'Review', icon: CheckCircle }
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const relationships = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other'];

  const handleInputChange = (field: keyof PatientForm, value: string) => {
    setPatientForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToArray = (field: 'allergies' | 'chronicConditions' | 'currentMedications', value: string) => {
    if (value.trim()) {
      setPatientForm(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeFromArray = (field: 'allergies' | 'chronicConditions' | 'currentMedications', index: number) => {
    setPatientForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Registering patient:', patientForm);
    // Handle patient registration
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return patientForm.firstName && patientForm.lastName && patientForm.email && patientForm.phone && patientForm.dateOfBirth;
      case 2:
        return patientForm.bloodType;
      case 3:
        return patientForm.emergencyContactName && patientForm.emergencyContactPhone;
      case 4:
        return true; // Insurance is optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={patientForm.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={patientForm.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={patientForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={patientForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={patientForm.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={patientForm.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                >
                  <option value="">Select gender</option>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Address Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={patientForm.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={patientForm.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={patientForm.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={patientForm.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type *</label>
              <select
                value={patientForm.bloodType}
                onChange={(e) => handleInputChange('bloodType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select blood type</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add allergy..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray('allergies', newAllergy);
                    setNewAllergy('');
                  }}
                  className="px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {patientForm.allergies.map((allergy, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeFromArray('allergies', index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Add condition..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray('chronicConditions', newCondition);
                    setNewCondition('');
                  }}
                  className="px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {patientForm.chronicConditions.map((condition, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeFromArray('chronicConditions', index)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Add medication..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray('currentMedications', newMedication);
                    setNewMedication('');
                  }}
                  className="px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {patientForm.currentMedications.map((medication, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {medication}
                    <button
                      type="button"
                      onClick={() => removeFromArray('currentMedications', index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                <input
                  type="text"
                  value={patientForm.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
                <input
                  type="tel"
                  value={patientForm.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select
                  value={patientForm.emergencyContactRelationship}
                  onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                >
                  <option value="">Select relationship</option>
                  {relationships.map(relationship => (
                    <option key={relationship} value={relationship}>{relationship}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Insurance Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
                <input
                  type="text"
                  value={patientForm.insuranceProvider}
                  onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                  placeholder="e.g., BlueCross BlueShield"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
                <input
                  type="text"
                  value={patientForm.policyNumber}
                  onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Number</label>
                <input
                  type="text"
                  value={patientForm.groupNumber}
                  onChange={(e) => handleInputChange('groupNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Pharmacy</label>
                <input
                  type="text"
                  value={patientForm.preferredPharmacy}
                  onChange={(e) => handleInputChange('preferredPharmacy', e.target.value)}
                  placeholder="e.g., CVS Pharmacy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={patientForm.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                placeholder="Any additional information about the patient..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Patient Information</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 text-gray-900">{patientForm.firstName} {patientForm.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 text-gray-900">{patientForm.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2 text-gray-900">{patientForm.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date of Birth:</span>
                    <span className="ml-2 text-gray-900">{patientForm.dateOfBirth}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Medical Information</h4>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-gray-500">Blood Type:</span>
                    <span className="ml-2 text-gray-900">{patientForm.bloodType}</span>
                  </div>
                  {patientForm.allergies.length > 0 && (
                    <div>
                      <span className="text-gray-500">Allergies:</span>
                      <span className="ml-2 text-gray-900">{patientForm.allergies.join(', ')}</span>
                    </div>
                  )}
                  {patientForm.chronicConditions.length > 0 && (
                    <div>
                      <span className="text-gray-500">Chronic Conditions:</span>
                      <span className="ml-2 text-gray-900">{patientForm.chronicConditions.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
                <div className="text-sm">
                  <span className="text-gray-500">Contact:</span>
                  <span className="ml-2 text-gray-900">
                    {patientForm.emergencyContactName} ({patientForm.emergencyContactRelationship}) - {patientForm.emergencyContactPhone}
                  </span>
                </div>
              </div>

              {patientForm.insuranceProvider && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Insurance</h4>
                  <div className="text-sm">
                    <span className="text-gray-500">Provider:</span>
                    <span className="ml-2 text-gray-900">{patientForm.insuranceProvider}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout title="Register New Patient">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'border-medical-500 bg-medical-500 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-medical-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px ml-4 ${
                    currentStep > step.id ? 'bg-medical-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            ← Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                isStepValid(currentStep)
                  ? 'bg-medical-600 text-white hover:bg-medical-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register Patient
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPatient;