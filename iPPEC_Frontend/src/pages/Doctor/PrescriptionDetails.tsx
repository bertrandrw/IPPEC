import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { apiClient } from '../../utils/api';
import { Prescription } from '../../types/prescription'; // This will need to be updated

const PrescriptionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/prescriptions/${id}`);
        if (response.success) {
          setPrescription(response.data);
        } else {
          setError(response.message || 'Failed to fetch prescription details.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrescriptionDetails();
    }
  }, [id]);

  if (loading) {
    return <Layout title="Prescription Details"><div className="text-center py-8"><p>Loading...</p></div></Layout>;
  }

  if (error) {
    return <Layout title="Prescription Details"><div className="text-center py-8 text-red-500"><p>{error}</p></div></Layout>;
  }

  if (!prescription) {
    return <Layout title="Prescription Details"><div className="text-center py-8"><p>Prescription not found.</p></div></Layout>;
  }

  return (
    <Layout title="Prescription Details">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Prescription Details</h2>
            <p className="text-gray-500">Issued on: {new Date(prescription.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{prescription.patient.fullName}</p>
            <p className="text-sm text-gray-600">Patient ID: {prescription.patientId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Clinical Information</h3>
            <div className="space-y-3 mt-3">
              <div>
                <p className="font-medium text-gray-600">Chief Complaints</p>
                <p className="text-gray-800">{prescription.chiefComplaints}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Findings on Exam</p>
                <p className="text-gray-800">{prescription.findingsOnExam}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Advice</p>
                <p className="text-gray-800">{prescription.advice}</p>
              </div>
              {prescription.followUpDate && (
                <div>
                  <p className="font-medium text-gray-600">Follow-up Date</p>
                  <p className="text-gray-800">{new Date(prescription.followUpDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Medications</h3>
          <div className="space-y-4">
            {prescription.medicines.map((med: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <p className="font-bold text-lg text-medical-700">{med.name}</p>
                <p className="text-sm text-gray-600 mb-2">{med.genericName}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <p><span className="font-medium">Route:</span> {med.route}</p>
                  <p><span className="font-medium">Form:</span> {med.form}</p>
                  <p><span className="font-medium">Dose:</span> {med.quantityPerDose}</p>
                  <p><span className="font-medium">Frequency:</span> {med.frequency}</p>
                  <p><span className="font-medium">Duration:</span> {med.durationInDays} days</p>
                  <p><span className="font-medium">Total:</span> {med.totalQuantity}</p>
                </div>
                <p className="mt-2 text-sm bg-blue-50 p-2 rounded"><span className="font-medium">Instruction:</span> {med.fullInstruction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrescriptionDetails;
