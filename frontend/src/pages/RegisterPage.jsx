import React, { useState } from 'react';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, AlertCircle, HeartHandshake, ArrowLeft, ShieldCheck } from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=200&q=80',
];

export default function RegisterPage({ onRegister, onNavigateToLogin, onAuthSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await onRegister({
        name: name.trim(),
        email: email.trim(),
        password,
        avatarUrl: selectedAvatar,
      });

      if (result && result.success) {
        if (onAuthSuccess) onAuthSuccess(result.data);
      } else {
        setError(result?.message || 'Registration failed. Please check your information.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
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
            Create an Account
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Join PetCare+ to organize care routines and health records for all your pets
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
              Choose Your Profile Avatar
            </label>
            <div className="flex items-center justify-center gap-3 py-1">
              {AVATAR_OPTIONS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative rounded-full p-0.5 transition ${
                    selectedAvatar === avatar
                      ? 'ring-3 ring-teal-500 ring-offset-2 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={avatar}
                    alt="Avatar option"
                    className="w-10 h-10 rounded-full object-cover shadow-xs"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <ShieldCheck className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-teal-600/30 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Account...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create My Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-xs sm:text-sm text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
