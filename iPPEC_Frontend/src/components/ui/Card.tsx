import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  noPadding?: boolean;
  variant?: 'default' | 'hover' | 'interactive';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  icon: Icon,
  action,
  className = '',
  noPadding = false,
  variant = 'default'
}) => {
  const variants = {
    default: 'border-slate-200',
    hover: 'border-slate-200 hover:border-[#0288D1] hover:shadow-lg transition-all duration-200',
    interactive: 'border-slate-200 hover:border-[#0288D1] hover:shadow-lg cursor-pointer transition-all duration-200'
  };

  return (
    <div className={`bg-white rounded-xl border ${variants[variant]} ${className}`}>
      {(title || description || action) && (
        <div className="flex items-start justify-between p-4 border-b border-slate-200">
          <div className="flex items-start space-x-3">
            {Icon && (
              <div className="p-2 bg-[#E1F5FE] text-[#0288D1] rounded-lg">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
              {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
