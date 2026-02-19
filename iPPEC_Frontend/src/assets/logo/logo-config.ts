// Logo Configuration for iPPEC System
// Update this file when you receive your new logo from designers

// Logo file paths (updated to use your logo.png file)
export const LOGO_PATHS = {
  // Main logo files (using your designer's logo.png)
  MAIN_LOGO: '/src/assets/logo/logo.png',                 // Main logo PNG
  MAIN_LOGO_PNG: '/src/assets/logo/logo.png',             // Main logo PNG
  LOGO_ICON: '/src/assets/logo/logo.png',                 // Using same file as icon
  LOGO_ICON_PNG: '/src/assets/logo/logo.png',             // Using same file as icon
  FAVICON: '/src/assets/logo/logo.png',                   // Using same file as favicon
  
  // All sizes point to your logo.png until you provide more variants
  LOGO_SMALL: '/src/assets/logo/logo.png',
  LOGO_MEDIUM: '/src/assets/logo/logo.png',
  LOGO_LARGE: '/src/assets/logo/logo.png',
};

// Logo configuration
export const LOGO_CONFIG = {
  // Brand information
  BRAND_NAME: 'iPPEC',
  BRAND_TAGLINE: 'Health Services Made Easy',
  SECONDARY_TAGLINE: 'Smart Prescriptions, Simplified',
  
  // Default colors (update if designers provide specific colors)
  COLORS: {
    PRIMARY_BLUE: '#1E88E5',
    SECONDARY_BLUE: '#2196F3', 
    MEDICAL_GREEN: '#4CAF50',
    TEXT_DARK: '#212121',
    TEXT_GRAY: '#666666',
  },
  
  // Logo usage settings
  USE_DESIGNED_LOGO: true, // Set to true when you add the designer's logo
  FALLBACK_TO_CUSTOM: true, // Use custom logo when designed logo not available
};

// Instructions for updating:
// 1. Place your designer's logo files in src/assets/logo/
// 2. Update LOGO_PATHS above to match your file names
// 3. Set USE_DESIGNED_LOGO to true
// 4. Update colors in COLORS object if needed
// 5. The entire system will automatically use your new logo!