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
        canvas: '#faf9f5',
        ink: {
          DEFAULT: '#141413',
          strong: '#252523',
          body: '#3d3d3a',
          muted: '#6c6a64',
          soft: '#8e8b82',
        },
        surface: {
          soft: '#f5f0e8',
          card: '#efe9de',
          cream: '#e8e0d2',
          dark: '#181715',
          darkElevated: '#252320',
          darkSoft: '#1f1e1b',
        },
        coral: {
          DEFAULT: '#cc785c',
          active: '#a9583e',
          disabled: '#e6dfd8',
          light: '#f7ebe6',
        },
        hairline: {
          DEFAULT: '#e6dfd8',
          soft: '#ebe6df',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
