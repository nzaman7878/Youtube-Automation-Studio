import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        studio: {
          base: 'var(--bg-base)',
          surface: {
            1: 'var(--bg-surface-1)',
            2: 'var(--bg-surface-2)',
            glass: 'var(--bg-surface-glass)',
          },
          accent: {
            red: 'var(--accent-primary)',
            'red-hover': 'var(--accent-primary-hover)',
            'red-glow': 'var(--accent-primary-glow)',
            cyan: 'var(--accent-cyan)',
            amber: 'var(--accent-amber)',
            emerald: 'var(--accent-emerald)',
            purple: 'var(--accent-purple)',
          },
          border: {
            subtle: 'var(--border-subtle)',
            medium: 'var(--border-medium)',
            highlight: 'var(--border-highlight)',
            accent: 'var(--border-accent)',
          },
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            muted: 'var(--text-muted)',
            accent: 'var(--text-accent)',
          },
        },
      },
      boxShadow: {
        'elevation-1': 'var(--shadow-elevation-1)',
        'elevation-2': 'var(--shadow-elevation-2)',
        'elevation-3': 'var(--shadow-elevation-3)',
        'glow-red': 'var(--shadow-glow-red)',
        'glow-cyan': 'var(--shadow-glow-cyan)',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.025em',
        normal: '0',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
