import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  RotateCcw,
  Utensils,
  Footprints,
  Pill,
  Sparkles,
  Gamepad2,
  Brush,
  Filter,
} from 'lucide-react';

const categoryIcons = {
  Feeding: <Utensils className="w-4 h-4 text-amber-500" />,
  Walk: <Footprints className="w-4 h-4 text-emerald-500" />,
  Medication: <Pill className="w-4 h-4 text-rose-500" />,
  Grooming: <Brush className="w-4 h-4 text-violet-500" />,
  Play: <Gamepad2 className="w-4 h-4 text-sky-500" />,
  Cleaning: <Sparkles className="w-4 h-4 text-teal-500" />,
  Other: <Sparkles className="w-4 h-4 text-slate-500" />,
};

const categoryBadges = {
  Feeding: 'bg-amber-50 text-amber-700 border-amber-200',
  Walk: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medication: 'bg-rose-50 text-rose-700 border-rose-200',
  Grooming: 'bg-violet-50 text-violet-700 border-violet-200',
  Play: 'bg-sky-50 text-sky-700 border-sky-200',
  Cleaning: 'bg-teal-50 text-teal-700 border-teal-200',
  Other: 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function DailyTasks({
  tasks = [],
  pets = [],
  selectedPetId,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onResetTasks,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Pending', 'Completed'

  const [newTask, setNewTask] = useState({
    petId: selectedPetId || (pets[0] ? pets[0]._id : ''),
    title: '',
    category: 'Feeding',
    time: '08:00 AM',
    frequency: 'Daily',
    notes: '',
  });

  const categories = ['All', 'Feeding', 'Walk', 'Medication', 'Grooming', 'Play', 'Cleaning'];

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Pet filter
    if (selectedPetId && (task.petId?._id || task.petId) !== selectedPetId) {
      return false;
    }
    // Category filter
    if (filterCategory !== 'All' && task.category !== filterCategory) {
      return false;
    }
    // Status filter
    if (filterStatus === 'Pending' && task.isCompleted) return false;
    if (filterStatus === 'Completed' && !task.isCompleted) return false;

    return true;
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.petId) return;

    await onAddTask(newTask);
    setNewTask({
      petId: selectedPetId || (pets[0] ? pets[0]._id : ''),
      title: '',
      category: 'Feeding',
      time: '08:00 AM',
      frequency: 'Daily',
      notes: '',
    });
    setShowAddForm(false);
  };

  const completedCount = filteredTasks.filter((t) => t.isCompleted).length;
  const pendingCount = filteredTasks.length - completedCount;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">Daily Care Routine</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              {completedCount}/{filteredTasks.length} Completed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep track of feedings, walks, medications, and grooming tasks
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset Today's Tasks */}
          <button
            onClick={onResetTasks}
            title="Reset all tasks to pending for a new day"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Day</span>
          </button>

          {/* Add Task Button */}
          <button
            onClick={() => {
              setNewTask((prev) => ({
                ...prev,
                petId: selectedPetId || (pets[0] ? pets[0]._id : ''),
              }));
              setShowAddForm(!showAddForm);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm shadow-teal-600/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Close Form' : 'Add Routine'}</span>
          </button>
        </div>
      </div>

      {/* Inline Add Task Form */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in duration-150">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Add New Care Routine
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Pet Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">For Pet</label>
              <select
                value={newTask.petId}
                onChange={(e) => setNewTask({ ...newTask, petId: e.target.value })}
                required
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="">Select Pet</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} ({pet.species})
                  </option>
                ))}
              </select>
            </div>

            {/* Task Title */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Afternoon Kibble"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Feeding">Feeding 🥣</option>
                <option value="Walk">Walk 🐾</option>
                <option value="Medication">Medication 💊</option>
                <option value="Grooming">Grooming ✂️</option>
                <option value="Play">Play 🎾</option>
                <option value="Cleaning">Cleaning 🧼</option>
                <option value="Other">Other ✨</option>
              </select>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Scheduled Time</label>
              <input
                type="text"
                placeholder="e.g. 08:30 AM"
                value={newTask.time}
                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3 pt-2">
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
              Save Routine
            </button>
          </div>
        </form>
      )}

      {/* Category Pills and Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-4">
        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-xl transition-colors flex-shrink-0 ${
                filterCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status toggles */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {['All', 'Pending', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-0.5 rounded-lg font-medium transition-all ${
                filterStatus === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Task Checklist Items */}
      <div className="space-y-2 mt-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <CheckCircle2 className="w-10 h-10 text-teal-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-700">No care tasks found</p>
            <p className="text-xs text-slate-400 mt-1">
              {pets.length === 0
                ? 'Add a pet first to start creating daily routines.'
                : 'Click "Add Routine" above to create daily feeding or walk schedules.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const pet = task.petId || {};
            const badgeClass = categoryBadges[task.category] || categoryBadges.Other;

            return (
              <div
                key={task._id}
                onClick={() => onToggleTask(task._id)}
                className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer ${
                  task.isCompleted
                    ? 'bg-slate-50/80 border-slate-200/60 opacity-80'
                    : 'bg-white border-slate-200/90 hover:border-teal-300 hover:shadow-sm'
                }`}
              >
                {/* Left checkbox & details */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    className="text-teal-600 flex-shrink-0 transition-transform active:scale-90"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 fill-teal-600 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-teal-500" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold truncate ${
                          task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      {pet.name && (
                        <span className="font-medium text-slate-600">
                          🐾 {pet.name}
                        </span>
                      )}
                      <span>•</span>
                      <span>⏰ {task.time || 'Anytime'}</span>
                    </div>
                  </div>
                </div>

                {/* Right category tag & delete */}
                <div className="flex items-center gap-2.5 flex-shrink-0 ml-2">
                  <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                    {categoryIcons[task.category] || categoryIcons.Other}
                    <span className="hidden sm:inline">{task.category}</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                    title="Delete Task"
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
