/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-main': '#020617',
        'bg-panel': '#0f172a',
        'bg-card': '#020617',
        'text-main': '#e2e8f0',
        'text-muted': '#94a3b8',
        'accent-red': '#dc2626',
        'accent-red-soft': '#ef4444',
        'accent-blue': '#38bdf8',
        'accent-yellow': '#facc15',

        'trainer-bg': '#0f172a',
        'trainer-border': '#38bdf8',
        'trainer-name': '#facc15',
        'trainer-avatar-border': '#22d3ee',

        'box-border': '#1e293b',
        'box-slot-border': '#334155',
        'box-shiny': '#facc15',
        'box-legendary': '#a855f7',
        'box-mythical': '#ec4899',
      },
      boxShadow: {
        neon: '0 0 12px rgba(56,189,248,0.6), 0 0 24px rgba(56,189,248,0.35)',
        'neon-red': '0 0 12px rgba(239,68,68,0.6), 0 0 24px rgba(239,68,68,0.35)',
        'neon-gold': '0 0 12px rgba(250,204,21,0.6), 0 0 24px rgba(250,204,21,0.35)',
      },
      keyframes: {
        holographic: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'shiny-sparkle': {
          '0%': { transform: 'translate3d(-10%, -10%, 0) scale(0.8)', opacity: '0' },
          '50%': { transform: 'translate3d(20%, 20%, 0) scale(1)', opacity: '0.9' },
          '100%': { transform: 'translate3d(40%, 40%, 0) scale(0.6)', opacity: '0' },
        },
        'legendary-pulse': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(168,85,247,0.55)' },
          '50%': { boxShadow: '0 0 0 14px rgba(168,85,247,0)' },
        },
        'mythical-rainbow': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(180deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        'crt-flicker': {
          '0%': { opacity: '0.94' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.96' },
        },
        'power-on': {
          '0%': { transform: 'scale(0.96)', filter: 'blur(6px)', opacity: '0' },
          '60%': { transform: 'scale(1.02)', filter: 'blur(1px)', opacity: '1' },
          '100%': { transform: 'scale(1)', filter: 'blur(0)', opacity: '1' },
        },
      },
      animation: {
        holographic: 'holographic 6s ease-in-out infinite',
        'shiny-sparkle': 'shiny-sparkle 2.4s ease-in-out infinite',
        'legendary-pulse': 'legendary-pulse 2.2s ease-out infinite',
        'mythical-rainbow': 'mythical-rainbow 3.6s linear infinite',
        'crt-flicker': 'crt-flicker 3s steps(2, jump-both) infinite',
        'power-on': 'power-on 600ms ease-out forwards',
      },
    },
  },
  plugins: [],
};
