import React, { useState } from 'react';
import { Mail, Lock, LogIn, Sparkles, Eye, EyeOff, AlertCircle, HeartHandshake, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin, onNavigateToRegister, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickDemo = async () => {
    setLoading(true);
    setError('');
    try {
      const demoUser = {
        _id: 'demo_user_1',
        name: 'Alex Rivera (Demo)',
        email: 'alex.demo@petcareplus.com',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'pet_owner',
        token: 'demo_jwt_token_sample_123',
      };
      localStorage.setItem('petcare_user', JSON.stringify(demoUser));
      localStorage.setItem('petcare_token', demoUser.token);
      if (onAuthSuccess) onAuthSuccess(demoUser);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both your email and password');
      return;
    }

    setLoading(true);
    try {
      const result = await onLogin({ email, password });
      if (result && result.success) {
        if (onAuthSuccess) onAuthSuccess(result.data);
      } else {
        setError(result?.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
        
        {/* Header with Logo */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 mb-4">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to PetCare+
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Track daily feeding, medical logs, and vet appointments for your pets
          </p>
        </div>

        {/* 1-Click Quick Demo Login Button */}
        <button
          type="button"
          onClick={handleQuickDemo}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-800 border border-teal-200/80 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>⚡ 1-Click Quick Demo Login (No Typing)</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">Or with Email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="alex@petcare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-teal-600/30 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing In...
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-xs sm:text-sm text-slate-600">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 hover:underline"
            >
              <span>Create an Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
