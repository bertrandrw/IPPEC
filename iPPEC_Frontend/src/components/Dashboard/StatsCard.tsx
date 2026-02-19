import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'medical';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color,
  className = ''
}) => {
  const colorClasses = {
    primary: 'bg-[#2196F3] text-white',
    secondary: 'bg-[#1976D2] text-white',
    accent: 'bg-[#E6F2FF] text-[#2196F3]',
    success: 'bg-[#4CAF50] text-white',
    warning: 'bg-[#FF5252] text-white',
    error: 'bg-[#FF5252] text-white',
    medical: 'bg-[#2196F3] text-white'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-3 lg:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-xl lg:text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs lg:text-sm mt-1 lg:mt-2 ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? '+' : ''}{change}
            </p>
          )}
        </div>
        <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center flex-shrink-0 ml-2 lg:ml-0`}>
          <Icon className="w-4 h-4 lg:w-6 lg:h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;