import type { Config } from "tailwindcss"

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: "",
  theme: {

    extend: {
      
      colors: {
        "white": '#fefefe',
        "black": '#010101',
        "white-soft": "#f6f6f6",
        'primary-main': '#6bc84d',
        'primary-surface': '#EAFFE3',
        'primary-bold': '#4BA42E',
        'secondary-surface': '#fee2ae',
        'secondary-main': '#ffbd41',
        'secondary-bold': '#EBA31B',
        "tertiary": '#ba4aa5',
        "border": "hsl(var(--border))",
        "input": "hsl(var(--input))",
        "ring": "hsl(var(--ring))",
        "background": "hsl(var(--background))",
        "foreground": "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      options: {
        safelist: ['confirm-button-class', 'cancel-button-class']
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        'slide-in': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        'slide-out': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-out': 'slide-out 0.3s ease-in',
      },

      textShadow: {
        border: '2px 2px 0 #A35903',
      },
      fontFamily: {
        helvetica: ['Helvetica', 'sans-serif'],
        'mochiy-pop-one': ['Mochiy Pop One', 'sans-serif'],
      },
      boxShadow: {
        "shadow-top": "0px 6px 4px 0px rgba(91,91,91,0.3)",
        "card-shadow": "0px 0px 4px 4px rgba(198,198,198,0.3)",
        "bottom-shadow": "0px -11px 4px 0px rgba(220,220,220,0.2)"
       },
      screens: {
        'xs': '320px',
        '2xl': '1440px'
      },
    },
  },
  variants: {
    extend: {
      fontSize: ['responsive', 'hover', 'focus', 'placeholder'],
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config