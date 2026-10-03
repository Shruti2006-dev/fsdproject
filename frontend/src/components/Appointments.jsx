import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, User, Phone, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const statusBadges = {
  Scheduled: 'bg-sky-50 text-sky-700 border-sky-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  Rescheduled: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function Appointments({
  appointments = [],
  pets = [],
  selectedPetId,
  onAddAppointment,
  onUpdateStatus,
  onDeleteAppointment,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  const [formData, setFormData] = useState({
    petId: selectedPetId || (pets[0] ? pets[0]._id : ''),
    clinicName: '',
    doctorName: '',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    reason: 'Routine Wellness Checkup',
    status: 'Scheduled',
    contactPhone: '',
    notes: '',
  });

  const filteredAppointments = appointments.filter((app) => {
    if (selectedPetId && (app.petId?._id || app.petId) !== selectedPetId) return false;
    if (filterStatus !== 'All' && app.status !== filterStatus) return false;
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clinicName.trim() || !formData.petId) return;

    await onAddAppointment(formData);
    setFormData({
      petId: selectedPetId || (pets[0] ? pets[0]._id : ''),
      clinicName: '',
      doctorName: '',
      appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: '10:00 AM',
      reason: 'Routine Wellness Checkup',
      status: 'Scheduled',
      contactPhone: '',
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
            <h3 className="text-xl font-bold text-slate-900">Vet Appointments</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              {filteredAppointments.length} Visits
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule clinic checkups, dental exams, and follow-ups
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
          <span>{showAddForm ? 'Close Form' : 'Book Appointment'}</span>
        </button>
      </div>

      {/* Booking Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="my-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in duration-150">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Schedule a Vet Visit
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Pet */}
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

            {/* Clinic Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Clinic / Hospital Name</label>
              <input
                type="text"
                required
                placeholder="e.g. City Vet Clinic"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Doctor Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Veterinarian Doctor (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Dr. Roberts"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Appointment Date</label>
              <input
                type="date"
                required
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Time Slot</label>
              <input
                type="text"
                placeholder="e.g. 10:30 AM"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Clinic Phone</label>
              <input
                type="text"
                placeholder="e.g. (555) 019-2834"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Reason */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reason for Visit</label>
              <input
                type="text"
                placeholder="e.g. Annual vaccination check, dental tartar check, limping hind paw"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
              Schedule Appointment
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 my-4">
        {['All', 'Scheduled', 'Completed', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 text-xs font-medium rounded-xl transition-colors ${
              filterStatus === status
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-2 text-center py-10 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <Calendar className="w-10 h-10 text-teal-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-700">No appointments scheduled</p>
            <p className="text-xs text-slate-400 mt-1">
              Keep track of vet visits, health exams, and doctor notes.
            </p>
          </div>
        ) : (
          filteredAppointments.map((app) => {
            const pet = app.petId || {};
            const badgeClass = statusBadges[app.status] || statusBadges.Scheduled;

            return (
              <div
                key={app._id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{app.reason}</h4>
                        {pet.name && (
                          <span className="text-xs font-semibold text-teal-700">
                            🐾 {pet.name} ({pet.species})
                          </span>
                        )}
                      </div>
                    </div>

                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">
                        {new Date(app.appointmentDate).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })} at {app.timeSlot}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.clinicName}</span>
                    </div>

                    {app.doctorName && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.doctorName}</span>
                      </div>
                    )}

                    {app.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.contactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    {app.status === 'Scheduled' && (
                      <button
                        onClick={() => onUpdateStatus(app._id, 'Completed')}
                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold px-2 py-1 bg-emerald-50 rounded-lg"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </button>
                    )}

                    {app.status === 'Scheduled' && (
                      <button
                        onClick={() => onUpdateStatus(app._id, 'Cancelled')}
                        className="flex items-center gap-1 text-slate-500 hover:text-slate-700 px-2 py-1 bg-slate-100 rounded-lg"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteAppointment(app._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete appointment"
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
