import React, { useState, useEffect } from 'react';
import { X, Camera, Sparkles } from 'lucide-react';

const speciesList = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];

const suggestedAvatars = [
  { label: 'Golden Dog', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Playful Pup', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80' },
  { label: 'Cute Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80' },
  { label: 'Ginger Cat', url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=400&q=80' },
  { label: 'Bunny', url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80' },
  { label: 'Parrot', url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80' },
];

export default function PetModal({ isOpen, onClose, onSave, editingPet }) {
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Unknown',
    ageYears: 1,
    weightKg: 5.0,
    microchipId: '',
    allergies: '',
    specialNotes: '',
    avatarUrl: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPet) {
      setFormData({
        name: editingPet.name || '',
        species: editingPet.species || 'Dog',
        breed: editingPet.breed || '',
        gender: editingPet.gender || 'Unknown',
        ageYears: editingPet.ageYears || 1,
        weightKg: editingPet.weightKg || 5.0,
        microchipId: editingPet.microchipId || '',
        allergies: Array.isArray(editingPet.allergies) ? editingPet.allergies.join(', ') : (editingPet.allergies || ''),
        specialNotes: editingPet.specialNotes || '',
        avatarUrl: editingPet.avatarUrl || '',
      });
    } else {
      setFormData({
        name: '',
        species: 'Dog',
        breed: '',
        gender: 'Male',
        ageYears: 2,
        weightKg: 8.5,
        microchipId: '',
        allergies: '',
        specialNotes: '',
        avatarUrl: suggestedAvatars[0].url,
      });
    }
  }, [editingPet, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingPet ? `Edit ${editingPet.name}'s Profile` : 'Add a New Pet'}
            </h3>
            <p className="text-xs text-slate-500">
              {editingPet ? 'Update health and profile parameters' : 'Enter your pet details to start managing daily care'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Avatar Preview & Suggested Quick Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Pet Photo / Avatar</label>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-2xl ring-2 ring-teal-500 overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src={formData.avatarUrl || suggestedAvatars[0].url}
                  alt="Pet preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = suggestedAvatars[0].url;
                  }}
                />
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  name="avatarUrl"
                  placeholder="Paste image URL or pick below"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Quick avatar presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                <Sparkles className="w-3 h-3 text-teal-500" /> Presets:
              </span>
              {suggestedAvatars.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: preset.url }))}
                  className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200 hover:border-teal-500 transition-colors flex-shrink-0"
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Name & Species */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pet Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Milo, Bella"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Species</label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              >
                {speciesList.map((sp) => (
                  <option key={sp} value={sp}>
                    {sp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Breed & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Breed</label>
              <input
                type="text"
                name="breed"
                placeholder="e.g. Beagle, Persian, Mixed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          {/* Age & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                name="ageYears"
                min="0"
                step="0.5"
                value={formData.ageYears}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weightKg"
                min="0.1"
                step="0.1"
                value={formData.weightKg}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Microchip & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Microchip ID (Optional)</label>
              <input
                type="text"
                name="microchipId"
                placeholder="e.g. 98514100..."
                value={formData.microchipId}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Allergies (comma separated)</label>
              <input
                type="text"
                name="allergies"
                placeholder="e.g. Chicken, Dust"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Special Care Notes</label>
            <textarea
              name="specialNotes"
              rows="2"
              placeholder="e.g. Likes morning walks, sensitive stomach, afraid of thunder..."
              value={formData.specialNotes}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm shadow-teal-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingPet ? 'Update Pet' : 'Save Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
