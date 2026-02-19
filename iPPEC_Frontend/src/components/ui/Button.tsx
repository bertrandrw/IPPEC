import React from 'react';
import Spinner from './Spinner';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#0288D1] hover:bg-[#01579B] text-white shadow-sm hover:shadow',
    secondary: 'bg-[#E1F5FE] hover:bg-[#B3E5FC] text-[#0288D1] hover:text-[#01579B]',
    outline: 'border-2 border-[#0288D1] text-[#0288D1] hover:bg-[#E1F5FE]',
    ghost: 'text-[#0288D1] hover:bg-[#E1F5FE]',
    danger: 'bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-sm hover:shadow'
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-5 py-2.5 rounded-xl gap-2'
  };

  return (
    <button
      disabled={loading || disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" light={variant === 'primary' || variant === 'danger'} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />}
        </>
      )}
    </button>
  );
};

export default Button;
