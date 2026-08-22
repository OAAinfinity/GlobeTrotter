import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Briefcase,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const Navbar = ({ onOpenMobileMenu, isMobileMenuOpen }) => {
  const { currentUser, users, login, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: Compass },
    { label: 'My Trips', path: '/trips', icon: Briefcase },
    { label: 'Discover', path: '/discover', icon: MapPin },
  ];

  const handleDemoSwitch = (user) => {
    login(user.email, user.password);
    setShowDemoSelector(false);
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link
            to={currentUser ? '/dashboard' : '/login'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-warm-sm group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse-glow" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                Globe<span className="text-brand-500">Trotter</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                Multi-City India Travel Planner
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-500' : ''}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User & Auth Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Switcher for Demo */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowDemoSelector(!showDemoSelector)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100 transition-colors"
                title="Switch demo user"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Profiles</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {showDemoSelector && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Quick Demo Accounts
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Click to instantly switch user persona
                    </p>
                  </div>
                  <div className="py-1 flex flex-col gap-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleDemoSwitch(u)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                          currentUser?.id === u.id
                            ? 'bg-brand-50 text-brand-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="truncate">
                          <p className="truncate font-semibold">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {u.travelStyle}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full hover:bg-slate-100/80 border border-slate-200/80 transition-all"
                >
                  <span className="hidden sm:block text-xs font-bold text-slate-700 max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-400"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
                    <div className="px-3 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile & Settings
                      </Link>
                      <Link
                        to="/trips"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        My Planned Trips
                      </Link>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/login?mode=signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
