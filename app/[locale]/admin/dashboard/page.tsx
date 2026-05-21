"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText, Calendar, Activity, Users, TrendingUp,
} from "lucide-react";
import type { UserData } from "@/lib";

export default function AdminDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsCount, setNewsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);

  useEffect(() => {
    fetch("/api/admin/me")
      .then(r => {
        if (!r.ok) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then(d => d?.user && setUserData(d.user))
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    fetch("/api/news")
      .then(r => r.ok ? r.json() : [])
      .then(d => setNewsCount(Array.isArray(d) ? d.length : 0))
      .catch(() => {});
    fetch("/api/events")
      .then(r => r.ok ? r.json() : [])
      .then(d => setEventsCount(Array.isArray(d) ? d.length : 0))
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800 mx-auto" />
          <p className="mt-4 text-slate-500 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
          Welcome back, {userData.full_name}
        </h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Manage all website content, student data, and system settings from the sidebar on the left.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">3</div>
            <p className="text-xs text-slate-400">Active administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">News Articles</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{newsCount}</div>
            <p className="text-xs text-slate-400">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">Events</CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{eventsCount}</div>
            <p className="text-xs text-slate-400">Upcoming events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-slate-400">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">System initialized</p>
              <p className="text-xs text-slate-400">Database and admin panel ready</p>
            </div>
            <span className="text-xs text-slate-400 shrink-0">Just now</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-slate-400 rounded-full shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">Admin login</p>
              <p className="text-xs text-slate-400">User {userData.username} logged in</p>
            </div>
            <span className="text-xs text-slate-400 shrink-0">Just now</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
