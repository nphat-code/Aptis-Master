/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#faf8f5',
        ink: {
          DEFAULT: '#141413',
          strong: '#1f242e',
          body: '#333842',
          muted: '#6b6860',
          soft: '#8e8b82',
        },
        navy: {
          DEFAULT: '#162544',
          dark: '#0f1a30',
          deep: '#0a1122',
          light: '#233760',
          soft: '#eef2f9',
        },
        gold: {
          DEFAULT: '#d97706',
          hover: '#b45309',
          light: '#fef3c7',
          warm: '#f59e0b',
        },
        surface: {
          soft: '#f7f4ec',
          card: '#f3efe6',
          cream: '#ede7db',
          dark: '#0f1a30',
          darkElevated: '#182848',
        },
        hairline: {
          DEFAULT: '#e5ded3',
          soft: '#ede8df',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
