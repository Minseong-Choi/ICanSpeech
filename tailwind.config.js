/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          speacher: {
            blue: '#4A90E2',
            sky: '#87CEEB',
          },
          kakao: {
            yellow: '#FEE500',
            brown: '#3C1E1E',
          }
        },
        animation: {
          'slide-up': 'slideUp 0.6s ease-out',
        },
        keyframes: {
          slideUp: {
            '0%': { opacity: '0', transform: 'translateY(30px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          }
        }
      },
    },
    plugins: [],
  }