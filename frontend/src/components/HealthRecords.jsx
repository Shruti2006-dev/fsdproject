import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Syringe, Calendar, UserCheck, AlertCircle } from 'lucide-react';

const recordTypes = ['Vaccination', 'Medication', 'Deworming', 'Checkup', 'Surgery', 'Allergy Test', 'Weight Check', 'Other'];

export default function HealthRecords({
  healthRecords = [],
  pets = [],
  selectedPetId,
  onAddRecord,
  onDeleteRecord,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState('All');

  const [formData, setFormData] = useState({
    petId: selectedPetId || (pets[0] ? pets[0]._id : ''),
    recordType: 'Vaccination',
    title: '',
    dateAdministered: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    veterinarian: '',
    clinicName: '',
    dosage: '',
    notes: '',
  });

  const filteredRecords = healthRecords.filter((rec) => {
    if (selectedPetId && (rec.petId?._id || rec.petId) !== selectedPetId) return false;
    if (filterType !== 'All' && rec.recordType !== filterType) return false;
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.petId) return;

    await onAddRecord(formData);
    setFormData({
      petId: selectedPetId || (pets[0] ? pets[0]._id : ''),
      recordType: 'Vaccination',
      title: '',
      dateAdministered: new Date().toISOString().split('T')[0],
      nextDueDate: '',
      veterinarian: '',
      clinicName: '',
      dosage: '',
      notes: '',
    });
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">Health & Vaccine Log</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {filteredRecords.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain complete medical history, immunization logs, and booster schedules
          </p>
        </div>

        <button
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              petId: selectedPetId || (pets[0] ? pets[0]._id : ''),
            }));
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm shadow-teal-600/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Close Form' : 'Log Vaccine / Health'}</span>
        </button>
      </div>

      {/* Add Health Record Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="my-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in duration-150">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            New Medical or Vaccination Entry
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Pet selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">For Pet</label>
              <select
                value={formData.petId}
                onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="">Select Pet</option>
                {pets.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.species})
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Entry Type</label>
              <select
                value={formData.recordType}
                onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {recordTypes.map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Treatment / Vaccine Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rabies 3-Yr Booster, NexGard"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Date Administered */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date Administered</label>
              <input
                type="date"
                value={formData.dateAdministered}
                onChange={(e) => setFormData({ ...formData, dateAdministered: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Next Due Date */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Next Due / Booster Date</label>
              <input
                type="date"
                value={formData.nextDueDate}
                onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Veterinarian */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Veterinarian / Doctor</label>
              <input
                type="text"
                placeholder="e.g. Dr. Sarah Jenkins"
                value={formData.veterinarian}
                onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Clinic Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Clinic / Hospital</label>
              <input
                type="text"
                placeholder="e.g. Paws & Claws Animal Hospital"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Dosage */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dosage / Details</label>
              <input
                type="text"
                placeholder="e.g. 1.0 mL subcutaneous, 1 tab daily"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Notes / Reactions</label>
              <input
                type="text"
                placeholder="e.g. No adverse reactions, tolerated well with food..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm shadow-teal-600/20"
            >
              Save Health Entry
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 my-4">
        {['All', ...recordTypes].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 text-xs font-medium rounded-xl transition-colors flex-shrink-0 ${
              filterType === type
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Record Cards */}
      <div className="space-y-3 mt-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <ShieldCheck className="w-10 h-10 text-teal-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-700">No health records logged</p>
            <p className="text-xs text-slate-400 mt-1">
              Keep your pet's vaccines, flea treatments, and vet visits organized in one place.
            </p>
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const pet = rec.petId || {};
            const isDueSoon = rec.nextDueDate && new Date(rec.nextDueDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            return (
              <div
                key={rec._id}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Info */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Syringe className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        {rec.recordType}
                      </span>
                      {pet.name && (
                        <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          🐾 {pet.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Given: {new Date(rec.dateAdministered).toLocaleDateString()}
                      </span>
                      {rec.veterinarian && (
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          {rec.veterinarian}
                        </span>
                      )}
                      {rec.clinicName && <span>🏢 {rec.clinicName}</span>}
                    </div>

                    {rec.notes && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {rec.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Due date and actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {rec.nextDueDate ? (
                    <div
                      className={`text-xs px-2.5 py-1 rounded-xl font-medium border flex items-center gap-1.5 ${
                        isDueSoon
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isDueSoon && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                      <span>Due: {new Date(rec.nextDueDate).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">One-time entry</span>
                  )}

                  <button
                    onClick={() => onDeleteRecord(rec._id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
