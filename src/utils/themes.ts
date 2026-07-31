import { createTheme } from "@mui/material";

const buildTheme = (options: {
  mode: "light" | "dark";
  primary: string;
  secondary: string;
  backgroundDefault: string;
  backgroundPaper: string;
  textPrimary: string;
  textSecondary: string;
  headerSurface: string;
  headerText: string;
}) =>
  createTheme({
    palette: {
      mode: options.mode,
      primary: {
        main: options.primary
      },
      secondary: {
        main: options.secondary
      },
      background: {
        default: options.backgroundDefault,
        paper: options.backgroundPaper
      },
      text: {
        primary: options.textPrimary,
        secondary: options.textSecondary
      }
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: options.headerSurface,
            color: options.headerText,
            borderBottom: `1px solid ${options.mode === "light" ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.12)"}`
          }
        }
      }
    }
  });

export const darkTheme = buildTheme({
  mode: "dark",
  primary: "#1976d2",
  secondary: "#9c27b0",
  backgroundDefault: "#080d18",
  backgroundPaper: "#111b2f",
  textPrimary: "#f8fafc",
  textSecondary: "#cbd5e1",
  headerSurface: "#13233f",
  headerText: "#f8fafc"
});

export const lightTheme = buildTheme({
  mode: "light",
  primary: "#1976d2",
  secondary: "#9c27b0",
  backgroundDefault: "#e7eefb",
  backgroundPaper: "#ffffff",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  headerSurface: "#1d4ed8",
  headerText: "#f8fafc"
});

export const airyTheme = buildTheme({
  mode: "light",
  primary: "#4f46e5",
  secondary: "#8b5cf6",
  backgroundDefault: "#f8fafc",
  backgroundPaper: "#ffffff",
  textPrimary: "#111827",
  textSecondary: "#4b5563",
  headerSurface: "#4338ca",
  headerText: "#f8fafc"
});

export const slateTheme = buildTheme({
  mode: "light",
  primary: "#2563eb",
  secondary: "#0f766e",
  backgroundDefault: "#f3f4f6",
  backgroundPaper: "#f9fafb",
  textPrimary: "#111827",
  textSecondary: "#4b5563",
  headerSurface: "#1e3a8a",
  headerText: "#f8fafc"
});

export const duskTheme = buildTheme({
  mode: "dark",
  primary: "#60a5fa",
  secondary: "#a78bfa",
  backgroundDefault: "#0f172a",
  backgroundPaper: "#111827",
  textPrimary: "#f8fafc",
  textSecondary: "#cbd5e1",
  headerSurface: "#172554",
  headerText: "#f8fafc"
});

export const forestTheme = buildTheme({
  mode: "light",
  primary: "#15803d",
  secondary: "#0f766e",
  backgroundDefault: "#f0fdf4",
  backgroundPaper: "#ffffff",
  textPrimary: "#14532d",
  textSecondary: "#4d7c59",
  headerSurface: "#166534",
  headerText: "#f8fafc"
});

export const themes = [
  { name: "Dark Mode", theme: darkTheme },
  { name: "Blue Light", theme: lightTheme },
  { name: "Airy White", theme: airyTheme },
  { name: "Slate", theme: slateTheme },
  { name: "Dusk", theme: duskTheme },
  { name: "Forest", theme: forestTheme }
];

