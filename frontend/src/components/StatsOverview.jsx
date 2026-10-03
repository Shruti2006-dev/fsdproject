import React from 'react';
import { Dog, CheckCircle, ShieldAlert, CalendarClock, TrendingUp } from 'lucide-react';

export default function StatsOverview({ pets = [], tasks = [], healthRecords = [], appointments = [] }) {
  // Compute metrics
  const totalPets = pets.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Upcoming appointments
  const upcomingAppointments = appointments.filter(a => a.status === 'Scheduled');
  const nextAppointment = upcomingAppointments.length > 0
    ? [...upcomingAppointments].sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0]
    : null;

  // Upcoming vaccines (due in next 60 days or overdue)
  const now = new Date();
  const upcomingVaccines = healthRecords.filter(h => {
    if (!h.nextDueDate) return false;
    const dueDate = new Date(h.nextDueDate);
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    return diffDays >= -30 && diffDays <= 90;
  });

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Pets Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-teal-300 transition-colors">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Registered Pets</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalPets}</h3>
          <p className="text-xs text-teal-600 mt-1 font-medium flex items-center gap-1">
            <Dog className="w-3.5 h-3.5" />
            {totalPets === 1 ? '1 furry friend' : `${totalPets} happy pets`}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
          <Dog className="w-6 h-6" />
        </div>
      </div>

      {/* Routine Tracker Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today's Routine</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {completedTasks}/{totalTasks}
              <span className="text-xs font-normal text-slate-500 ml-1">tasks</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${taskPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 font-medium">
            <span>{taskPercentage}% completed</span>
            <span>{totalTasks - completedTasks} remaining</span>
          </div>
        </div>
      </div>

      {/* Health & Vaccines Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-amber-300 transition-colors">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Vaccine / Med Alerts</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{upcomingVaccines.length}</h3>
          <p className="text-xs text-amber-600 mt-1 font-medium">
            {upcomingVaccines.length > 0 ? 'Upcoming or due soon' : 'All records up-to-date'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
          <ShieldAlert className="w-6 h-6" />
        </div>
      </div>

      {/* Next Appointment Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-sky-300 transition-colors">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Next Vet Visit</p>
          {nextAppointment ? (
            <>
              <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                {nextAppointment.clinicName}
              </h3>
              <p className="text-xs text-sky-600 mt-1 font-medium">
                {new Date(nextAppointment.appointmentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {nextAppointment.timeSlot}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-slate-700 mt-1">No visits scheduled</h3>
              <p className="text-xs text-slate-400 mt-1">All checkups clear</p>
            </>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
          <CalendarClock className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
}
