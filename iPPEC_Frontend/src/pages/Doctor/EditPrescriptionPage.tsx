import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Loader2,
} from 'lucide-react';
import { apiClient } from '../../utils/api';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../components/common/ToastContainer';

import {
  Patient,
  Medication,
  PrescriptionMedication,
  PrescriptionForm,
} from '../../types/prescription';

const EditPrescriptionPage: React.FC = () => {
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [medicineSearch, setMedicineSearch] = useState('');
  const [medicines, setMedicines] = useState<Medication[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescriptionForm, setPrescriptionForm] = useState<PrescriptionForm>({
    patientId: '',
    chiefComplaints: '',
    findingsOnExam: '',
    advice: '',
    medicines: [],
  });
  const [initialFormState, setInitialFormState] = useState<PrescriptionForm | null>(null);

  const debouncedMedicineSearch = useDebounce(medicineSearch, 500);

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!prescriptionId) {
        showToast('No prescription ID provided', 'error');
        navigate('/doctor/my-prescriptions');
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiClient.get(`/prescriptions/${prescriptionId}`);
        const prescriptionData = response.data;

        const formState: PrescriptionForm = {
          patientId: prescriptionData.patient.id,
          chiefComplaints: prescriptionData.chiefComplaints || '',
          findingsOnExam: prescriptionData.findingsOnExam || '',
          advice: prescriptionData.advice || '',
          followUpDate: prescriptionData.followUpDate ? new Date(prescriptionData.followUpDate).toISOString().split('T')[0] : '',
          medicines: prescriptionData.medicines.map((med: any) => ({
            medicineId: med.medicine.id,
            name: med.medicine.brandName,
            genericName: med.medicine.genericName,
            route: med.route,
            form: med.form,
            quantityPerDose: med.quantityPerDose,
            frequency: med.frequency,
            durationInDays: med.durationInDays,
            fullInstruction: med.fullInstruction,
            totalQuantity: med.totalQuantity,
          })),
        };

        setPrescriptionForm(formState);
        setInitialFormState(formState);
        setSelectedPatient({
          id: prescriptionData.patient.id,
          fullName: prescriptionData.patient.fullName,
          dateOfBirth: prescriptionData.patient.dateOfBirth,
        });

      } catch (error: any) {
        showToast(error.response?.data?.message || 'Failed to fetch prescription', 'error');
        navigate('/doctor/my-prescriptions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescription();
  }, [prescriptionId, navigate, showToast]);

  useEffect(() => {
    if (debouncedMedicineSearch) {
      apiClient.get(`/medicines?search=${debouncedMedicineSearch}&limit=10`)
        .then(response => {
          setMedicines(response.data);
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

  const savePrescription = () => {
    console.log('Saving prescription:', prescriptionForm);
    // Handle save logic
  };

  const handleUpdatePrescription = async () => {
    if (!prescriptionId) return;

    setIsSaving(true);
    const payload = {
      ...prescriptionForm,
      followUpDate: prescriptionForm.followUpDate
        ? new Date(prescriptionForm.followUpDate).toISOString()
        : undefined,
    };

    try {
      const response = await apiClient.patch(`/prescriptions/${prescriptionId}`, payload);
      if (response.success) {
        showToast('Prescription updated successfully!', 'success');
        setInitialFormState(prescriptionForm);
        navigate(`/doctor/prescriptions/${prescriptionId}`);
      } else {
        showToast(response.message || 'Failed to update prescription', 'error');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'An unexpected error occurred', 'error');
    } finally {
      setIsSaving(false);
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
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </button>
            <button
              onClick={handleUpdatePrescription}
              disabled={isSaving || JSON.stringify(initialFormState) === JSON.stringify(prescriptionForm)}
              className="inline-flex items-center px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Patient</h3>

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
                      placeholder="Search patients..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
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

          {/* Prescription Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagnosis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Context</h3>

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Findings on Exam</label>
                  <textarea
                    value={prescriptionForm.findingsOnExam}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, findingsOnExam: e.target.value }))}
                    placeholder="O/E: Temperature 38.5°C. Lungs sound clear. Throat slightly red."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advice</label>
                  <textarea
                    value={prescriptionForm.advice}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, advice: e.target.value }))}
                    placeholder="Get plenty of rest and stay hydrated. Monitor temperature."
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

              {/* Medication Search Results */}
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
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Pill className="w-5 h-5 text-medical-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{medication.name}</h4>
                          <p className="text-sm text-gray-500">{medication.genericName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeMedication(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Route</label>
                        <input
                          type="text"
                          value={medication.route}
                          onChange={(e) => updateMedication(index, 'route', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-medical-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Form</label>
                        <input
                          type="text"
                          value={medication.form}
                          onChange={(e) => updateMedication(index, 'form', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-medical-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Quantity per Dose</label>
                        <input
                          type="number"
                          value={medication.quantityPerDose}
                          onChange={(e) => updateMedication(index, 'quantityPerDose', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-medical-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Frequency</label>
                        <input
                          type="text"
                          value={medication.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-medical-500 focus:border-transparent outline-none"
                        />
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

export default EditPrescriptionPage;