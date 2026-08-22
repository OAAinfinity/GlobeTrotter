export const MOCK_CITIES = [
  {
    id: 'city-1',
    name: 'Jaipur',
    country: 'India',
    region: 'North India',
    costIndex: 2, // ₹₹
    costDisplay: '₹₹',
    avgDailyCost: 2800,
    popularityScore: 98,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    description: 'The Pink City of Rajasthan famous for majestic hill forts, ornate royal palaces, vibrant bazaars, and rich Rajasthani thalis.',
    tags: ['Palaces & Forts', 'Heritage', 'Shopping', 'Rajasthani Food'],
    bestSeason: 'Oct to March',
    featured: true
  },
  {
    id: 'city-2',
    name: 'Varanasi',
    country: 'India',
    region: 'North India',
    costIndex: 1, // ₹
    costDisplay: '₹',
    avgDailyCost: 1800,
    popularityScore: 96,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    description: 'One of the world’s oldest continuously inhabited spiritual cities, renowned for ancient Ganges River ghats and hypnotic evening Ganga Aarti.',
    tags: ['Spiritual Ghats', 'Ganga Aarti', 'Ancient History', 'Silk Sarees'],
    bestSeason: 'Nov to Feb',
    featured: true
  },
  {
    id: 'city-3',
    name: 'Goa',
    country: 'India',
    region: 'West India',
    costIndex: 3, // ₹₹₹
    costDisplay: '₹₹₹',
    avgDailyCost: 3800,
    popularityScore: 97,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Tropical coastal state offering golden palm-fringed beaches, Portuguese colonial architecture, beach shacks, and water sports.',
    tags: ['Beaches', 'Water Sports', 'Nightlife', 'Portuguese Heritage'],
    bestSeason: 'Nov to Feb',
    featured: true
  },
  {
    id: 'city-4',
    name: 'Kochi',
    country: 'India',
    region: 'South India',
    costIndex: 2, // ₹₹
    costDisplay: '₹₹',
    avgDailyCost: 2600,
    popularityScore: 94,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    description: 'Gateway to Kerala’s backwaters featuring Chinese fishing nets, colonial spice trading streets, Kathakali dance, and serene houseboats.',
    tags: ['Backwaters', 'Chinese Fishing Nets', 'Ayurveda', 'Seafood'],
    bestSeason: 'Sept to March',
    featured: true
  },
  {
    id: 'city-5',
    name: 'Leh-Ladakh',
    country: 'India',
    region: 'Himalayan Region',
    costIndex: 3, // ₹₹₹
    costDisplay: '₹₹₹',
    avgDailyCost: 4200,
    popularityScore: 99,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    description: 'High-altitude desert wonderland framed by snow-capped Himalayan peaks, Pangong Tso lake, and ancient Buddhist monasteries.',
    tags: ['High Mountain Passes', 'Pangong Lake', 'Monasteries', 'Adventure Drives'],
    bestSeason: 'May to Sept',
    featured: true
  },
  {
    id: 'city-6',
    name: 'Udaipur',
    country: 'India',
    region: 'West India',
    costIndex: 3, // ₹₹₹
    costDisplay: '₹₹₹',
    avgDailyCost: 3500,
    popularityScore: 95,
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    description: 'The Venice of the East, romantic city of serene lakes, marble water palaces, vintage car museums, and rooftop dining.',
    tags: ['Lake Pichola', 'City Palace', 'Romantic Stays', 'Rooftop Cafes'],
    bestSeason: 'Sept to March',
    featured: false
  },
  {
    id: 'city-7',
    name: 'Manali',
    country: 'India',
    region: 'Himalayan Region',
    costIndex: 2, // ₹₹
    costDisplay: '₹₹',
    avgDailyCost: 2500,
    popularityScore: 93,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    description: 'Picturesque Himalayan hill station surrounded by pine forests, Solang Valley snow sports, apple orchards, and mountain streams.',
    tags: ['Snow Mountains', 'Solang Valley', 'Paragliding', 'Old Manali Cafes'],
    bestSeason: 'Oct to June',
    featured: false
  },
  {
    id: 'city-8',
    name: 'Agra',
    country: 'India',
    region: 'North India',
    costIndex: 2, // ₹₹
    costDisplay: '₹₹',
    avgDailyCost: 2200,
    popularityScore: 96,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    description: 'Home to the iconic Taj Mahal, Agra Fort, Fatehpur Sikri, and famous Mughlai delicacies and petha sweets.',
    tags: ['Taj Mahal', 'Agra Fort', 'Mughal Architecture', 'Heritage'],
    bestSeason: 'Oct to March',
    featured: false
  },
  {
    id: 'city-9',
    name: 'Rishikesh',
    country: 'India',
    region: 'Himalayan Region',
    costIndex: 1, // ₹
    costDisplay: '₹',
    avgDailyCost: 1900,
    popularityScore: 92,
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    description: 'Yoga Capital of the World along the pristine upper Ganges, offering white-water rafting, suspension bridges, and Beatles ashram.',
    tags: ['Yoga & Meditation', 'White Water Rafting', 'Laxman Jhula', 'Ganges River'],
    bestSeason: 'Sept to Nov & Feb to May',
    featured: false
  },
  {
    id: 'city-10',
    name: 'Darjeeling',
    country: 'India',
    region: 'East & North-East',
    costIndex: 2, // ₹₹
    costDisplay: '₹₹',
    avgDailyCost: 2400,
    popularityScore: 91,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description: 'Queen of the Hills set against Kanchenjunga mountain, famous for UNESCO Toy Train, sprawling tea gardens, and crisp air.',
    tags: ['Tea Gardens', 'UNESCO Toy Train', 'Kanchenjunga Views', 'Buddhist Monasteries'],
    bestSeason: 'March to May & Oct to Nov',
    featured: false
  },
  {
    id: 'city-11',
    name: 'Amritsar',
    country: 'India',
    region: 'North India',
    costIndex: 1, // ₹
    costDisplay: '₹',
    avgDailyCost: 2000,
    popularityScore: 94,
    image: 'https://images.unsplash.com/photo-1588096344356-9a3d463d1f05?auto=format&fit=crop&w=800&q=80',
    description: 'Spiritual sanctuary housing the breathtaking Golden Temple (Harmandir Sahib), Wagah Border ceremony, and rich Punjabi kulchas.',
    tags: ['Golden Temple', 'Wagah Border', 'Punjabi Cuisine', 'Spiritual Harmony'],
    bestSeason: 'Oct to March',
    featured: false
  },
  {
    id: 'city-12',
    name: 'Shillong',
    country: 'India',
    region: 'East & North-East',
    costIndex: 2, // ₹₹
    costDisplay: '₹₹',
    avgDailyCost: 2300,
    popularityScore: 90,
    image: 'https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&w=800&q=80',
    description: 'Scotland of the East, famed for pine-covered hills, crystal waterfalls, live music rock scene, and nearby Living Root Bridges.',
    tags: ['Living Root Bridges', 'Waterfalls', 'Rock Music', 'Pine Hills'],
    bestSeason: 'Sept to May',
    featured: false
  },
  {
    id: 'city-13',
    name: 'Mumbai',
    country: 'India',
    region: 'West India',
    costIndex: 4, // ₹₹₹₹
    costDisplay: '₹₹₹₹',
    avgDailyCost: 5500,
    popularityScore: 95,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    description: 'City of Dreams, home to Gateway of India, Marine Drive Queen’s Necklace, Bollywood film city, and vibrant street food.',
    tags: ['Gateway of India', 'Marine Drive', 'Bollywood', 'Vada Pav & Street Food'],
    bestSeason: 'Nov to Feb',
    featured: false
  },
  {
    id: 'city-14',
    name: 'Ooty',
    country: 'India',
    region: 'South India',
    costIndex: 2, // ₹₹
    costDisplay: '₹₹',
    avgDailyCost: 2500,
    popularityScore: 89,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    description: 'Charming Nilgiri hill station surrounded by tea plantations, botanical gardens, misty lakes, and heritage mountain railways.',
    tags: ['Nilgiri Mountain Railway', 'Tea Estates', 'Botanical Gardens', 'Cool Climate'],
    bestSeason: 'Oct to June',
    featured: false
  },
  {
    id: 'city-15',
    name: 'Kolkata',
    country: 'India',
    region: 'East & North-East',
    costIndex: 1, // ₹
    costDisplay: '₹',
    avgDailyCost: 1900,
    popularityScore: 91,
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
    description: 'Cultural Capital of India, famous for Victoria Memorial, historic yellow trams, Howrah Bridge, art galleries, and Bengali sweets.',
    tags: ['Victoria Memorial', 'Howrah Bridge', 'Yellow Trams', 'Bengali Sweets & Mishti'],
    bestSeason: 'Oct to March',
    featured: false
  }
];
