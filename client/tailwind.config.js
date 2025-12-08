/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00d4ff',
        secondary: '#9d4edd',
        accent: '#ff6b6b',
        success: '#4ade80',
        warning: '#fbbf24',
        danger: '#ef4444',
        bg: {
          primary: '#0a0a0f',
          secondary: '#111827',
          card: '#1f2937',
          hover: '#2d3748',
        },
        text: {
          primary: '#f3f4f6',
          secondary: '#9ca3af',
          muted: '#6b7280',
        },
        border: {
          DEFAULT: '#374151',
          light: '#4b5563',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00d4ff 0%, #9d4edd 100%)',
        'gradient-card': 'linear-gradient(145deg, #1f2937 0%, #111827 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      },
    },
  },
  plugins: [],
}
