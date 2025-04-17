import type React from "react";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata = {
  title: "WhaleBux",
  description: "Telegram Mini App for WhaleBux",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-950 text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}