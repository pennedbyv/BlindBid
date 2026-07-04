/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Surface hierarchy ── */
        "surface":                  "#121318",
        "surface-dim":              "#121318",
        "surface-bright":           "#38393e",
        "surface-container-lowest": "#0d0e12",
        "surface-container-low":    "#1a1b20",
        "surface-container":        "#1e1f24",
        "surface-container-high":   "#282a2f",
        "surface-container-highest":"#333539",
        "surface-variant":          "#333539",
        "surface-tint":             "#c8c5cd",

        /* ── Primary ── */
        "primary":                  "#c8c5cd",
        "on-primary":               "#303035",
        "primary-container":        "#0e0e13",
        "on-primary-container":     "#7c7a81",
        "primary-fixed":            "#e4e1e9",
        "primary-fixed-dim":        "#c8c5cd",
        "on-primary-fixed":         "#1b1b20",
        "on-primary-fixed-variant": "#47464c",
        "inverse-primary":          "#5f5e64",

        /* ── Secondary (Gold) ── */
        "secondary":                "#f5be3e",
        "on-secondary":             "#402d00",
        "secondary-container":      "#bf8e00",
        "on-secondary-container":   "#3d2c00",
        "secondary-fixed":          "#ffdfa0",
        "secondary-fixed-dim":      "#f5be3e",
        "on-secondary-fixed":       "#261a00",
        "on-secondary-fixed-variant":"#5c4300",

        /* ── Tertiary ── */
        "tertiary":                 "#c8c5d0",
        "on-tertiary":              "#312f38",
        "tertiary-container":       "#0f0e15",
        "on-tertiary-container":    "#7d7a84",
        "tertiary-fixed":           "#e5e1ec",
        "tertiary-fixed-dim":       "#c8c5d0",
        "on-tertiary-fixed":        "#1c1b23",
        "on-tertiary-fixed-variant":"#47464f",

        /* ── Semantic ── */
        "error":                    "#ffb4ab",
        "on-error":                 "#690005",
        "error-container":          "#93000a",
        "on-error-container":       "#ffdad6",

        /* ── On-surface ── */
        "on-surface":               "#e3e2e8",
        "on-surface-variant":       "#c8c5cb",
        "on-background":            "#e3e2e8",
        "background":               "#0E0E13",
        "inverse-surface":          "#e3e2e8",
        "inverse-on-surface":       "#2f3035",
        "outline":                  "#929095",
        "outline-variant":          "#47464b",

        /* ── Custom aliases ── */
        "gold-accent":              "#D3A01E",
        "charcoal-card":            "#17171F",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg:      "0.5rem",
        xl:      "0.75rem",
        "2xl":   "22px",
        full:    "9999px",
      },
      spacing: {
        "unit":           "8px",
        "gutter":         "24px",
        "margin-desktop": "64px",
        "margin-mobile":  "20px",
        "section-gap":    "120px",
        "container-max":  "1280px",
      },
      fontFamily: {
        "display":   ["Hanken Grotesk", "sans-serif"],
        "headline":  ["Hanken Grotesk", "sans-serif"],
        "body":      ["Inter", "sans-serif"],
        "label":     ["Geist", "sans-serif"],
        "mono":      ["Geist", "monospace"],
      },
      fontSize: {
        "display-lg":        ["64px",  { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg-mobile": ["40px",  { lineHeight: "1.2",  letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-lg":       ["32px",  { lineHeight: "1.3",  fontWeight: "500" }],
        "headline-md":       ["24px",  { lineHeight: "1.4",  fontWeight: "500" }],
        "body-lg":           ["18px",  { lineHeight: "1.6",  fontWeight: "400" }],
        "body-md":           ["16px",  { lineHeight: "1.6",  fontWeight: "400" }],
        "label-md":          ["14px",  { lineHeight: "1.0",  letterSpacing: "0.05em", fontWeight: "500" }],
        "mono-sm":           ["12px",  { lineHeight: "1.4",  fontWeight: "400" }],
      },
      maxWidth: {
        "container": "1280px",
      },
      boxShadow: {
        "ambient":    "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
        "gold-glow":  "0 0 30px rgba(211, 160, 30, 0.15)",
        "gold-strong":"0 0 40px rgba(245, 190, 62, 0.15)",
      },
      animation: {
        "pulse-gold": "pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float":      "float 4s ease-in-out infinite",
        "shimmer":    "shimmer 3s linear infinite",
        "breathing":  "breathing 4s ease-in-out infinite",
        "scanline":   "scan 6s ease-in-out infinite",
      },
      keyframes: {
        "pulse-gold": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
        "float": {
          "0%":   { transform: "translateY(0px) rotate(0deg)" },
          "50%":  { transform: "translateY(-10px) rotate(2deg)" },
          "100%": { transform: "translateY(0px) rotate(0deg)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "breathing": {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0px rgba(245,190,62,0)" },
          "50%":      { transform: "scale(1.02)", boxShadow: "0 0 20px rgba(245,190,62,0.3)" },
        },
        "scan": {
          "0%":   { top: "-10%", opacity: "0" },
          "5%":   { opacity: "0.5" },
          "95%":  { opacity: "0.5" },
          "100%": { top: "110%", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
