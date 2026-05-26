import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        prefix: { bg: '#EBF5FF', text: '#2563EB' },
        root: { bg: '#FEF2F2', text: '#DC2626' },
        suffix: { bg: '#F0FDF4', text: '#16A34A' }
      }
    }
  },
  plugins: []
};

export default config;
