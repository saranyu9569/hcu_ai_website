"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = /\/admin\/login(\/|$)/.test(pathname);

  if (isLogin) return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      {/* Offset on mobile for the fixed top bar */}
      <main className="flex-1 min-w-0 overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
