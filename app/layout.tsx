import type React from "react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { SidebarProvider, Sidebar, useSidebar, MobileSidebar } from "../components/ui/sidebar";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { useIsMobile } from "../hooks/use-mobile";
import "../styles/globals.css";

const navItems = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Mining", href: "/mining", icon: "⛏️" },
  { name: "NFT", href: "/nft", icon: "🖼️" },
  { name: "Swap", href: "/swap", icon: "🔄" },
  { name: "Tasks", href: "/tasks", icon: "📝" },
  { name: "Friends", href: "/friends", icon: "👥" },
  { name: "Daily Streak", href: "/daily-streak", icon: "🔥" },
  { name: "Boost", href: "/boost", icon: "⚡" },
];

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
      <body className="min-h-screen bg-black text-white flex">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* Mobile Sidebar */}
          <div className="md:hidden">
            <MobileSidebar />
          </div>
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <SidebarNav />
          </div>
          <main className="flex-1 min-h-screen bg-black px-2 py-4 overflow-y-auto w-full max-w-full overflow-x-hidden">
            <header className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold tracking-wide">WhaleBux Mining App</h1>
              <div className="flex items-center space-x-4">
                <img src="/placeholder-user.jpg" alt="User" className="h-10 w-10 rounded-full border-2 border-gray-700" />
                <span className="text-lg font-semibold">User</span>
              </div>
            </header>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}