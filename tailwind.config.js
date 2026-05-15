/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        chart: { '1': 'hsl(var(--chart-1))', '2': 'hsl(var(--chart-2))', '3': 'hsl(var(--chart-3))', '4': 'hsl(var(--chart-4))', '5': 'hsl(var(--chart-5))' },
        // ResQNet palette
        bg: { DEFAULT: '#0a0a0f', surface: '#0f0f1a', elevated: '#13131f' },
        tactical: {
          red: '#ef4444',
          orange: '#f97316',
          green: '#22c55e',
          blue: '#3b82f6',
          muted: '#94a3b8',
          border: '#1a1a2e',
        }
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'pulse-glow': { '0%,100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.55)' }, '50%': { boxShadow: '0 0 0 18px rgba(239,68,68,0)' } },
        'radar-sweep': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'shimmer': { '100%': { transform: 'translateX(100%)' } },
        'ticker': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'grid-drift': { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '60px 60px' } },
        'float': { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2.2s ease-out infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'ticker': 'ticker 40s linear infinite',
        'grid-drift': 'grid-drift 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    { pattern: /(bg|text|border|from|to|via|ring|shadow|hover:bg|hover:text|hover:border)-(red|orange|emerald|blue|purple|yellow|teal)-(300|400|500|600)(\/(5|10|20|30|40|50))?/ },
    { pattern: /text-(red|orange|emerald|blue|purple|yellow|teal)-(300|400|500)/ },
    { pattern: /from-(red|orange|emerald|blue|purple|yellow|teal)-(300|400|500)/ },
    { pattern: /to-(red|orange|emerald|blue|purple|yellow|teal)-(300|400|500)/ },
    { pattern: /bg-(red|orange|emerald|blue|purple|yellow|teal)-500\/(5|10|20|30|40)/ },
    { pattern: /border-(red|orange|emerald|blue|purple|yellow|teal)-500\/(20|30|40|50)/ },
  ],
}
