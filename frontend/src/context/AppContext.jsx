import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockUsers';
import { MOCK_CITIES } from '../data/mockCities';
import { MOCK_ACTIVITIES } from '../data/mockActivities';
import { MOCK_TRIPS } from '../data/mockTrips';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Restore only the authenticated user; new sessions start signed out.
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('globetrotter_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('globetrotter_users_db');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_USERS;
  });

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('globetrotter_trips');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_TRIPS;
  });

  const [cities] = useState(MOCK_CITIES);
  const [activities] = useState(MOCK_ACTIVITIES);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('globetrotter_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('globetrotter_user');
    }
  }, [currentUser]);

  // Sync users DB to localStorage
  useEffect(() => {
    localStorage.setItem('globetrotter_users_db', JSON.stringify(users));
  }, [users]);

  // Sync trips to localStorage
  useEffect(() => {
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
  }, [trips]);

  // Toast notification helper
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Methods
  const login = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to sign in.');

    setCurrentUser(data);
    showToast(`Welcome back, ${data.name}! 👋`, 'success');
    return data;
  };

  const signup = async (name, email, password) => {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to create account.');

    const newUser = {
      ...data,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
      bio: 'Excited traveler exploring the world with GlobeTrotter!',
      travelStyle: 'Explorer',
      preferences: {
        budgetLevel: 'Moderate',
        pace: 'Balanced',
        interests: ['Sightseeing', 'Food & Dining']
      },
      homeCity: 'Global Citizen',
      tripsCount: 0
    };

    setCurrentUser(newUser);
    showToast(`Account created successfully! Welcome, ${name} 🎉`, 'success');
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out safely.', 'info');
  };

  const updateProfile = (updatedData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('Profile updated successfully!', 'success');
  };

  // Trip Methods
  const addTrip = (newTripData) => {
    const newTrip = {
      id: `trip-${Date.now()}`,
      userId: currentUser ? currentUser.id : 'guest',
      status: 'Upcoming',
      selectedActivities: [],
      ...newTripData
    };
    setTrips((prev) => [newTrip, ...prev]);
    showToast(`Trip "${newTrip.title}" created! ✈️`, 'success');
    return newTrip;
  };

  const updateTrip = (tripId, updatedData) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, ...updatedData } : t))
    );
    showToast('Trip itinerary updated!', 'success');
  };

  const deleteTrip = (tripId) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    showToast('Trip removed.', 'info');
  };

  const value = {
    currentUser,
    users,
    cities,
    activities,
    trips,
    toastMessage,
    login,
    signup,
    logout,
    updateProfile,
    addTrip,
    updateTrip,
    deleteTrip,
    showToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
