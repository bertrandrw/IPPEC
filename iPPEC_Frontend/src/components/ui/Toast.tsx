import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[#4CAF50]" />,
    error: <XCircle className="w-5 h-5 text-[#D32F2F]" />,
    warning: <AlertCircle className="w-5 h-5 text-[#ED6C02]" />,
    info: <Info className="w-5 h-5 text-[#0288D1]" />
  };

  const backgrounds = {
    success: 'bg-[#E8F5E9] border-[#4CAF50]/20',
    error: 'bg-[#FFEBEE] border-[#D32F2F]/20',
    warning: 'bg-[#FFF3E0] border-[#ED6C02]/20',
    info: 'bg-[#E1F5FE] border-[#0288D1]/20'
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${backgrounds[type]} shadow-sm`}>
      <div className="flex items-center space-x-3">
        {icons[type]}
        <p className="text-sm font-medium text-slate-700">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  );
};

export default Toast;
