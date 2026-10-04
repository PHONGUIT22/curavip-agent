import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/screens/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
      },
      fontFamily: {
        sans: ["'Google Sans'", "'Google Sans Text'", 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: '#F8F6F0',
        pine: {
          900: '#0F2620',
          800: '#14342B', // Deep Pine / Forest Green for Sidebar
          700: '#183D33', // Deep Pine action buttons & headers
          600: '#224F43', // Hover state
          500: '#1D5A4A', // Jade / Emerald accent
          200: '#C8DCD1',
          100: '#EDF4F0', // Pale mint hover / soft badge
          50: '#F4F9F6',
        },
        ink: {
          900: '#161A18', // Primary deep ink text
          700: '#323835', // Body charcoal text
          500: '#6B736D', // Muted warm grey metadata
          400: '#8C938E', // Placeholder
          200: '#E5E0D6', // Warm hairline border
          100: '#EBE6DD', // Divider hairline
        },
        warmBeige: {
          canvas: '#F8F6F0',
          surface: '#FAF8F5',
          subtle: '#F4F1EA',
          border: '#E5E0D6',
          borderLight: '#EBE6DD',
          card: '#FFFFFF',
        },
        amberAccent: {
          DEFAULT: '#9A7228',
          light: '#FBF5E8',
          border: '#E8D5AF',
        },
        emeraldStatus: '#1D5A4A',
        crimsonAlert: '#C53030',
        amberCaution: '#B45309',
        // Retain legacy aliases for backward safety
        obsidian: {
          900: '#F8F6F0',
          800: '#FAF8F5',
          700: '#FFFFFF',
          600: '#F4F1EA',
        },
        champagne: {
          400: '#9A7228',
          500: '#183D33',
          600: '#14342B',
        },
      },
      boxShadow: {
        'warm-card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'warm-hover': '0 4px 12px rgba(20, 52, 43, 0.06)',
      },
      animation: {
        'champagne-pulse': 'champagnePulse 2.8s ease-in-out infinite',
        'gold-shimmer': 'goldShimmer 2.2s linear infinite',
        'fade-slide': 'fadeSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        champagnePulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleY(1)' },
          '50%': { opacity: '0.85', transform: 'scaleY(1.3)' },
        },
        goldShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;