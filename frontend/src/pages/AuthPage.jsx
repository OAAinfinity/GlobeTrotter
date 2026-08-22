import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Compass,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Globe,
  Plane,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Tabs } from '../components/common/Tabs';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';

export const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, users, currentUser } = useApp();

  // Mode state: 'login' or 'signup'
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState(initialMode);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Validation & Error states
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Handle Tab Switch
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setErrors({});
    setApiError('');
  };

  // Field change
  const handleChange = (e) => {
    const { id, value } = e.target;
    // Map input ids back to formData key names
    const keyMap = {
      'full-name': 'name',
      'email-address': 'email',
      'password': 'password',
      'confirm-password': 'confirmPassword'
    };
    const key = keyMap[id] || id;

    setFormData((prev) => ({ ...prev, [key]: value }));

    // Clear inline error for this field as user types
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
    if (apiError) setApiError('');
  };

  // Validation logic
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      try {
        if (mode === 'login') {
          login(formData.email, formData.password);
        } else {
          signup(formData.name, formData.email, formData.password);
        }
        navigate('/dashboard');
      } catch (err) {
        setApiError(err.message || 'An error occurred during authentication.');
      } finally {
        setIsLoading(false);
      }
    }, 600);
  };

  // Fast Demo Login
  const handleQuickLogin = (demoUser) => {
    setIsLoading(true);
    setTimeout(() => {
      login(demoUser.email, demoUser.password);
      navigate('/dashboard');
    }, 400);
  };

  // Forgot password submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail.trim() || !emailRegex.test(forgotEmail.trim())) {
      setForgotError('Please enter a valid email address.');
      return;
    }
    setForgotError('');
    setForgotSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 -left-20 w-80 h-80 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-ocean-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Brand Visual & Value Props */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-700 text-xs font-bold w-fit">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" />
            <span>Smart Multi-City Travel Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Plan Multi-City Trips <br />
            <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-ocean-600 bg-clip-text text-transparent">
              Without the Chaos.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Build day-by-day itineraries, optimize multi-city routes, calculate realistic budgets, and curate unforgettable activities — all in one warm, intuitive workspace.
          </p>

          {/* Floating Pill Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/90 rounded-2xl shadow-sm border border-slate-200/60 text-xs font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              15+ Curated Global Cities
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/90 rounded-2xl shadow-sm border border-slate-200/60 text-xs font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
              Day-by-Day Activity Builder
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/90 rounded-2xl shadow-sm border border-slate-200/60 text-xs font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-ocean-500 animate-pulse" />
              Live Cost & Budget Tracker
            </div>
          </div>

          {/* User Testimonial Miniature */}
          <div className="mt-4 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-warm-sm flex items-center gap-3">
            <img
              src={users[0]?.avatar}
              alt="Maya Lin"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-400 shrink-0"
            />
            <div>
              <p className="text-xs italic text-slate-600">
                “GlobeTrotter saved me 12+ hours planning my 10-day Tokyo & Kyoto trip. The budget breakdown was spot on!”
              </p>
              <p className="text-[11px] font-bold text-slate-900 mt-1">
                Maya Lin — <span className="text-brand-600 font-normal">Adventure Traveler</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card Container */}
        <div className="lg:col-span-6">
          <Card padding="lg" glass className="shadow-warm-lg border-slate-200/80">
            {/* Header / Tabs */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {mode === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {mode === 'login'
                      ? 'Sign in to access your planned itineraries and trips'
                      : 'Create your free account and plan your first trip in minutes'}
                  </p>
                </div>
              </div>

              {/* Mode Toggle Tabs */}
              <Tabs
                tabs={[
                  { id: 'login', label: 'Log In', icon: Lock },
                  { id: 'signup', label: 'Sign Up', icon: User }
                ]}
                activeTab={mode}
                onChange={handleModeChange}
              />
            </div>

            {/* General API error banner */}
            {apiError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {mode === 'signup' && (
                <Input
                  id="full-name"
                  label="Full Name"
                  placeholder="e.g. Maya Lin"
                  icon={User}
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
              )}

              <Input
                id="email-address"
                type="email"
                label="Email Address"
                placeholder="name@domain.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <div>
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  helperText={mode === 'signup' ? 'Must be at least 6 characters long' : undefined}
                  required
                />

                {mode === 'login' && (
                  <div className="flex justify-end mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(formData.email);
                        setForgotSubmitted(false);
                        setForgotError('');
                        setIsForgotModalOpen(true);
                      }}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {mode === 'signup' && (
                <Input
                  id="confirm-password"
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••••"
                  icon={ShieldCheck}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                icon={ArrowRight}
                className="mt-2"
              >
                {mode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}
              </Button>
            </form>

            {/* Quick Demo Accounts */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  1-Tap Demo Login
                </span>
                <span className="text-[11px] text-slate-400">Select any profile</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-brand-50 hover:border-brand-300 transition-all text-left group"
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-brand-700 truncate">
                        {u.name.split(' ')[0]}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {u.travelStyle.split(' ')[0]}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Your Password"
        subtitle="Enter your email to receive a password reset link"
      >
        {forgotSubmitted ? (
          <div className="flex flex-col items-center justify-center text-center py-4 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Check Your Inbox!</h4>
            <p className="text-xs text-slate-600 max-w-xs">
              We’ve sent password reset instructions to{' '}
              <span className="font-bold text-slate-800">{forgotEmail}</span>.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsForgotModalOpen(false)}
              className="mt-2"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
            <Input
              label="Account Email"
              type="email"
              placeholder="name@domain.com"
              icon={Mail}
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              error={forgotError}
              required
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsForgotModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" icon={KeyRound}>
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
