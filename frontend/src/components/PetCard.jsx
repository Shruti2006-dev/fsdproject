import React from 'react';
import { Edit2, Trash2, Shield, Weight, Calendar, AlertTriangle } from 'lucide-react';

const defaultAvatars = {
  Dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
  Cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
  Bird: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80',
  Rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80',
  Hamster: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=400&q=80',
  Fish: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80',
  Other: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=400&q=80',
};

const speciesBadgeColors = {
  Dog: 'bg-amber-100 text-amber-800 border-amber-200',
  Cat: 'bg-violet-100 text-violet-800 border-violet-200',
  Rabbit: 'bg-pink-100 text-pink-800 border-pink-200',
  Bird: 'bg-sky-100 text-sky-800 border-sky-200',
  Hamster: 'bg-orange-100 text-orange-800 border-orange-200',
  Fish: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Other: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export default function PetCard({ pet, onEdit, onDelete, isSelected, onSelect }) {
  const avatar = pet.avatarUrl || defaultAvatars[pet.species] || defaultAvatars.Other;
  const badgeStyle = speciesBadgeColors[pet.species] || speciesBadgeColors.Other;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border-teal-500 shadow-md ring-2 ring-teal-500/20'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Banner Image with Avatar Overlay */}
      <div className="h-28 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-600/20 relative">
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(pet);
            }}
            className="p-1.5 bg-white/90 hover:bg-white text-slate-600 hover:text-teal-600 rounded-lg shadow-sm transition-colors"
            title="Edit Pet Profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to delete ${pet.name}? All tasks and health records will also be removed.`)) {
                onDelete(pet._id);
              }
            }}
            className="p-1.5 bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 rounded-lg shadow-sm transition-colors"
            title="Delete Pet"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Pet Avatar */}
        <div className="absolute -bottom-8 left-5">
          <div className="w-16 h-16 rounded-2xl ring-4 ring-white shadow-md overflow-hidden bg-slate-100">
            <img
              src={avatar}
              alt={pet.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatars[pet.species] || defaultAvatars.Other;
              }}
            />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="pt-10 px-5 pb-5">
        {/* Name and Species Tag */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              {pet.name}
            </h4>
            <p className="text-xs font-medium text-slate-500">{pet.breed || 'Unknown Breed'}</p>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
            {pet.species}
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 py-3 border-y border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-teal-500" />
            <span>{pet.ageYears} {pet.ageYears === 1 ? 'Year' : 'Years'} old</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Weight className="w-3.5 h-3.5 text-emerald-500" />
            <span>{pet.weightKg} kg</span>
          </div>
        </div>

        {/* Allergies / Special Notes */}
        {pet.allergies && pet.allergies.length > 0 && pet.allergies[0] && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Allergies: {Array.isArray(pet.allergies) ? pet.allergies.join(', ') : pet.allergies}</span>
          </div>
        )}

        {pet.microchipId && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <Shield className="w-3 h-3 text-slate-400" />
            <span>Chip: {pet.microchipId}</span>
          </div>
        )}

        {/* Card Action Button */}
        <button
          onClick={() => onSelect(pet._id)}
          className={`w-full mt-4 py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 ${
            isSelected
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200/80 hover:border-teal-200'
          }`}
        >
          {isSelected ? 'Viewing Active Routines' : 'View Routines & Records'}
        </button>
      </div>
    </div>
  );
}
