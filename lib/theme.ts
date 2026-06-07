// ═══════════════════════════════════════
// LaporAja Mobile — Design Tokens
// Matches web design system 1:1
// ═══════════════════════════════════════

export const colors = {
  // Surfaces (60%)
  cream: {
    50: "#FCFBF8",
    100: "#F8F6F0",
    200: "#F1EDE2",
    300: "#E8E4D9",
  },

  // Brand (30%)
  brand: {
    50: "#CCFBF1",
    100: "#99F6E4",
    200: "#5EEAD4",
    300: "#14B8A6",
    400: "#0D9488",
    500: "#0F766E",
    600: "#115E59",
    700: "#134E4A",
  },

  // Accent (10%)
  accent: {
    amber: "#F59E0B",
    orange: "#EA580C",
    gold: "#FCD34D",
  },

  // Status
  status: {
    pending: { bg: "#F1EDE2", text: "#5F5E5A" },
    accepted: { bg: "#DBEAFE", text: "#1E40AF" },
    inProgress: { bg: "#FEF3C7", text: "#92400E" },
    resolved: { bg: "#D1FAE5", text: "#065F46" },
    rejected: { bg: "#FEE2E2", text: "#991B1B" },
  },

  // Priority
  priority: {
    low: { bg: "#CCFBF1", text: "#0F766E" },
    medium: { bg: "#FEF3C7", text: "#92400E" },
    high: { bg: "#FEE2E2", text: "#991B1B" },
  },

  // Neutral
  text: {
    primary: "#111827",
    secondary: "#374151",
    muted: "#6B7280",
    placeholder: "#9CA3AF",
  },

  white: "#FFFFFF",
  black: "#111827",
  danger: "#991B1B",
  dangerBg: "#FEE2E2",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 11,
  base: 13,
  md: 14,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
} as const;

export const fontFamily = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
} as const;

export const shadows = {
  sm: {
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 5,
  },
  amber: {
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  brand: {
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
} as const;
