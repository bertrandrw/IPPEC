import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  Search, 
  Plus,
  Trash2,
  Save,
  Send,
  User,
  Pill,
  Edit,
  HelpCircle,
  ClipboardList,
  Calendar
} from 'lucide-react';
import { apiClient } from '../../utils/api';
import { useDebounce } from '../../hooks/useDebounce';

interface Medication {
  id: string;
  brandName: string;
  genericName: string;
}

interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
}

interface PrescriptionForm {
  patientId: string;
  chiefComplaints: string;
  findingsOnExam: string;
  advice: string;
  medicines: PrescriptionMedication[];
  followUpDate?: string;
}

interface PrescriptionMedication {
  medicineId: string;
  name: string;
  genericName: string;
  route: string;
  form: string;
  quantityPerDose: number;
  frequency: string;
  durationInDays: number;
  fullInstruction: string;
  totalQuantity: string;
}

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute z-10 w-48 p-2 mt-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -left-20 top-full">
      {text}
      <div className="absolute bottom-full left-1/2 -ml-1 w-2 h-2 bg-gray-900 transform rotate-45" />
    </div>
  </div>
);

const EPrescription: React.FC = () => {
  const [patientSearch, setPatientSearch] = useState('');
  const [medicineSearch, setMedicineSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicines, setMedicines] = useState<Medication[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState<PrescriptionForm>({
    patientId: '',
    chiefComplaints: '',
    findingsOnExam: '',
    advice: '',
    medicines: [],
  });

  const debouncedPatientSearch = useDebounce(patientSearch, 500);
  const debouncedMedicineSearch = useDebounce(medicineSearch, 500);

  useEffect(() => {
    if (debouncedPatientSearch) {
      apiClient.get(`/users/patients?search=${debouncedPatientSearch}&limit=10`)
        .then(response => {
          setPatients(response.data.data.map((p: any) => ({
            id: p.patientProfile.id,
            fullName: p.patientProfile.fullName,
            dateOfBirth: p.patientProfile.dateOfBirth,
          })));
        })
        .catch(error => console.error('Error fetching patients:', error));
    } else {
      setPatients([]);
    }
  }, [debouncedPatientSearch]);

  useEffect(() => {
    if (debouncedMedicineSearch) {
      apiClient.get(`/medicines?search=${debouncedMedicineSearch}&limit=10`)
        .then(response => {
          setMedicines(response.data.data || []);
        })
        .catch(error => console.error('Error fetching medicines:', error));
    } else {
      setMedicines([]);
    }
  }, [debouncedMedicineSearch]);

  const addMedication = (medication: Medication) => {
    const newMedication: PrescriptionMedication = {
      medicineId: medication.id,
      name: medication.brandName,
      genericName: medication.genericName,
      route: 'PO',
      form: 'Tablet',
      quantityPerDose: 1,
      frequency: 'tid',
      durationInDays: 5,
      fullInstruction: '1 tab tid for 5 days',
      totalQuantity: '15 tabs',
    };

    setPrescriptionForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, newMedication],
    }));
    setMedicineSearch('');
  };

  const updateMedication = (index: number, field: keyof PrescriptionMedication, value: any) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  const removeMedication = (index: number) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPrescriptionForm(prev => ({ ...prev, patientId: patient.id }));
    setPatientSearch('');
  };

  const savePrescription = async () => {
    if (!prescriptionForm.patientId) {
      alert('Please select a patient first');
      return;
    }

    const payload = {
      ...prescriptionForm,
      followUpDate: prescriptionForm.followUpDate
        ? new Date(prescriptionForm.followUpDate).toISOString()
        : undefined,
      status: 'DRAFT'
    };

    try {
      const response = await apiClient.post('/prescriptions/draft', payload);
      if (response.success) {
        alert('Prescription saved as draft successfully!');
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error: any) {
      console.error('Error saving prescription:', error);
      alert(`Error: ${error.response?.data?.message || 'An unexpected error occurred.'}`);
    }
  };

  const sendPrescription = async () => {
    if (!prescriptionForm.patientId) {
      alert('Please select a patient first');
      return;
    }

    if (prescriptionForm.medicines.length === 0) {
      alert('Please add at least one medication');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...prescriptionForm,
      followUpDate: prescriptionForm.followUpDate
        ? new Date(prescriptionForm.followUpDate).toISOString()
        : undefined,
      status: 'ACTIVE'
    };

    try {
      const response = await apiClient.post('/prescriptions', payload);
      if (response.success) {
        alert('Prescription sent successfully!');
        setSelectedPatient(null);
        setPrescriptionForm({
          patientId: '',
          chiefComplaints: '',
          findingsOnExam: '',
          advice: '',
          medicines: [],
        });
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error: any) {
      console.error('Error creating prescription:', error);
      alert(`Error: ${error.response?.data?.message || 'An unexpected error occurred.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="E-Prescription Tool">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">E-Prescription Tool</h2>
            <p className="text-gray-600 mt-1">Create and manage digital prescriptions</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={savePrescription}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </button>
            <button
              onClick={sendPrescription}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Sending...' : 'Send Prescription'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">Select Patient</h3>
                </div>
              </div>

              {selectedPatient ? (
                <div className="border border-medical-200 rounded-lg p-4 bg-medical-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{selectedPatient.fullName}</h4>
                    <button
                      onClick={() => {
                        setSelectedPatient(null);
                        setPrescriptionForm(prev => ({ ...prev, patientId: '' }));
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">ID: {selectedPatient.id}</p>
                </div>
              ) : (
                <div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      placeholder="Search patients..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none w-full"
                    />
                  </div>

                  {patientSearch && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {patients.map((patient) => (
                        <div
                          key={patient.id}
                          onClick={() => selectPatient(patient)}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <User className="w-8 h-8 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{patient.fullName}</p>
                              <p className="text-sm text-gray-500">ID: {patient.id}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Clinical Context and Medications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clinical Context */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaints</label>
                  <textarea
                    value={prescriptionForm.chiefComplaints}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, chiefComplaints: e.target.value }))}
                    placeholder="Patient reports persistent dry cough and fever for 3 days."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Findings on Examination</label>
                  <textarea
                    value={prescriptionForm.findingsOnExam}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, findingsOnExam: e.target.value }))}
                    placeholder="Document physical examination findings and vital signs."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor's Advice</label>
                  <textarea
                    value={prescriptionForm.advice}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, advice: e.target.value }))}
                    placeholder="Additional instructions or advice for the patient."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date (Optional)</label>
                  <input
                    type="date"
                    value={prescriptionForm.followUpDate}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, followUpDate: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search medications..."
                    value={medicineSearch}
                    onChange={(e) => setMedicineSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none w-64"
                  />
                </div>
              </div>

              {medicineSearch && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Search Results:</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {medicines.map((medication) => (
                      <div
                        key={medication.id}
                        onClick={() => addMedication(medication)}
                        className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{medication.brandName}</p>
                          <p className="text-sm text-gray-500">{medication.genericName}</p>
                        </div>
                        <Plus className="w-4 h-4 text-medical-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Added Medications */}
              <div className="space-y-4">
                {prescriptionForm.medicines.map((medication, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 hover:border-sky-200 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-sky-50 rounded-full p-2 border border-sky-100">
                          <Pill className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{medication.name}</h4>
                          <p className="text-sm text-gray-500">{medication.genericName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeMedication(index)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="relative">
                        <label className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Route</span>
                          <Tooltip text="How the medication should be taken">
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                          </Tooltip>
                        </label>
                        <div className="mt-1">
                          <select
                            value={medication.route}
                            onChange={(e) => updateMedication(index, 'route', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all duration-200 hover:border-sky-200"
                          >
                            <option value="PO">PO (Oral)</option>
                            <option value="IM">IM (Intramuscular)</option>
                            <option value="IV">IV (Intravenous)</option>
                            <option value="SC">SC (Subcutaneous)</option>
                          </select>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Form</span>
                          <Tooltip text="Medication form (tablet, capsule, etc.)">
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                          </Tooltip>
                        </label>
                        <div className="mt-1">
                          <select
                            value={medication.form}
                            onChange={(e) => updateMedication(index, 'form', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all duration-200 hover:border-sky-200"
                          >
                            <option value="Tablet">Tablet</option>
                            <option value="Capsule">Capsule</option>
                            <option value="Syrup">Syrup</option>
                            <option value="Injection">Injection</option>
                          </select>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Quantity per Dose</span>
                          <Tooltip text="Number of units per dose">
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                          </Tooltip>
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            min="0.25"
                            step="0.25"
                            value={medication.quantityPerDose}
                            onChange={(e) => updateMedication(index, 'quantityPerDose', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all duration-200 hover:border-sky-200"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <label className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Frequency</span>
                          <Tooltip text="How often to take the medication">
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                          </Tooltip>
                        </label>
                        <div className="mt-1">
                          <select
                            value={medication.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all duration-200 hover:border-sky-200"
                          >
                            <option value="qd">Once daily (QD)</option>
                            <option value="bid">Twice daily (BID)</option>
                            <option value="tid">Three times daily (TID)</option>
                            <option value="qid">Four times daily (QID)</option>
                            <option value="prn">As needed (PRN)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Days)</label>
                        <input
                          type="number"
                          value={medication.durationInDays}
                          onChange={(e) => updateMedication(index, 'durationInDays', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-medical-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Total Quantity</label>
                        <input
                          type="text"
                          value={medication.totalQuantity}
                          onChange={(e) => updateMedication(index, 'totalQuantity', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-medical-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Instruction</label>
                      <input
                        type="text"
                        value={medication.fullInstruction}
                        onChange={(e) => updateMedication(index, 'fullInstruction', e.target.value)}
                        placeholder="e.g. 1 tab tid for 5 days"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-medical-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                ))}

                {prescriptionForm.medicines.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Pill className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p>No medications added yet</p>
                    <p className="text-sm">Search and add medications above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EPrescription;
