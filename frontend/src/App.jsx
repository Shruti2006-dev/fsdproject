import React, { useState, useEffect } from 'react';
import {
  apiGetPets,
  apiCreatePet,
  apiUpdatePet,
  apiDeletePet,
  apiGetTasks,
  apiCreateTask,
  apiToggleTask,
  apiDeleteTask,
  apiResetDailyTasks,
  apiGetHealthRecords,
  apiCreateHealthRecord,
  apiDeleteHealthRecord,
  apiGetAppointments,
  apiCreateAppointment,
  apiUpdateAppointmentStatus,
  apiDeleteAppointment,
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetMe,
} from './services/api';

import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import PetCard from './components/PetCard';
import PetModal from './components/PetModal';
import AuthModal from './components/AuthModal';
import DailyTasks from './components/DailyTasks';
import HealthRecords from './components/HealthRecords';
import Appointments from './components/Appointments';
import Toast from './components/Toast';

import {
  LayoutDashboard,
  Dog,
  CheckSquare,
  ShieldPlus,
  CalendarCheck2,
  Plus,
  Search,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

export default function App() {
  // Application State
  const [pets, setPets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('petcare_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'pets', 'tasks', 'health', 'appointments'
  const [selectedPetId, setSelectedPetId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Notification States
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome, ${user.name}! 🐾`, 'success');
  };

  const handleLogout = () => {
  // Clear authentication
  apiLogout();

  // Clear current user
  setCurrentUser(null);

  // Clear all user-specific application data
  setPets([]);
  setTasks([]);
  setHealthRecords([]);
  setAppointments([]);

  // Clear filters/search
  setSelectedPetId('');
  setSearchQuery('');

  // Reset UI
  setActiveTab('dashboard');

  // Close any open modals
  setIsPetModalOpen(false);
  setEditingPet(null);
  setIsAuthModalOpen(false);

  showToast('Logged out successfully.', 'info');
};

  // Initial Data Fetch
  const loadAllData = async () => {
    try {
      setLoading(true);
      const petRes = await apiGetPets();
      setPets(petRes.data || []);
      setIsLiveBackend(petRes.isLive);

      const [tasksData, healthData, appData] = await Promise.all([
        apiGetTasks(),
        apiGetHealthRecords(),
        apiGetAppointments(),
      ]);

      setTasks(tasksData || []);
      setHealthRecords(healthData || []);
      setAppointments(appData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      showToast('Could not load data from server. Using local interactive state.', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (currentUser) {
    loadAllData();
  } else {
    setPets([]);
    setTasks([]);
    setHealthRecords([]);
    setAppointments([]);
    setLoading(false);
  }
}, [currentUser]);

  // ---------------- Handlers for Pets ----------------
  const handleSavePet = async (petData) => {
    try {
      if (editingPet) {
        const updated = await apiUpdatePet(editingPet._id, petData);
        setPets((prev) => prev.map((p) => (p._id === editingPet._id ? { ...p, ...updated } : p)));
        showToast(`${petData.name}'s profile updated!`);
      } else {
        const created = await apiCreatePet(petData);
        setPets((prev) => [created, ...prev]);
        // Refresh tasks to include starter routines
        const updatedTasks = await apiGetTasks();
        setTasks(updatedTasks);
        showToast(`🎉 Added ${petData.name} to PetCare+!`);
      }
      setEditingPet(null);
    } catch (err) {
      showToast(err.message || 'Failed to save pet', 'error');
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      await apiDeletePet(petId);
      setPets((prev) => prev.filter((p) => p._id !== petId));
      setTasks((prev) => prev.filter((t) => (t.petId?._id || t.petId) !== petId));
      setHealthRecords((prev) => prev.filter((h) => (h.petId?._id || h.petId) !== petId));
      setAppointments((prev) => prev.filter((a) => (a.petId?._id || a.petId) !== petId));
      if (selectedPetId === petId) setSelectedPetId('');
      showToast('Pet profile and related records removed.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete pet', 'error');
    }
  };

  // ---------------- Handlers for Tasks ----------------
  const handleToggleTask = async (taskId) => {
    try {
      const updated = await apiToggleTask(taskId);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      showToast(
        updated.isCompleted ? 'Task completed! Good job 🐾' : 'Task marked pending',
        updated.isCompleted ? 'success' : 'info'
      );
    } catch (err) {
      showToast('Could not update task status', 'error');
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const created = await apiCreateTask(taskData);
      setTasks((prev) => [...prev, created]);
      showToast('New daily routine scheduled!');
    } catch (err) {
      showToast('Failed to add routine', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiDeleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      showToast('Routine deleted', 'info');
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  const handleResetTasks = async () => {
    try {
      await apiResetDailyTasks(selectedPetId);
      setTasks((prev) =>
        prev.map((t) =>
          !selectedPetId || (t.petId?._id || t.petId) === selectedPetId
            ? { ...t, isCompleted: false, completedAt: null }
            : t
        )
      );
      showToast('All daily tasks have been reset for today!');
    } catch (err) {
      showToast('Failed to reset tasks', 'error');
    }
  };

  // ---------------- Handlers for Health ----------------
  const handleAddHealthRecord = async (recordData) => {
    try {
      const created = await apiCreateHealthRecord(recordData);
      setHealthRecords((prev) => [created, ...prev]);
      showToast('Health record logged successfully!');
    } catch (err) {
      showToast('Failed to log health entry', 'error');
    }
  };

  const handleDeleteHealthRecord = async (recordId) => {
    try {
      await apiDeleteHealthRecord(recordId);
      setHealthRecords((prev) => prev.filter((h) => h._id !== recordId));
      showToast('Health entry deleted', 'info');
    } catch (err) {
      showToast('Failed to delete record', 'error');
    }
  };

  // ---------------- Handlers for Appointments ----------------
  const handleAddAppointment = async (appData) => {
    try {
      const created = await apiCreateAppointment(appData);
      setAppointments((prev) => [...prev, created]);
      showToast('Vet appointment booked!');
    } catch (err) {
      showToast('Failed to schedule appointment', 'error');
    }
  };

  const handleUpdateAppointmentStatus = async (appId, status) => {
    try {
      const updated = await apiUpdateAppointmentStatus(appId, status);
      setAppointments((prev) => prev.map((a) => (a._id === appId ? updated : a)));
      showToast(`Appointment status updated to ${status}`);
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteAppointment = async (appId) => {
    try {
      await apiDeleteAppointment(appId);
      setAppointments((prev) => prev.filter((a) => a._id !== appId));
      showToast('Appointment removed', 'info');
    } catch (err) {
      showToast('Failed to delete appointment', 'error');
    }
  };

  // Filtered Pets by Search
  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.species.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'pets', label: `My Pets (${pets.length})`, icon: <Dog className="w-4 h-4" /> },
    { id: 'tasks', label: 'Daily Routine', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'health', label: 'Vaccines & Health', icon: <ShieldPlus className="w-4 h-4" /> },
    { id: 'appointments', label: 'Vet Visits', icon: <CalendarCheck2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Pet Edit / Add Modal */}
      <PetModal
        isOpen={isPetModalOpen}
        onClose={() => {
          setIsPetModalOpen(false);
          setEditingPet(null);
        }}
        onSave={handleSavePet}
        editingPet={editingPet}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onLogin={apiLogin}
        onRegister={apiRegister}
      />

      {/* Main Header / Navbar */}
      <Navbar
        onOpenAddPet={() => {
          setEditingPet(null);
          setIsPetModalOpen(true);
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        isLiveBackend={isLiveBackend}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Top Control Bar: Active Pet Filter & Tab Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Filter By Pet Dropdown & Search */}
          <div className="flex items-center gap-2.5">
            {/* Pet Filter */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-sm text-xs">
              <span className="font-semibold text-slate-500 hidden sm:inline">Active Pet:</span>
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="">🐾 All Pets</option>
                {pets.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.species})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search pet or breed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-2xl border border-slate-200/80 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-36 sm:w-48"
              />
            </div>
          </div>
        </div>

        {/* Selected Pet Banner Notification */}
        {selectedPetId && (
          <div className="mb-6 bg-teal-50 border border-teal-200/80 rounded-2xl p-3 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
              <span>
                Filtering view for:{' '}
                <strong>{pets.find((p) => p._id === selectedPetId)?.name}</strong>
              </span>
            </div>
            <button
              onClick={() => setSelectedPetId('')}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline"
            >
              Clear Filter (Show All)
            </button>
          </div>
        )}

        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Stats Metric Cards */}
            <StatsOverview
              pets={pets}
              tasks={tasks}
              healthRecords={healthRecords}
              appointments={appointments}
            />

            {/* Pets Carousel / Quick Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Pet Family</h3>
                  <p className="text-xs text-slate-500">Quickly inspect or manage pet details</p>
                </div>
                <button
                  onClick={() => {
                    setEditingPet(null);
                    setIsPetModalOpen(true);
                  }}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Another Pet
                </button>
              </div>

              {filteredPets.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                  <Dog className="w-12 h-12 text-teal-400 mx-auto mb-3 opacity-75" />
                  <h4 className="text-base font-bold text-slate-800">No Pets Added Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Add your first dog, cat, rabbit, or bird to unlock scheduled care, vaccine logs, and reminders.
                  </p>
                  <button
                    onClick={() => {
                      setEditingPet(null);
                      setIsPetModalOpen(true);
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-teal-600/20"
                  >
                    + Register Your Pet
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredPets.map((pet) => (
                    <PetCard
                      key={pet._id}
                      pet={pet}
                      isSelected={selectedPetId === pet._id}
                      onSelect={(id) => setSelectedPetId(selectedPetId === id ? '' : id)}
                      onEdit={(p) => {
                        setEditingPet(p);
                        setIsPetModalOpen(true);
                      }}
                      onDelete={handleDeletePet}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Split View: Daily Care & Next Vet Visits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DailyTasks
                  tasks={tasks}
                  pets={pets}
                  selectedPetId={selectedPetId}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                  onResetTasks={handleResetTasks}
                />
              </div>
              <div>
                <Appointments
                  appointments={appointments}
                  pets={pets}
                  selectedPetId={selectedPetId}
                  onAddAppointment={handleAddAppointment}
                  onUpdateStatus={handleUpdateAppointmentStatus}
                  onDeleteAppointment={handleDeleteAppointment}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. MY PETS VIEW */}
        {activeTab === 'pets' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pet Profiles</h2>
                <p className="text-xs text-slate-500">
                  Manage profiles, weight, microchip IDs, and notes for each pet
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingPet(null);
                  setIsPetModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Pet
              </button>
            </div>

            {filteredPets.length === 0 ? (
              <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                <Dog className="w-12 h-12 text-teal-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">No pets matching your filter</h4>
                <p className="text-xs text-slate-500 mt-1">Try clearing your search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPets.map((pet) => (
                  <PetCard
                    key={pet._id}
                    pet={pet}
                    isSelected={selectedPetId === pet._id}
                    onSelect={(id) => setSelectedPetId(selectedPetId === id ? '' : id)}
                    onEdit={(p) => {
                      setEditingPet(p);
                      setIsPetModalOpen(true);
                    }}
                    onDelete={handleDeletePet}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. DAILY ROUTINE VIEW */}
        {activeTab === 'tasks' && (
          <div className="animate-in fade-in duration-200">
            <DailyTasks
              tasks={tasks}
              pets={pets}
              selectedPetId={selectedPetId}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onResetTasks={handleResetTasks}
            />
          </div>
        )}

        {/* 4. HEALTH & VACCINES VIEW */}
        {activeTab === 'health' && (
          <div className="animate-in fade-in duration-200">
            <HealthRecords
              healthRecords={healthRecords}
              pets={pets}
              selectedPetId={selectedPetId}
              onAddRecord={handleAddHealthRecord}
              onDeleteRecord={handleDeleteHealthRecord}
            />
          </div>
        )}

        {/* 5. APPOINTMENTS VIEW */}
        {activeTab === 'appointments' && (
          <div className="animate-in fade-in duration-200">
            <Appointments
              appointments={appointments}
              pets={pets}
              selectedPetId={selectedPetId}
              onAddAppointment={handleAddAppointment}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onDeleteAppointment={handleDeleteAppointment}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
    <p className="text-xl font-bold">🐾 ฅ՞•ﻌ•՞ฅ FurryCare</p>
        </div>
      </footer>
    </div>
  );
}
