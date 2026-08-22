import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import {
  Compass,
  MapPin,
  Calendar,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  Layers,
  Activity
} from 'lucide-react';

export const Navbar = ({ onOpenMobileMenu, isMobileMenuOpen }) => {
  const location = useLocation();
  const { currentUser, users, login, logout } = useApp();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/trips', label: 'My Trips' },
    { path: '/discover', label: 'Destinations' },
    { path: '/activities', label: 'Experiences' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-500 flex items-center justify-center text-white shadow-warm-sm group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
              GlobeTrotter<span className="text-brand-600">.in</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              India Travel Planner
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-sand-50/80 p-1.5 rounded-2xl border border-slate-200/60">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Persona Quick Switcher & User Profile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Demo Persona Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
              Demo Persona:
            </span>
            {users.map((u) => {
              const isSelected = currentUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => login(u.email, 'demo123')}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'ring-2 ring-brand-500 scale-110 shadow-xs'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  title={`Switch to ${u.name} (${u.travelStyle})`}
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </button>
              );
            })}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-brand-500/30"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-none">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                    {currentUser.homeCity || 'New Delhi'}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};
