import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    if (duration > 0) {
      // Progress bar animation
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      // Auto close timer
      const closeTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);

      return () => {
        clearTimeout(showTimer);
        clearInterval(progressTimer);
        clearTimeout(closeTimer);
      };
    }

    return () => clearTimeout(showTimer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 shadow-green-100';
      case 'error':
        return 'bg-red-50 border-red-200 shadow-red-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 shadow-yellow-100';
      case 'info':
        return 'bg-blue-50 border-blue-200 shadow-blue-100';
      default:
        return 'bg-blue-50 border-blue-200 shadow-blue-100';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-blue-800';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-400';
      case 'error':
        return 'bg-red-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'info':
        return 'bg-blue-400';
      default:
        return 'bg-blue-400';
    }
  };

  return (
    <div 
      className={`
        min-w-[400px] max-w-md w-full 
        ${getBackgroundColor()} 
        border-2 rounded-xl shadow-2xl 
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'}
      `}
    >
      {/* Progress bar */}
      {duration > 0 && (
        <div className="w-full h-1 bg-gray-200 rounded-t-xl overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {/* Toast content */}
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold leading-relaxed ${getTextColor()}`}>
              {message}
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleClose}
              className={`
                inline-flex items-center justify-center w-8 h-8 rounded-full
                ${getTextColor()} hover:bg-white hover:bg-opacity-50 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
                transition-colors duration-200
              `}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;