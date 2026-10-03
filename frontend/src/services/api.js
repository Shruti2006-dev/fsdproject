/**
 * API Service Layer
 * Connects frontend to the Express/MongoDB backend.
 * Includes automatic local fallback data store so the UI is immediately interactive
 * even before starting the backend server!
 */

const API_BASE = '/api';

// Initial Mock dataset for standalone / demo fallback
const localMockState = {
  pets: [
    {
      _id: 'mock_pet_1',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      gender: 'Male',
      ageYears: 3,
      weightKg: 28.5,
      microchipId: '985141002348911',
      allergies: ['Chicken meal', 'Certain flea powders'],
      specialNotes: 'Loves playing fetch at the park. Takes joint supplements in morning.',
      avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'mock_pet_2',
      name: 'Luna',
      species: 'Cat',
      breed: 'British Shorthair',
      gender: 'Female',
      ageYears: 2,
      weightKg: 4.2,
      microchipId: '985141009871234',
      allergies: ['None known'],
      specialNotes: 'Likes wet food in the evening and sleeping on sunlit rugs.',
      avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'mock_pet_3',
      name: 'Mochi',
      species: 'Rabbit',
      breed: 'Holland Lop',
      gender: 'Female',
      ageYears: 1,
      weightKg: 1.8,
      microchipId: '985141005556789',
      allergies: ['Alfalfa hay'],
      specialNotes: 'Needs fresh Timothy hay and leafy greens daily.',
      avatarUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date().toISOString(),
    }
  ],
  tasks: [
    {
      _id: 'mock_task_1',
      petId: { _id: 'mock_pet_1', name: 'Buddy', species: 'Dog', avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80' },
      title: 'Morning Kibble & Joint Supplement',
      category: 'Feeding',
      time: '07:30 AM',
      frequency: 'Daily',
      isCompleted: true,
      completedAt: new Date().toISOString(),
    },
    {
      _id: 'mock_task_2',
      petId: { _id: 'mock_pet_1', name: 'Buddy', species: 'Dog', avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80' },
      title: '30-Minute Neighborhood Walk & Fetch',
      category: 'Walk',
      time: '08:15 AM',
      frequency: 'Daily',
      isCompleted: true,
      completedAt: new Date().toISOString(),
    },
    {
      _id: 'mock_task_3',
      petId: { _id: 'mock_pet_1', name: 'Buddy', species: 'Dog', avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80' },
      title: 'Evening Dinner (Wet + Dry Mix)',
      category: 'Feeding',
      time: '06:30 PM',
      frequency: 'Daily',
      isCompleted: false,
    },
    {
      _id: 'mock_task_4',
      petId: { _id: 'mock_pet_2', name: 'Luna', species: 'Cat', avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80' },
      title: 'Fresh Water Bowl & Dry Food Refill',
      category: 'Feeding',
      time: '08:00 AM',
      frequency: 'Daily',
      isCompleted: true,
      completedAt: new Date().toISOString(),
    },
    {
      _id: 'mock_task_5',
      petId: { _id: 'mock_pet_2', name: 'Luna', species: 'Cat', avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80' },
      title: 'Salmon Pate Dinner & Treat',
      category: 'Feeding',
      time: '07:00 PM',
      frequency: 'Daily',
      isCompleted: false,
    },
    {
      _id: 'mock_task_6',
      petId: { _id: 'mock_pet_3', name: 'Mochi', species: 'Rabbit', avatarUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80' },
      title: 'Fresh Timothy Hay & Leafy Greens',
      category: 'Feeding',
      time: '08:30 AM',
      frequency: 'Daily',
      isCompleted: true,
      completedAt: new Date().toISOString(),
    },
  ],
  healthRecords: [
    {
      _id: 'mock_health_1',
      petId: { _id: 'mock_pet_1', name: 'Buddy', species: 'Dog', avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80' },
      recordType: 'Vaccination',
      title: 'Rabies 3-Year Vaccine Booster',
      dateAdministered: '2024-03-15',
      nextDueDate: '2027-03-15',
      veterinarian: 'Dr. Sarah Jenkins, DVM',
      clinicName: 'Paws & Claws Animal Hospital',
      dosage: '1.0 mL subcutaneous',
      notes: 'No adverse reaction. Healthy heart and clear eyes.',
    },
    {
      _id: 'mock_health_2',
      petId: { _id: 'mock_pet_1', name: 'Buddy', species: 'Dog', avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80' },
      recordType: 'Medication',
      title: 'Heartworm Preventive (NexGard Spectra)',
      dateAdministered: new Date().toISOString().split('T')[0],
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      veterinarian: 'Dr. Sarah Jenkins, DVM',
      clinicName: 'Paws & Claws Animal Hospital',
      dosage: '1 chewable tablet monthly',
      notes: 'Administered with breakfast.',
    },
    {
      _id: 'mock_health_3',
      petId: { _id: 'mock_pet_2', name: 'Luna', species: 'Cat', avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80' },
      recordType: 'Vaccination',
      title: 'FVRCP Core Cat Vaccine',
      dateAdministered: '2024-01-10',
      nextDueDate: '2025-01-10',
      veterinarian: 'Dr. Michael Chang',
      clinicName: 'Happy Whiskers Feline Clinic',
      dosage: '0.5 mL',
      notes: 'Annual booster complete.',
    },
  ],
  appointments: [
    {
      _id: 'mock_app_1',
      petId: { _id: 'mock_pet_1', name: 'Buddy', species: 'Dog', avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80', breed: 'Golden Retriever' },
      clinicName: 'Paws & Claws Animal Hospital',
      doctorName: 'Dr. Sarah Jenkins',
      appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      timeSlot: '10:30 AM',
      reason: 'Semi-Annual Wellness Exam & Weight Check',
      status: 'Scheduled',
      contactPhone: '(555) 234-5678',
      notes: 'Bring stool sample for routine screening.',
    },
    {
      _id: 'mock_app_2',
      petId: { _id: 'mock_pet_2', name: 'Luna', species: 'Cat', avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', breed: 'British Shorthair' },
      clinicName: 'Happy Whiskers Feline Clinic',
      doctorName: 'Dr. Michael Chang',
      appointmentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      timeSlot: '02:00 PM',
      reason: 'Dental Scaling Consultation',
      status: 'Scheduled',
      contactPhone: '(555) 876-5432',
      notes: 'Evaluate molar calculus.',
    },
  ]
};

// Check if server is reachable
let isBackendReachable = true;

// Helper to get stored auth token
export const getAuthToken = () => {
  return localStorage.getItem('petcare_token') || '';
};

// Helper to set stored user session
export const setAuthSession = (user, token) => {
  if (user) localStorage.setItem('petcare_user', JSON.stringify(user));
  if (token) localStorage.setItem('petcare_token', token);
};

// Helper to clear stored user session
export const clearAuthSession = () => {
  localStorage.removeItem('petcare_user');
  localStorage.removeItem('petcare_token');
};

async function fetchJSON(url, options = {}) {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error ${res.status}`);
    }

    isBackendReachable = true;
    return await res.json();
  } catch (error) {
    console.warn(`[API] Backend unreachable or failed on ${url}. Switching to client fallback store. Error:`, error.message);
    isBackendReachable = false;
    throw error;
  }
}

// ---------------- Authentication API ----------------
export const apiRegister = async (userData) => {
  try {
    const res = await fetchJSON(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res.data?.token) {
      setAuthSession(res.data, res.data.token);
    }
    return { success: true, data: res.data, message: res.message };
  } catch (e) {
    // Local fallback for offline/demo registration
    const fallbackUser = {
      _id: 'mock_user_' + Date.now(),
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'pet_owner',
      token: 'mock_token_' + Date.now(),
    };
    setAuthSession(fallbackUser, fallbackUser.token);
    return { success: true, data: fallbackUser, message: 'Account created locally (demo mode)' };
  }
};

export const apiLogin = async (credentials) => {
  try {
    const res = await fetchJSON(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.data?.token) {
      setAuthSession(res.data, res.data.token);
    }
    return { success: true, data: res.data, message: res.message };
  } catch (e) {
    // Local fallback for demo login
    const fallbackUser = {
      _id: 'mock_user_1',
      name: credentials.email.split('@')[0] || 'Pet Owner',
      email: credentials.email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'pet_owner',
      token: 'mock_token_demo_123',
    };
    setAuthSession(fallbackUser, fallbackUser.token);
    return { success: true, data: fallbackUser, message: 'Signed in successfully (demo mode)' };
  }
};

export const apiGetMe = async () => {
  try {
    const res = await fetchJSON(`${API_BASE}/auth/me`);
    return res.data;
  } catch (e) {
    const saved = localStorage.getItem('petcare_user');
    return saved ? JSON.parse(saved) : null;
  }
};

export const apiLogout = () => {
  clearAuthSession();
};

// ---------------- Pet API ----------------
export const apiGetPets = async () => {
  try {
    const res = await fetchJSON(`${API_BASE}/pets`);
    return { data: res.data, isLive: true };
  } catch (e) {
    return { data: [...localMockState.pets], isLive: false };
  }
};

export const apiCreatePet = async (petData) => {
  try {
    const res = await fetchJSON(`${API_BASE}/pets`, {
      method: 'POST',
      body: JSON.stringify(petData),
    });
    return res.data;
  } catch (e) {
    const newPet = {
      _id: 'mock_pet_' + Date.now(),
      ...petData,
      createdAt: new Date().toISOString(),
    };
    localMockState.pets.unshift(newPet);
    return newPet;
  }
};

export const apiUpdatePet = async (id, petData) => {
  try {
    const res = await fetchJSON(`${API_BASE}/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(petData),
    });
    return res.data;
  } catch (e) {
    const index = localMockState.pets.findIndex(p => p._id === id);
    if (index !== -1) {
      localMockState.pets[index] = { ...localMockState.pets[index], ...petData };
      return localMockState.pets[index];
    }
    return petData;
  }
};

export const apiDeletePet = async (id) => {
  try {
    await fetchJSON(`${API_BASE}/pets/${id}`, { method: 'DELETE' });
    return true;
  } catch (e) {
    localMockState.pets = localMockState.pets.filter(p => p._id !== id);
    localMockState.tasks = localMockState.tasks.filter(t => (t.petId?._id || t.petId) !== id);
    localMockState.healthRecords = localMockState.healthRecords.filter(h => (h.petId?._id || h.petId) !== id);
    localMockState.appointments = localMockState.appointments.filter(a => (a.petId?._id || a.petId) !== id);
    return true;
  }
};

// ---------------- Care Tasks API ----------------
export const apiGetTasks = async (petId) => {
  try {
    const url = petId ? `${API_BASE}/tasks?petId=${petId}` : `${API_BASE}/tasks`;
    const res = await fetchJSON(url);
    return res.data;
  } catch (e) {
    if (petId) {
      return localMockState.tasks.filter(t => (t.petId?._id || t.petId) === petId);
    }
    return [...localMockState.tasks];
  }
};

export const apiCreateTask = async (taskData) => {
  try {
    const res = await fetchJSON(`${API_BASE}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return res.data;
  } catch (e) {
    const petObj = localMockState.pets.find(p => p._id === taskData.petId) || { _id: taskData.petId, name: 'Pet' };
    const newTask = {
      _id: 'mock_task_' + Date.now(),
      ...taskData,
      petId: petObj,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    localMockState.tasks.push(newTask);
    return newTask;
  }
};

export const apiToggleTask = async (taskId) => {
  try {
    const res = await fetchJSON(`${API_BASE}/tasks/${taskId}/toggle`, { method: 'PATCH' });
    return res.data;
  } catch (e) {
    const task = localMockState.tasks.find(t => t._id === taskId);
    if (task) {
      task.isCompleted = !task.isCompleted;
      task.completedAt = task.isCompleted ? new Date().toISOString() : null;
      return { ...task };
    }
    throw new Error('Task not found');
  }
};

export const apiDeleteTask = async (taskId) => {
  try {
    await fetchJSON(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' });
    return true;
  } catch (e) {
    localMockState.tasks = localMockState.tasks.filter(t => t._id !== taskId);
    return true;
  }
};

export const apiResetDailyTasks = async (petId) => {
  try {
    await fetchJSON(`${API_BASE}/tasks/reset`, {
      method: 'POST',
      body: JSON.stringify({ petId }),
    });
    return true;
  } catch (e) {
    localMockState.tasks.forEach(t => {
      if (!petId || (t.petId?._id || t.petId) === petId) {
        t.isCompleted = false;
        t.completedAt = null;
      }
    });
    return true;
  }
};

// ---------------- Health Records API ----------------
export const apiGetHealthRecords = async (petId) => {
  try {
    const url = petId ? `${API_BASE}/health?petId=${petId}` : `${API_BASE}/health`;
    const res = await fetchJSON(url);
    return res.data;
  } catch (e) {
    if (petId) {
      return localMockState.healthRecords.filter(h => (h.petId?._id || h.petId) === petId);
    }
    return [...localMockState.healthRecords];
  }
};

export const apiCreateHealthRecord = async (recordData) => {
  try {
    const res = await fetchJSON(`${API_BASE}/health`, {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
    return res.data;
  } catch (e) {
    const petObj = localMockState.pets.find(p => p._id === recordData.petId) || { _id: recordData.petId, name: 'Pet' };
    const newRecord = {
      _id: 'mock_health_' + Date.now(),
      ...recordData,
      petId: petObj,
      createdAt: new Date().toISOString(),
    };
    localMockState.healthRecords.unshift(newRecord);
    return newRecord;
  }
};

export const apiDeleteHealthRecord = async (id) => {
  try {
    await fetchJSON(`${API_BASE}/health/${id}`, { method: 'DELETE' });
    return true;
  } catch (e) {
    localMockState.healthRecords = localMockState.healthRecords.filter(h => h._id !== id);
    return true;
  }
};

// ---------------- Appointments API ----------------
export const apiGetAppointments = async (petId) => {
  try {
    const url = petId ? `${API_BASE}/appointments?petId=${petId}` : `${API_BASE}/appointments`;
    const res = await fetchJSON(url);
    return res.data;
  } catch (e) {
    if (petId) {
      return localMockState.appointments.filter(a => (a.petId?._id || a.petId) === petId);
    }
    return [...localMockState.appointments];
  }
};

export const apiCreateAppointment = async (appData) => {
  try {
    const res = await fetchJSON(`${API_BASE}/appointments`, {
      method: 'POST',
      body: JSON.stringify(appData),
    });
    return res.data;
  } catch (e) {
    const petObj = localMockState.pets.find(p => p._id === appData.petId) || { _id: appData.petId, name: 'Pet' };
    const newApp = {
      _id: 'mock_app_' + Date.now(),
      ...appData,
      petId: petObj,
      createdAt: new Date().toISOString(),
    };
    localMockState.appointments.push(newApp);
    return newApp;
  }
};

export const apiUpdateAppointmentStatus = async (id, status) => {
  try {
    const res = await fetchJSON(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return res.data;
  } catch (e) {
    const app = localMockState.appointments.find(a => a._id === id);
    if (app) {
      app.status = status;
      return { ...app };
    }
    throw new Error('Appointment not found');
  }
};

export const apiDeleteAppointment = async (id) => {
  try {
    await fetchJSON(`${API_BASE}/appointments/${id}`, { method: 'DELETE' });
    return true;
  } catch (e) {
    localMockState.appointments = localMockState.appointments.filter(a => a._id !== id);
    return true;
  }
};
