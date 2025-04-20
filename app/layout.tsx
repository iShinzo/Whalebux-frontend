import type React from "react";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { SidebarProvider, Sidebar, useSidebar, MobileSidebar } from "../components/ui/sidebar";
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

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  return (
    <aside className="h-screen w-56 bg-black border-r border-gray-800 flex flex-col py-6 px-2">
      <div className="mb-8 flex items-center justify-center">
        <img src="/placeholder-logo.png" alt="WhaleBux Logo" className="h-10 w-10 mr-2" />
        <span className="text-2xl font-bold text-white tracking-wide">WhaleBux</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors text-lg font-medium ${pathname === item.href ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                onClick={onNavigate}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8 text-center text-gray-600 text-xs">© {new Date().getFullYear()} WhaleBux</div>
    </aside>
  );
}

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
            <MobileSidebar renderNav={closeDrawer => <SidebarNav onNavigate={closeDrawer} />} />
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