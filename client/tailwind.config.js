/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        jarvis: {
          bg: '#02040a',
          surface: '#0c0e14',
          border: '#1a1f2e',
          cyan: '#00d4ff',
          purple: '#7c3aed',
          muted: '#4a5568',
        },
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spin-reverse 5s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
