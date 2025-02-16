import type { Config } from "tailwindcss"

export default <Partial<Config>>{
  content: ["./src/**/*.{html,js,vue,ts}"],
  mode: "jit",
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    screens: {
      'xs': '375px',
      // => @media (min-width: 375px) { ... }

      'sm': '480px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        body: "rgb(var(--body) / <alpha-value>)",
        main: "rgb(var(--main) / <alpha-value>)",
        brand: {
          'body': "rgb(var(--brand-body) / <alpha-value>)",
          'border': "rgb(var(--brand-border) / <alpha-value>)",
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          150: "rgb(var(--brand-150) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          250: "rgb(var(--brand-250) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          350: "rgb(var(--brand-350) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          850: "rgb(var(--brand-850) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
          950: "rgb(var(--brand-950) / <alpha-value>)",
        },
      },
    },
  }
}