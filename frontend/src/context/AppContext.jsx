import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockUsers';
import { MOCK_CITIES } from '../data/mockCities';
import { MOCK_ACTIVITIES } from '../data/mockActivities';
import { MOCK_TRIPS } from '../data/mockTrips';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Initialize current user from localStorage or seed with default Maya Lin
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('globetrotter_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_USERS[0]; // Default logged-in user for effortless exploration
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
  const login = (email, password) => {
    const targetUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!targetUser) {
      throw new Error('No account found with this email address.');
    }
    if (targetUser.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }
    setCurrentUser(targetUser);
    showToast(`Welcome back, ${targetUser.name}! 👋`, 'success');
    return targetUser;
  };

  const signup = (name, email, password) => {
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
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

    setUsers((prev) => [...prev, newUser]);
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
