import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/screens/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        obsidian: {
          900: '#070709', // Deepest root canvas
          800: '#0D0D12', // Surface header, docks, modal backdrop
          700: '#16161F', // Card surface
          600: '#22222E', // Hover & input states
        },
        champagne: {
          400: '#E5C478', // Subtle highlight & secondary gold
          500: '#D4AF37', // Brand Champagne Gold
          600: '#AA8A22', // Deep gold border & active pressed state
        },
        emeraldStatus: '#10B981', // Compliance passed, live Qloo verified
        crimsonAlert: '#EF4444',  // Taboo violation, budget breach
        amberCaution: '#F59E0B',  // Offline fallback, advisory note
        glass: {
          fill: 'rgba(22, 22, 31, 0.75)',
          border: 'rgba(255, 255, 255, 0.06)',
          specular: 'rgba(255, 255, 255, 0.12)',
        },
      },
      boxShadow: {
        'luxury-card': '0 12px 36px -8px rgba(0, 0, 0, 0.85)',
        'luxury-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'champagne-glow': '0 0 28px rgba(212, 175, 55, 0.35)',
        'champagne-glow-lg': '0 0 45px rgba(212, 175, 55, 0.55)',
        'emerald-glow': '0 0 25px rgba(16, 185, 129, 0.35)',
        'crimson-glow': '0 0 25px rgba(239, 68, 68, 0.35)',
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