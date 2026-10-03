import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=200&q=80',
];

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onLogin, onRegister }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatarUrl: AVATAR_OPTIONS[0],
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const demoUser = {
        _id: 'demo_user_1',
        name: 'Alex Rivera (Demo)',
        email: 'alex.demo@petcareplus.com',
        avatarUrl: AVATAR_OPTIONS[0],
        role: 'pet_owner',
        token: 'demo_jwt_token_sample_123',
      };
      // Save session
      localStorage.setItem('petcare_user', JSON.stringify(demoUser));
      localStorage.setItem('petcare_token', demoUser.token);
      onAuthSuccess(demoUser);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      if (!formData.name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);
    try {
      let result;
      if (isRegisterMode) {
        result = await onRegister({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          avatarUrl: formData.avatarUrl,
        });
      } else {
        result = await onLogin({
          email: formData.email.trim(),
          password: formData.password,
        });
      }

      if (result && result.success) {
        onAuthSuccess(result.data);
        onClose();
      } else {
        setError(result?.message || 'Authentication failed. Please check your details.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transition-all">
        
        {/* Header with gradient banner */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              {isRegisterMode ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isRegisterMode ? 'Join PetCare+' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-teal-100 mt-0.5">
                {isRegisterMode
                  ? 'Create an account to manage your pets securely'
                  : 'Sign in to access your pets, tasks & medical logs'}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-5 bg-white/15 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setError('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                !isRegisterMode
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setError('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                isRegisterMode
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Demo Login Banner */}
          {!isRegisterMode && (
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-800 border border-teal-200/80 rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>⚡ 1-Click Quick Demo Login (No Typing)</span>
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Choose Profile Avatar
                  </label>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {AVATAR_OPTIONS.map((avatar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatarUrl: avatar })}
                        className={`relative rounded-full p-0.5 transition ${
                          formData.avatarUrl === avatar
                            ? 'ring-2 ring-teal-500 ring-offset-2 scale-105'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={avatar}
                          alt="Avatar option"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder={isRegisterMode ? 'At least 6 characters' : 'Enter your password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
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

            {/* Confirm Password (Register mode only) */}
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-teal-600/25 transition duration-150 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : isRegisterMode ? (
                'Create Account & Start'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              {isRegisterMode ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setError('');
                }}
                className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2"
              >
                {isRegisterMode ? 'Sign In' : 'Create an Account'}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
