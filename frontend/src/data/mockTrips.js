import { CITY_IMAGE_MAP } from './cityImageMap';

export const MOCK_TRIPS = [
  {
    id: 'trip-101',
    userId: 'user-1',
    title: 'European Cultural Capitals Tour',
    startDate: '2026-10-10',
    endDate: '2026-10-24',
    status: 'Upcoming',
    coverImage: CITY_IMAGE_MAP.Paris,
    description: 'Explore royal palaces, historic art museums, and culinary monuments across Paris, London, and Rome.',
    totalBudget: 4500,
    cities: [
      {
        cityId: 'city-paris',
        cityName: 'Paris',
        days: 5,
        arrivalDate: '2026-10-10',
        departureDate: '2026-10-15',
        assignedActivities: ['act-paris-1', 'act-paris-2']
      },
      {
        cityId: 'city-london',
        cityName: 'London',
        days: 5,
        arrivalDate: '2026-10-15',
        departureDate: '2026-10-20',
        assignedActivities: ['act-london-1', 'act-london-2']
      },
      {
        cityId: 'city-rome',
        cityName: 'Rome',
        days: 4,
        arrivalDate: '2026-10-20',
        departureDate: '2026-10-24',
        assignedActivities: ['act-rome-1', 'act-rome-2']
      }
    ],
    selectedActivities: ['act-paris-1', 'act-paris-2', 'act-london-1', 'act-london-2', 'act-rome-1', 'act-rome-2'],
    transportChoices: {
      'leg-0-1': 'flight',
      'leg-1-2': 'flight'
    },
    transportFares: {
      'leg-0-1': 180,
      'leg-1-2': 140
    }
  },
  {
    id: 'trip-102',
    userId: 'user-2',
    title: 'Southeast Asia Island & Temple Trail',
    startDate: '2026-11-05',
    endDate: '2026-11-17',
    status: 'Upcoming',
    coverImage: CITY_IMAGE_MAP.Bali,
    description: 'Backpacking through Bali rice terraces, Bangkok street food markets, and Singapore gardens.',
    totalBudget: 2200,
    cities: [
      {
        cityId: 'city-bali',
        cityName: 'Bali',
        days: 5,
        arrivalDate: '2026-11-05',
        departureDate: '2026-11-10',
        assignedActivities: ['act-bali-1']
      },
      {
        cityId: 'city-bangkok',
        cityName: 'Bangkok',
        days: 4,
        arrivalDate: '2026-11-10',
        departureDate: '2026-11-14',
        assignedActivities: ['act-bangkok-1']
      },
      {
        cityId: 'city-singapore',
        cityName: 'Singapore',
        days: 3,
        arrivalDate: '2026-11-14',
        departureDate: '2026-11-17',
        assignedActivities: ['act-singapore-1']
      }
    ],
    selectedActivities: ['act-bali-1', 'act-bangkok-1', 'act-singapore-1'],
    transportChoices: {
      'leg-0-1': 'flight',
      'leg-1-2': 'flight'
    },
    transportFares: {
      'leg-0-1': 120,
      'leg-1-2': 90
    }
  },
  {
    id: 'trip-103',
    userId: 'user-3',
    title: 'Futuristic Skylines & Wellness Retreat',
    startDate: '2026-12-01',
    endDate: '2026-12-10',
    status: 'Upcoming',
    coverImage: CITY_IMAGE_MAP.Dubai,
    description: 'Ultra-luxury stay experiencing Dubai Burj Khalifa, Tokyo skyline, and Singapore Marina Bay.',
    totalBudget: 8500,
    cities: [
      {
        cityId: 'city-dubai',
        cityName: 'Dubai',
        days: 3,
        arrivalDate: '2026-12-01',
        departureDate: '2026-12-04',
        assignedActivities: ['act-dubai-1', 'act-dubai-2']
      },
      {
        cityId: 'city-tokyo',
        cityName: 'Tokyo',
        days: 6,
        arrivalDate: '2026-12-04',
        departureDate: '2026-12-10',
        assignedActivities: ['act-tokyo-1', 'act-tokyo-2']
      }
    ],
    selectedActivities: ['act-dubai-1', 'act-dubai-2', 'act-tokyo-1', 'act-tokyo-2'],
    transportChoices: {
      'leg-0-1': 'flight'
    },
    transportFares: {
      'leg-0-1': 650
    }
  }
];
