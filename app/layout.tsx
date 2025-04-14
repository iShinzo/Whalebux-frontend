import type React from "react";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

export const metadata = {
  title: "WhaleBux",
  description: "Telegram Mini App for WhaleBux",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-950 text-white">
        {/* Ensure ThemeProvider is correctly managing the className */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
