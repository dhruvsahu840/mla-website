"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Newspaper,
  Settings,
  Users,
  LogOut,
  Loader2,
} from "lucide-react";
import { useRequireAdmin, useAdminAuth } from "@/lib/admin-auth";

const navItems = [
  { href: "/admin", label: "डैशबोर्ड", icon: LayoutDashboard, roles: ["ADMIN", "STAFF"] },
  { href: "/admin/grievances", label: "शिकायतें", icon: MessageSquareWarning, roles: ["ADMIN", "STAFF"] },
  { href: "/admin/news", label: "समाचार", icon: Newspaper, roles: ["ADMIN", "STAFF"] },
  { href: "/admin/staff", label: "स्टाफ प्रबंधन", icon: Users, roles: ["ADMIN"] },
  { href: "/admin/settings", label: "सेटिंग्स", icon: Settings, roles: ["ADMIN"] },
];

const roleLabels: Record<string, string> = { ADMIN: "एडमिन / विधायक", STAFF: "स्टाफ" };

export default function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const { admin, loading } = useRequireAdmin();
  const { logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  const visibleNav = navItems.filter((item) => item.roles.includes(admin.role));

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-primary-dark text-white">
        <div className="p-5 border-b border-white/10">
          <p className="font-display font-bold">MLA एडमिन</p>
          <p className="text-xs text-white/60 mt-1">{roleLabels[admin.role]}</p>
        </div>
        <nav className="flex-1 py-4">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-white/10 text-white border-r-4 border-accent" : "text-white/75 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/60 truncate mb-2">{admin.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
          >
            <LogOut size={16} /> लॉगआउट
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-line px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="font-display text-lg md:text-xl font-bold text-ink">{title}</h1>
          <div className="md:hidden flex items-center gap-3">
            <span className="text-xs text-muted">{roleLabels[admin.role]}</span>
            <button onClick={handleLogout} aria-label="लॉगआउट" className="text-ink">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="md:hidden flex overflow-x-auto gap-1 bg-white border-b border-line px-3 py-2">
          {visibleNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full ${
                  active ? "bg-primary text-white" : "bg-primary-light text-primary-dark"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
