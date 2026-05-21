"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 overflow-hidden">

        {/* Back to main page — top-left */}
        <div className="absolute top-8 left-8 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-300 hover:text-white text-sm font-medium transition-colors group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-teal-500/50 group-hover:border-white/60 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </span>
            Back to main site
          </Link>
        </div>

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-cyan-400/10 rounded-full blur-3xl" />

        {/* Centre branding */}
        <div className="flex-1 flex flex-col items-center justify-center px-16 relative z-10">
          <div className="mb-8 flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-xl">
            <Image
              src="/logo/logo.png"
              alt="HCU AI Logo"
              width={52}
              height={52}
              className="object-contain"
            />
          </div>

          <h1 className="text-4xl font-bold text-white text-center leading-tight mb-4">
            HCU AI Department
          </h1>
          <p className="text-teal-300 text-lg text-center mb-10 max-w-xs leading-relaxed">
            Admin Management Portal
          </p>

          {/* Feature badges */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {[
              'Manage website content',
              'Control news & events',
              'Update faculty & courses',
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-white/80 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom label */}
        <div className="px-8 pb-8 text-center relative z-10">
          <p className="text-teal-600 text-xs">
            © {new Date().getFullYear()} HCU AI Department · Authorized access only
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col bg-slate-50">

        {/* Mobile: back button */}
        <div className="lg:hidden px-6 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 group-hover:border-slate-500 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </span>
            Back to main site
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">

            {/* Header */}
            <div className="mb-8">
              <p className="text-teal-600 text-sm font-semibold uppercase tracking-widest mb-2">
                Admin Portal
              </p>
              <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-500 mt-2 text-sm">
                Sign in to access the dashboard
              </p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/80 border border-slate-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Username */}
                <div className="space-y-1.5">
                  <label htmlFor="username" className="text-sm font-medium text-slate-700">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 transition-colors"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-11 h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showPassword
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3.5">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </div>

            <p className="text-center text-slate-400 text-xs mt-6">
              © {new Date().getFullYear()} HCU AI Department
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
