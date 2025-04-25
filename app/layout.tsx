import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { SidebarProvider, Sidebar, useSidebar, MobileSidebar } from "../components/ui/sidebar";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { useIsMobile } from "../hooks/use-mobile";
import "../styles/globals.css";
import { ClientHeader } from "../components/ui/ClientHeader";

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
          {/* Responsive main container for 9:16 aspect ratio on mobile */}
          <main className="flex-1 flex justify-center items-center min-h-screen bg-black px-2 py-4 overflow-y-auto w-full max-w-full overflow-x-hidden">
            <div className="w-full h-full max-w-[430px] aspect-[9/16] bg-black rounded-lg shadow-lg flex flex-col">
              <ClientHeader />
              <div className="flex-1 flex flex-col min-h-0">
                {children}
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}