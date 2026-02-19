import React, { useState } from 'react';
import { XCircle, Search, Star, CheckCircle, Loader } from 'lucide-react';

// Mock pharmacy data
const mockFavorites = [
  { id: '1', name: 'City Pharmacy', address: '123 Main St', rating: 4.8, isFavorite: true, services: ['24/7', 'Delivery'] },
  { id: '2', name: 'HealthPlus', address: '456 Oak Ave', rating: 4.5, isFavorite: true, services: ['Delivery'] },
];
const mockSearchResults = [
  { id: '3', name: 'Wellness Pharmacy', address: '789 Pine Rd', rating: 4.2, isFavorite: false, services: ['24/7'] },
  { id: '4', name: 'CareMeds', address: '321 Maple St', rating: 4.0, isFavorite: false, services: [] },
];

interface SharePrescriptionModalProps {
  open: boolean;
  onClose: () => void;
  prescriptionId: string;
}

const SharePrescriptionModal: React.FC<SharePrescriptionModalProps> = ({ open, onClose, prescriptionId }) => {
  const [tab, setTab] = useState<'favorites' | 'search'>('favorites');
  const [search, setSearch] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  const pharmacies = tab === 'favorites' ? mockFavorites : mockSearchResults.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-2 p-0 relative animate-fadeIn">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
          <XCircle className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-2 border-b">
          <h2 className="text-xl font-bold text-gray-900">Send Prescription to Pharmacy</h2>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 space-x-4">
          <button
            className={`pb-2 font-medium border-b-2 transition-colors ${tab === 'favorites' ? 'border-medical-600 text-medical-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setTab('favorites')}
          >
            Favorites
          </button>
          <button
            className={`pb-2 font-medium border-b-2 transition-colors ${tab === 'search' ? 'border-medical-600 text-medical-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setTab('search')}
          >
            Search
          </button>
        </div>

        {/* Search Bar (only for Search tab) */}
        {tab === 'search' && (
          <div className="px-6 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none w-full"
              />
            </div>
          </div>
        )}

        {/* Pharmacy List */}
        <div className="px-6 py-4 max-h-64 overflow-y-auto">
          {pharmacies.length === 0 && (
            <div className="text-center text-gray-500 py-8">No pharmacies found.</div>
          )}
          {pharmacies.map(pharmacy => (
            <div
              key={pharmacy.id}
              className={`flex items-center justify-between p-3 rounded-lg border mb-3 transition-colors ${selectedPharmacy?.id === pharmacy.id ? 'border-medical-600 bg-medical-50' : 'border-gray-200 bg-white'}`}
              onClick={() => setSelectedPharmacy(pharmacy)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">{pharmacy.name}</span>
                  {pharmacy.isFavorite && <Star className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="text-sm text-gray-500">{pharmacy.address}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5">Rating: {pharmacy.rating}</span>
                  {pharmacy.services.map((s: string) => (
                    <span key={s} className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">{s}</span>
                  ))}
                </div>
              </div>
              <button
                className={`ml-4 px-3 py-1 rounded-lg text-sm font-medium ${selectedPharmacy?.id === pharmacy.id ? 'bg-medical-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-medical-100'}`}
                onClick={e => { e.stopPropagation(); setSelectedPharmacy(pharmacy); }}
              >
                Send
              </button>
            </div>
          ))}
        </div>

        {/* Order Note */}
        <div className="px-6 pb-2">
          <label className="block text-sm text-gray-700 mb-1">Add a note (optional)</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none"
            rows={2}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="E.g. Please deliver to my address, or any special instructions."
          />
        </div>

        {/* Error */}
        {error && <div className="px-6 pb-2 text-red-500 text-sm">{error}</div>}

        {/* Confirmation Button */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            className="w-full sm:w-auto px-6 py-2 bg-medical-600 text-white rounded-lg font-semibold hover:bg-medical-700 flex items-center justify-center disabled:opacity-60"
            disabled={!selectedPharmacy || loading || success}
            onClick={handleSend}
          >
            {loading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
            Send Prescription
          </button>
          <button
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={onClose}
            disabled={loading || success}
          >
            Cancel
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="px-6 pb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="font-semibold text-green-700 mb-1">Prescription sent successfully!</div>
              <div className="text-gray-600 mb-3">You can track your order in <span className="font-medium">My Orders</span>.</div>
              <button
                className="px-4 py-2 bg-medical-600 text-white rounded-lg font-semibold hover:bg-medical-700"
                onClick={onClose}
              >
                View Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharePrescriptionModal; 