export const MOCK_TRIPS = [
  {
    id: 'trip-101',
    userId: 'user-1',
    title: 'Royal Rajasthan Heritage Route',
    status: 'Upcoming',
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-10-15',
    endDate: '2026-10-23',
    totalBudget: 45000,
    estimatedCost: 38500,
    cities: [
      { cityId: 'city-1', cityName: 'Jaipur', days: 4 },
      { cityId: 'city-6', cityName: 'Udaipur', days: 4 }
    ],
    selectedActivities: ['act-1', 'act-2', 'act-11']
  },
  {
    id: 'trip-102',
    userId: 'user-1',
    title: 'Spiritual Ganges & Mughal Heritage',
    status: 'Completed',
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    startDate: '2025-11-01',
    endDate: '2025-11-07',
    totalBudget: 28000,
    estimatedCost: 24200,
    cities: [
      { cityId: 'city-2', cityName: 'Varanasi', days: 3 },
      { cityId: 'city-8', cityName: 'Agra', days: 3 }
    ],
    selectedActivities: ['act-3', 'act-4', 'act-13']
  },
  {
    id: 'trip-103',
    userId: 'user-2',
    title: 'Himalayan Adventure & High Passes',
    status: 'Upcoming',
    coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-06-05',
    endDate: '2026-06-16',
    totalBudget: 55000,
    estimatedCost: 48000,
    cities: [
      { cityId: 'city-7', cityName: 'Manali', days: 4 },
      { cityId: 'city-5', cityName: 'Leh-Ladakh', days: 7 }
    ],
    selectedActivities: ['act-9', 'act-10', 'act-12']
  }
];
