import { CITY_IMAGE_MAP } from './cityImageMap';

export const MOCK_CITIES = [
  {
    id: 'city-paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: 3, // $$$
    costDisplay: '$$$',
    avgDailyCost: 280, // USD
    popularityScore: 99,
    image: CITY_IMAGE_MAP.Paris,
    description: 'The City of Light famed for the iconic Eiffel Tower, Louvre Museum, romantic Seine river cruises, and haute cuisine.',
    tags: ['Eiffel Tower', 'Museums', 'Cuisine', 'Romance'],
    bestSeason: 'Apr to Oct',
    featured: true
  },
  {
    id: 'city-london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    costIndex: 3, // $$$
    costDisplay: '$$$',
    avgDailyCost: 290,
    popularityScore: 98,
    image: CITY_IMAGE_MAP.London,
    description: 'Historic global metropolis featuring Big Ben, Tower Bridge, West End theater district, royal palaces, and world-class museums.',
    tags: ['Big Ben', 'Tower Bridge', 'Royal Palaces', 'West End'],
    bestSeason: 'May to Sept',
    featured: true
  },
  {
    id: 'city-dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    costIndex: 4, // $$$$
    costDisplay: '$$$$',
    avgDailyCost: 350,
    popularityScore: 97,
    image: CITY_IMAGE_MAP.Dubai,
    description: 'Futuristic desert oasis home to Burj Khalifa, luxury shopping malls, Palm Jumeirah islands, and desert safaris.',
    tags: ['Burj Khalifa', 'Luxury Shopping', 'Desert Safari', 'Modern Architecture'],
    bestSeason: 'Nov to March',
    featured: true
  },
  {
    id: 'city-rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    costIndex: 2, // $$
    costDisplay: '$$',
    avgDailyCost: 220,
    popularityScore: 96,
    image: CITY_IMAGE_MAP.Rome,
    description: 'The Eternal City packed with ancient wonders like the Colosseum, Vatican City, Trevi Fountain, and mouthwatering pasta & gelato.',
    tags: ['Colosseum', 'Vatican City', 'Italian Pasta', 'Ancient Ruins'],
    bestSeason: 'April to June & Sept to Oct',
    featured: true
  },
  {
    id: 'city-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    costIndex: 3, // $$$
    costDisplay: '$$$',
    avgDailyCost: 260,
    popularityScore: 99,
    image: CITY_IMAGE_MAP.Tokyo,
    description: 'Vibrant juxtaposition of futuristic neon skyscrapers, Shibuya Crossing, ancient Senso-ji temples, and Michelin ramen spots.',
    tags: ['Shibuya Crossing', 'Ramen & Sushi', 'Temples', 'Futuristic Tech'],
    bestSeason: 'March to May & Sept to Nov',
    featured: true
  },
  {
    id: 'city-sydney',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    costIndex: 3, // $$$
    costDisplay: '$$$',
    avgDailyCost: 270,
    popularityScore: 95,
    image: CITY_IMAGE_MAP.Sydney,
    description: 'Coastal paradise featuring the magnificent Sydney Opera House, Harbour Bridge, Bondi Beach surfing, and sunny outdoor dining.',
    tags: ['Opera House', 'Harbour Bridge', 'Bondi Beach', 'Surfing'],
    bestSeason: 'Sept to Nov & Feb to April',
    featured: true
  },
  {
    id: 'city-mumbai',
    name: 'Mumbai',
    country: 'India',
    region: 'Asia',
    costIndex: 2, // $$
    costDisplay: '$$',
    avgDailyCost: 150,
    popularityScore: 94,
    image: CITY_IMAGE_MAP.Mumbai,
    description: 'Dynamic coastal commercial capital boasting the Gateway of India, Marine Drive promenade, Bollywood glam, and street food.',
    tags: ['Gateway of India', 'Marine Drive', 'Bollywood', 'Street Food'],
    bestSeason: 'Nov to Feb',
    featured: false
  },
  {
    id: 'city-singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    costIndex: 4, // $$$$
    costDisplay: '$$$$',
    avgDailyCost: 320,
    popularityScore: 96,
    image: CITY_IMAGE_MAP.Singapore,
    description: 'Garden city metropolis with iconic Marina Bay Sands, Supertree Grove at Gardens by the Bay, hawker street markets, and luxury living.',
    tags: ['Marina Bay Sands', 'Gardens by the Bay', 'Hawker Food', 'Futuristic Gardens'],
    bestSeason: 'Year-round',
    featured: false
  },
  {
    id: 'city-barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    costIndex: 2, // $$
    costDisplay: '$$',
    avgDailyCost: 210,
    popularityScore: 95,
    image: CITY_IMAGE_MAP.Barcelona,
    description: 'Mediterranean city celebrated for Gaudí’s Sagrada Família, Gothic Quarter streets, tapas bars, and lively Mediterranean beaches.',
    tags: ['Sagrada Família', 'Gaudí Architecture', 'Tapas & Sangria', 'Beaches'],
    bestSeason: 'May to June & Sept to Oct',
    featured: false
  },
  {
    id: 'city-amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    costIndex: 2, // $$
    costDisplay: '$$',
    avgDailyCost: 230,
    popularityScore: 94,
    image: CITY_IMAGE_MAP.Amsterdam,
    description: 'Enchanting capital of canal bridges, Van Gogh & Rijksmuseum masterpieces, bicycle culture, and historic merchant houses.',
    tags: ['Canal Cruises', 'Rijksmuseum', 'Bicycle Culture', 'Historic Canals'],
    bestSeason: 'April to May & Sept to Nov',
    featured: false
  },
  {
    id: 'city-istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    region: 'Europe & Asia',
    costIndex: 2, // $$
    costDisplay: '$$',
    avgDailyCost: 170,
    popularityScore: 96,
    image: CITY_IMAGE_MAP.Istanbul,
    description: 'Crossroads of continents where East meets West, featuring Hagia Sophia, Blue Mosque, Grand Bazaar, and Bosphorus boat tours.',
    tags: ['Hagia Sophia', 'Bosphorus Cruises', 'Grand Bazaar', 'Turkish Delights'],
    bestSeason: 'April to May & Sept to Nov',
    featured: false
  },
  {
    id: 'city-bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    costIndex: 1, // $
    costDisplay: '$',
    avgDailyCost: 120,
    popularityScore: 97,
    image: CITY_IMAGE_MAP.Bangkok,
    description: 'Bustling capital of gold-spired Grand Palace temples, floating night markets, tuk-tuks, and world-renowned street food stalls.',
    tags: ['Grand Palace', 'Floating Markets', 'Street Food', 'Temples'],
    bestSeason: 'Nov to Feb',
    featured: false
  },
  {
    id: 'city-seoul',
    name: 'Seoul',
    country: 'South Korea',
    region: 'Asia',
    costIndex: 2, // $$
    costDisplay: '$$',
    avgDailyCost: 200,
    popularityScore: 95,
    image: CITY_IMAGE_MAP.Seoul,
    description: 'K-culture hub blending royal Gyeongbokgung Palace with futuristic Gangnam skyscrapers, K-pop style, and K-BBQ food scenes.',
    tags: ['Gyeongbokgung Palace', 'K-BBQ', 'Gangnam', 'Shopping & K-Pop'],
    bestSeason: 'Sept to Nov & March to May',
    featured: false
  },
  {
    id: 'city-sanfrancisco',
    name: 'San Francisco',
    country: 'United States',
    region: 'North America',
    costIndex: 3, // $$$
    costDisplay: '$$$',
    avgDailyCost: 280,
    popularityScore: 93,
    image: CITY_IMAGE_MAP['San Francisco'],
    description: 'Bay area icon famous for the Golden Gate Bridge, cable cars, Fisherman’s Wharf, Alcatraz Island, and tech innovation.',
    tags: ['Golden Gate Bridge', 'Cable Cars', 'Alcatraz', 'Bay Area'],
    bestSeason: 'Sept to Nov',
    featured: false
  },
  {
    id: 'city-lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    region: 'Europe',
    costIndex: 2, // $$
    costDisplay: '$$',
    avgDailyCost: 180,
    popularityScore: 93,
    image: CITY_IMAGE_MAP.Lisbon,
    description: 'Sun-drenched coastal capital of pastel hills, historic yellow Tram 28, Belém pastéis de nata pastries, and Fado music.',
    tags: ['Yellow Trams', 'Belém Pastries', 'Fado Music', 'Coastal Views'],
    bestSeason: 'March to May & Sept to Oct',
    featured: false
  },
  {
    id: 'city-capetown',
    name: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    costIndex: 2, // $$
    costDisplay: '$$',
    avgDailyCost: 190,
    popularityScore: 92,
    image: CITY_IMAGE_MAP['Cape Town'],
    description: 'Dramatic coastal landscape dominated by Table Mountain, V&A Waterfront, Boulders Beach penguins, and Cape winelands.',
    tags: ['Table Mountain', 'Penguins', 'Cape Winelands', 'Coastal Scenic'],
    bestSeason: 'Nov to April',
    featured: false
  },
  {
    id: 'city-lima',
    name: 'Lima',
    country: 'Peru',
    region: 'South America',
    costIndex: 1, // $
    costDisplay: '$',
    avgDailyCost: 130,
    popularityScore: 90,
    image: CITY_IMAGE_MAP.Lima,
    description: 'Gastronomic capital of South America overlooking the Pacific, famed for fresh ceviche, Miraflores cliffside walks, and colonial plazas.',
    tags: ['Ceviche & Culinary', 'Miraflores', 'Pacific Cliffs', 'Colonial Plazas'],
    bestSeason: 'Dec to April',
    featured: false
  },
  {
    id: 'city-mexicocity',
    name: 'Mexico City',
    country: 'Mexico',
    region: 'North America',
    costIndex: 1, // $
    costDisplay: '$',
    avgDailyCost: 140,
    popularityScore: 92,
    image: CITY_IMAGE_MAP['Mexico City'],
    description: 'Vibrant cultural metropolis featuring Palacio de Bellas Artes, Frida Kahlo Museum, ancient Teotihuacan pyramids, and taco markets.',
    tags: ['Palacio de Bellas Artes', 'Tacos & Mezcal', 'Frida Kahlo', 'Aztec Pyramids'],
    bestSeason: 'March to May',
    featured: false
  },
  {
    id: 'city-bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    costIndex: 1, // $
    costDisplay: '$',
    avgDailyCost: 110,
    popularityScore: 98,
    image: CITY_IMAGE_MAP.Bali,
    description: 'Island of the Gods featuring lush Ubud rice terraces, cliffside sea temples, surf beaches, and holistic beach resorts.',
    tags: ['Ubud Rice Terraces', 'Sea Temples', 'Surfing & Beaches', 'Wellness Resorts'],
    bestSeason: 'April to Oct',
    featured: false
  }
];
