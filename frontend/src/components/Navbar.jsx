import React from 'react';
import { HeartHandshake, Plus, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({
  onOpenAddPet,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">
                PetCare+
              </h1>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              PawTrack Pet Manager
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Add Pet Button */}
          <button
            onClick={onOpenAddPet}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-teal-600/30 transition duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Pet</span>
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 py-1 px-2.5 rounded-xl border border-slate-200/80 transition">
                <img
                  src={
                    currentUser.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                  }
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500/40"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-600 font-medium leading-tight">
                    Pet Owner
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition duration-150"
            >
              <LogIn className="w-4 h-4 text-teal-600" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
