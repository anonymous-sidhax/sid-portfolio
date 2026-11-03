"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider 
      attribute="data-theme" 
      defaultTheme="dark"
      themes={['light', 'dark', 'yellow', 'green']}
    >
      {children}
    </NextThemesProvider>
  );
}