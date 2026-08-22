import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Briefcase, MapPin, User, Sparkles, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const MobileNav = ({ isOpen, onClose }) => {
  const { currentUser, users, login, logout } = useApp();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Compass },
    { label: 'My Trips', path: '/trips', icon: Briefcase },
    { label: 'Discover', path: '/discover', icon: MapPin },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full bg-white rounded-b-3xl shadow-2xl p-6 border-b border-slate-100 flex flex-col gap-6 animate-scaleUp">
        {/* User Card */}
        {currentUser ? (
          <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-2xl border border-slate-200/60">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-400"
            />
            <div className="flex-1 truncate">
              <p className="font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link to="/login" onClick={onClose}>
              <Button variant="outline" fullWidth>
                Log In
              </Button>
            </Link>
            <Link to="/login?mode=signup" onClick={onClose}>
              <Button variant="primary" fullWidth>
                Create Free Account
              </Button>
            </Link>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 border border-brand-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Demo switcher */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Switch Demo Account
          </p>
          <div className="grid grid-cols-2 gap-2">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  login(u.email, u.password);
                  onClose();
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-xs text-left border transition-all ${
                  currentUser?.id === u.id
                    ? 'border-brand-400 bg-brand-50 text-brand-700 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
                <span className="truncate">{u.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Compass },
    { label: 'My Trips', path: '/trips', icon: Briefcase },
    { label: 'Discover', path: '/discover', icon: MapPin },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-brand-600 font-bold scale-105' : 'text-slate-500 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : 'text-slate-400'}`} />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
