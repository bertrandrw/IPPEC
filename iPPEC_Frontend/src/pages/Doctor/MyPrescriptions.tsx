import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { apiClient } from '../../utils/api';
import { Link } from 'react-router-dom';
import { Eye, Edit } from 'lucide-react';

interface Prescription {
  id: string;
  createdAt: string;
  patient: {
    fullName: string;
  };
  status: string;
}

const MyPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/prescriptions/my-prescriptions');
        if (response.success) {
          setPrescriptions(response.data.data);
        } else {
          setError(response.message || 'Failed to fetch prescriptions.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <Layout title="My Prescriptions">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Sent Prescriptions</h2>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      <p className="text-gray-500">Loading prescriptions...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      <p className="text-red-500">{error}</p>
                    </td>
                  </tr>
                ) : prescriptions.length > 0 ? (
                  prescriptions.map((prescription) => (
                    <tr key={prescription.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.patient.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            prescription.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {prescription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center space-x-4">
                        <Link to={`/doctor/prescriptions/edit/${prescription.id}`} className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <Link to={`/doctor/prescriptions/${prescription.id}`} className="text-medical-600 hover:text-medical-900">
                          <Eye className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      <p className="text-gray-500">No prescriptions found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyPrescriptions;
