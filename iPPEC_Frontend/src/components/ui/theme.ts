export const theme = {
  colors: {
    primary: {
      50: '#E1F5FE',
      100: '#B3E5FC',
      200: '#81D4FA',
      300: '#4FC3F7',
      400: '#29B6F6',
      500: '#0288D1',  // main
      600: '#0277BD',
      700: '#01579B',  // dark
      800: '#014377',
      900: '#013054',
      gradient: {
        default: 'linear-gradient(135deg, #0288D1, #01579B)',
        accent: 'linear-gradient(135deg, #29B6F6, #0288D1)',
        subtle: 'linear-gradient(135deg, #E1F5FE, #B3E5FC)'
      }
    },
    secondary: {
      50: '#E8EAF6',
      100: '#C5CAE9',
      200: '#9FA8DA',
      300: '#7986CB',
      400: '#5C6BC0',  // main
      500: '#3F51B5',
      600: '#3949AB',
      700: '#303F9F',
      800: '#283593',
      900: '#1A237E'
    },
    slate: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A'
    },
    success: {
      light: '#4CAF50',
      main: '#2E7D32',
      dark: '#1B5E20',
      contrast: '#FFFFFF',
      bg: '#E8F5E9',
      border: '#A5D6A7'
    },
    warning: {
      light: '#FF9800',
      main: '#ED6C02',
      dark: '#E65100',
      contrast: '#FFFFFF',
      bg: '#FFF3E0',
      border: '#FFCC80'
    },
    error: {
      light: '#EF5350',
      main: '#D32F2F',
      dark: '#B71C1C',
      contrast: '#FFFFFF',
      bg: '#FFEBEE',
      border: '#EF9A9A'
    },
    info: {
      light: '#03A9F4',
      main: '#0288D1',
      dark: '#01579B',
      contrast: '#FFFFFF',
      bg: '#E1F5FE',
      border: '#81D4FA'
    }
  },
  shadows: {
    xs: '0 1px 2px rgba(15, 23, 42, 0.05)',
    sm: '0 1px 3px rgba(15, 23, 42, 0.1), 0 1px 2px rgba(15, 23, 42, 0.06)',
    md: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',
    lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
    xl: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
    '2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
    colored: {
      sm: '0 2px 4px rgba(2, 136, 209, 0.12)',
      md: '0 4px 8px rgba(2, 136, 209, 0.15)',
      lg: '0 8px 16px rgba(2, 136, 209, 0.18)'
    },
    focus: '0 0 0 3px rgba(2, 136, 209, 0.15)'
  },
  borderRadius: {
    xs: '0.25rem',    // 4px
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem'   // 24px
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem'     // 48px
  },
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  typography: {
    family: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    },
    weight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    size: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem' // 30px
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    }
  },
  animation: {
    durations: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms'
    },
    timings: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  }
};
