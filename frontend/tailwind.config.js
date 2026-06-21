/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF8F0',
          100: '#FBEED7',
          200: '#F7DCB0',
          300: '#F2C47F',
          400: '#ECAC4D',
          500: '#E89B1A',
          600: '#D8890F',
          700: '#BD750B',
          800: '#9D5F09',
          900: '#7A4807',
        },
        secondary: {
          50: '#F2F9F2',
          100: '#E1EFE1',
          200: '#C3DEC3',
          300: '#9ABF9A',
          400: '#6B9E6B',
          500: '#2F7D32',
          600: '#256628',
          700: '#1D4E1F',
          800: '#153716',
          900: '#0C1F0D',
        },
        brandBg: '#f5f8f4',
        brandHeading: '#1c1c18',
        brandBody: '#6b8a78',
        brandMuted: '#6b8a78',
        senja: {
          dark: '#0f3d2b',
          primary: '#1a5c38',
          accent: '#d4a830',
          bg: '#f5f8f4',
          surface: '#ffffff',
          text: {
            primary: '#1c1c18',
            secondary: '#6b8a78'
          },
          danger: '#dc2626',
          dangerLight: '#fdecea'
        },
        finbisku: {
          gold: {
            50: '#FFF8EE',
            100: '#FDEFD8',
            200: '#F9D89A',
            300: '#F5B84A',
            400: '#d4a830', // Updated to Accent Gold
            500: '#C47A0C',
            600: '#8F540A'
          },
          green: {
            100: '#EEF6F1',
            200: '#C6E5CF',
            300: '#7DC49B',
            400: '#3A9E6E',
            500: '#1F7A52',
            600: '#155A3D'
          },
          neutral: {
            50: '#FAFAF8',
            100: '#F4F2ED',
            200: '#E8E5DD',
            300: '#D1CEC5',
            400: '#A8A49A',
            500: '#767268',
            600: '#504D46',
            700: '#302F2A',
            800: '#1C1B18'
          }
        }
      },
      backgroundImage: {
        'senja-gradient': 'linear-gradient(160deg, #d4a830 0%, #8b6820 35%, #1a5c38 70%, #0f3d2b 100%)'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
        input: '10px'
      }
    },
  },
  plugins: [],
}
