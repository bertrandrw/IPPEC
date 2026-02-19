import React from 'react';
import { LOGO_CONFIG, LOGO_PATHS } from '../../assets/logo/logo-config';

interface iPPECLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

const iPPECLogo: React.FC<iPPECLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  showTagline = false,
  className = '',
  theme = 'light'
}) => {
  const sizeClasses = {
    sm: {
      container: 'w-8 h-8',
      cross: 'w-3 h-3',
      crossH: 'w-2 h-0.5',
      crossV: 'w-0.5 h-2',
      text: 'text-lg',
      tagline: 'text-xs',
      rx: 'text-sm'
    },
    md: {
      container: 'w-12 h-12',
      cross: 'w-5 h-5',
      crossH: 'w-3 h-1',
      crossV: 'w-1 h-3',
      text: 'text-2xl',
      tagline: 'text-xs',
      rx: 'text-lg'
    },
    lg: {
      container: 'w-16 h-16',
      cross: 'w-7 h-7',
      crossH: 'w-4 h-1.5',
      crossV: 'w-1.5 h-4',
      text: 'text-3xl',
      tagline: 'text-sm',
      rx: 'text-2xl'
    },
    xl: {
      container: 'w-20 h-20',
      cross: 'w-8 h-8',
      crossH: 'w-5 h-1.5',
      crossV: 'w-1.5 h-5',
      text: 'text-4xl',
      tagline: 'text-base',
      rx: 'text-3xl'
    }
  };

  const sizes = sizeClasses[size];

  // Check if designer's logo should be used
  const useDesignedLogo = LOGO_CONFIG.USE_DESIGNED_LOGO;
  
  return (
    <div className={`flex items-center ${className}`}>
      {/* iPPEC Logo */}
      <div className="relative">
        {useDesignedLogo ? (
          /* Designer's Logo - Will be used when available */
          <img 
            src={LOGO_PATHS.LOGO_ICON} 
            alt="iPPEC Logo" 
            className={`${sizes.container} object-contain`}
            onError={() => {
              console.log('Designer logo not found, using fallback');
              // Fallback handled by the condition below
            }}
          />
        ) : (
          /* Custom Logo - Current temporary logo */
          <>
            {/* Blue rounded square with Rx - matching the exact image design */}
            <div className={`${sizes.container} rounded-2xl flex items-center justify-center shadow-lg`} 
                 style={{backgroundColor: LOGO_CONFIG.COLORS.PRIMARY_BLUE}}>
              <span className={`text-white font-bold ${sizes.rx}`}>Rx</span>
            </div>
            {/* Green medical cross at top-right - proper cross shape */}
            <div className={`absolute -top-1 -right-1 ${sizes.cross} flex items-center justify-center`}
                 style={{backgroundColor: LOGO_CONFIG.COLORS.MEDICAL_GREEN}}>
              <div className={`${sizes.crossH} bg-white absolute`}></div>
              <div className={`${sizes.crossV} bg-white absolute`}></div>
            </div>
          </>
        )}
      </div>
      
      {/* Text Section */}
      {showText && (
        <div className="ml-3">
          <div className={`font-bold ${sizes.text}`} 
               style={{color: theme === 'dark' ? 'white' : LOGO_CONFIG.COLORS.TEXT_DARK}}>
            {LOGO_CONFIG.BRAND_NAME}
          </div>
          {showTagline && (
            <div className={`font-semibold ${sizes.tagline}`}
                 style={{color: theme === 'dark' ? '#E3F2FD' : LOGO_CONFIG.COLORS.PRIMARY_BLUE}}>
              {LOGO_CONFIG.BRAND_TAGLINE}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default iPPECLogo;