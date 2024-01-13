import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      padding: '24px',
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        magickbase: {
          "primary": "#00CC9B",
          "base-100": "#111",
          "base-200": "#222",
          "neutral": '#111',
        },
      }
    ]
  }
}
export default config
