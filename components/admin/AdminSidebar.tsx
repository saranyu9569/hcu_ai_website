"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
import {
  User, FileText, Calendar, LogOut, Activity, Users,
  Image, MessageCircle, Info, Star, Handshake,
  LayoutTemplate, BookOpen, Menu, X, LayoutDashboard, School,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminSections = [
  {
    group: "Overview",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    ],
  },
  {
    group: "Content Management",
    items: [
      { name: "About Department", icon: Info, path: "/admin/about-department" },
      { name: "Courses",          icon: BookOpen, path: "/admin/courses" },
      { name: "Programs",         icon: BookOpen, path: "/admin/programs" },
      { name: "Undergraduate",    icon: School, path: "/admin/undergraduate" },
      { name: "Program Highlight",icon: Star, path: "/admin/program-highlight" },
      { name: "News",             icon: FileText, path: "/admin/news" },
      { name: "Events",           icon: Calendar, path: "/admin/events" },
      { name: "Banner",           icon: Image, path: "/admin/banner" },
      { name: "Navbar",           icon: Menu, path: "/admin/navbar" },
      { name: "Footer",           icon: LayoutTemplate, path: "/admin/footer" },
      { name: "Partnership",      icon: Handshake, path: "/admin/partnership" },
      { name: "Quote",            icon: MessageCircle, path: "/admin/quote" },
      { name: "About Section",    icon: Info, path: "/admin/about" },
    ],
  },
  {
    group: "Student & Research",
    items: [
      { name: "Students",         icon: Users, path: "/admin/students" },
      { name: "Project Research", icon: Activity, path: "/admin/project-research" },
    ],
  },
];

interface UserData {
  full_name: string;
  email: string;
  username: string;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.user && setUserData(d.user))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
  };

  // Determine active path — strip locale prefix (e.g. /en/admin/news → /admin/news)
  const activePath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

  const NavContent = () => (
    <>
      {/* Brand */}
      <div className="flex items-center h-16 px-6 border-b border-slate-100 shrink-0">
        <span className="font-bold text-base text-slate-800 tracking-tight">HCU Admin</span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {adminSections.map(section => (
          <Fragment key={section.group}>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-1.5">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = activePath === item.path || activePath.startsWith(item.path + "/");
                  return (
                    <button
                      key={item.name}
                      onClick={() => { router.push(item.path); setOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </Fragment>
        ))}
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          {userData ? (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{userData.full_name}</p>
              <p className="text-xs text-slate-400 truncate">{userData.email}</p>
            </div>
          ) : (
            <div className="flex-1 space-y-1">
              <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-2.5 w-32 bg-slate-100 rounded animate-pulse" />
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200 h-screen sticky top-0 z-30 shrink-0">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center h-14 px-4 bg-white border-b border-slate-200">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="ml-3 font-bold text-slate-800 text-sm">HCU Admin</span>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 flex flex-col w-72 h-full bg-white border-r border-slate-200 shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
        <NavContent />
      </aside>
    </>
  );
}
