import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        'on-background': 'var(--on-background)',
        surface: 'var(--surface)',
        'on-surface': 'var(--on-surface)',
        'surface-variant': 'var(--surface-variant)',
        'on-surface-variant': 'var(--on-surface-variant)',
        'surface-container-lowest': 'var(--surface-container-lowest)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container': 'var(--surface-container)',
        'surface-container-high': 'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        'surface-bright': 'var(--surface-bright)',
        'surface-dim': 'var(--surface-dim)',
        primary: 'var(--primary)',
        'on-primary': 'var(--on-primary)',
        'primary-container': 'var(--primary-container)',
        'on-primary-container': 'var(--on-primary-container)',
        secondary: 'var(--secondary)',
        'on-secondary': 'var(--on-secondary)',
        'secondary-container': 'var(--secondary-container)',
        'on-secondary-container': 'var(--on-secondary-container)',
        tertiary: 'var(--tertiary)',
        'on-tertiary': 'var(--on-tertiary)',
        'tertiary-container': 'var(--tertiary-container)',
        'on-tertiary-container': 'var(--on-tertiary-container)',
        error: 'var(--error)',
        'on-error': 'var(--on-error)',
        'error-container': 'var(--error-container)',
        'on-error-container': 'var(--on-error-container)',
        outline: 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
        'action-indigo': 'var(--action-indigo)',
        'vibrant-cyan': 'var(--vibrant-cyan)',
        'brand-orange': 'var(--brand-orange)',
        'secondary-fixed': 'var(--secondary-fixed)',
        'on-secondary-fixed': 'var(--on-secondary-fixed)',
        'tertiary-fixed': 'var(--tertiary-fixed)',
        'on-tertiary-fixed': 'var(--on-tertiary-fixed)',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      },
      spacing: {
        'container-max': '1440px',
        unit: '4px',
        'margin-mobile': '16px',
        'gutter-desktop': '24px',
        'gutter-mobile': '16px',
        'margin-desktop': '40px'
      },
      fontFamily: {
        'body-lg': ['Inter', 'sans-serif'],
        'headline-lg': ['Hanken Grotesk', 'sans-serif'],
        'label-sm': ['Inter', 'sans-serif'],
        'headline-lg-mobile': ['Hanken Grotesk', 'sans-serif'],
        'headline-md': ['Hanken Grotesk', 'sans-serif'],
        'headline-xl': ['Hanken Grotesk', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif'],
        'label-md': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif']
      },
      fontSize: {
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '500' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }]
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' }
        }
      },
      animation: {
        'scan': 'scan 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};
export default config;
