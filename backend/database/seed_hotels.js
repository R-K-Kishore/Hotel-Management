// Seed script for 20 Real Hotels across India
// Idempotent: Can be run multiple times without creating duplicate records.

const pool = require('../config/db');

// List of dummy hotel titles created during initial development tests
const OLD_TEST_TITLES = [
  'Sunshine Grand Hotel',
  'Sunset Beach Resort',
  'Mountain View Lodge',
  'City Central Hotel',
  'Royal Heritage Palace',
  'Garden Inn',
  'Harbor View Suites',
  'Desert Oasis Resort',
  'Riverside Boutique',
  'Airport Plaza Hotel',
  'The Grand Meridian',
  'Lakeside Retreat',
  'Grand Palace Hotel Paris (Updated)'
];

const REAL_HOTELS = [
  {
    slug: 'taj-mahal-palace-mumbai',
    title: 'The Taj Mahal Palace, Mumbai',
    address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    latitude: 18.9217000,
    longitude: 72.8332000,
    price: 28500.00,
    description: "Opened in 1903, The Taj Mahal Palace is India's first luxury hotel, standing majestically opposite the Gateway of India. With panoramic Arabian Sea views, 9 acclaimed restaurants, and grand Indo-Saracenic architecture, it is a global hospitality legend.",
    facilities: "Swimming Pool, Jiva Spa, 9 Multi-Cuisine Restaurants, Sea View Rooms, Palace Butler Service, Fitness Centre, Grand Ballroom, Valet Parking, Free High-Speed WiFi",
    image: 'uploads/hotels/taj-mahal-palace-mumbai/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/taj-mahal-palace-mumbai/reception.jpg', caption: 'Grand lobby with Italian marble and Belgian chandeliers', source: 'Official Hotel Archive / Wikimedia Commons' },
      { category: 'Rooms', path: 'uploads/hotels/taj-mahal-palace-mumbai/rooms.jpg', caption: 'Luxury sea-facing heritage room with handcrafted furnishings', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/taj-mahal-palace-mumbai/pool.jpg', caption: 'Outdoor swimming pool surrounded by landscaped palms', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/taj-mahal-palace-mumbai/restaurant.jpg', caption: 'Wasabi by Morimoto & Shamiana signature dining venues', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Other Facilities', path: 'uploads/hotels/taj-mahal-palace-mumbai/facilities.jpg', caption: 'Jiva Spa & Wellness Pavilion with holistic therapies', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'oberoi-grand-kolkata',
    title: 'The Oberoi Grand, Kolkata',
    address: '15 Jawaharlal Nehru Road, New Market, Kolkata, West Bengal 700013',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    latitude: 22.5600000,
    longitude: 88.3516000,
    price: 14500.00,
    description: "Affectionately known as the 'Grande Dame of Chowringhee', The Oberoi Grand dates back to the 1880s in central Kolkata. It features stately neoclassical architecture, a tranquil courtyard swimming pool, lush palm gardens, and award-winning dining.",
    facilities: "Courtyard Swimming Pool, Oberoi Spa, Baan Thai & Threesixtythree° Dining, 24-Hour Fitness Centre, Concierge, Heritage Suites, Business Centre",
    image: 'uploads/hotels/oberoi-grand-kolkata/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/oberoi-grand-kolkata/reception.jpg', caption: 'Victorian colonial lobby with Burmese teak and antique chandeliers', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/oberoi-grand-kolkata/rooms.jpg', caption: 'Premier room with colonial four-poster bed and marble bath', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/oberoi-grand-kolkata/pool.jpg', caption: 'Iconic courtyard swimming pool amidst royal palm trees', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/oberoi-grand-kolkata/garden.jpg', caption: 'Manicured tropical courtyard gardens and walkways', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/oberoi-grand-kolkata/restaurant.jpg', caption: 'Baan Thai authentic dining and Threesixtythree° bistro', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'leela-palace-bengaluru',
    title: 'The Leela Palace Bengaluru',
    address: '23 HAL Old Airport Road, Kodihalli, Bengaluru, Karnataka 560008',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9606000,
    longitude: 77.6484000,
    price: 19500.00,
    description: "Inspired by the grand architectural heritage of Mysore Palace, The Leela Palace Bengaluru stands amidst seven acres of lush landscaped gardens with ornate ceilings, crystal chandeliers, gold leaf domes, and world-class luxury accommodations.",
    facilities: "Outdoor Lagoon Pool, Spa & Wellness Centre, 4 Award-Winning Restaurants (Jamavar, Citrus, Le Cirque), 7 Acres Landscaped Gardens, Fitness Centre, Luxury Saloon",
    image: 'uploads/hotels/leela-palace-bengaluru/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/leela-palace-bengaluru/reception.jpg', caption: 'Royal lobby with gold leaf domes, crystal chandeliers and brass urns', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/leela-palace-bengaluru/rooms.jpg', caption: 'Royal Premiere room with private balcony and classical Indian artwork', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/leela-palace-bengaluru/pool.jpg', caption: 'Outdoor lagoon swimming pool flanked by tropical frangipani trees', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/leela-palace-bengaluru/garden.jpg', caption: 'Seven acres of lush botanical gardens and palace water fountains', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/leela-palace-bengaluru/restaurant.jpg', caption: 'Jamavar royal Indian dining room and Citrus brasserie', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'taj-coromandel-chennai',
    title: 'Taj Coromandel, Chennai',
    address: '37 Mahatma Gandhi Road, Nungambakkam, Chennai, Tamil Nadu 600034',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 13.0607000,
    longitude: 80.2474000,
    price: 12500.00,
    description: "Taj Coromandel is one of South India's premier luxury hotels, seamlessly combining South Indian design motifs with classic European elegance, boasting celebrated culinary destinations such as Southern Spice and Golden Dragon.",
    facilities: "Outdoor Swimming Pool, Jiva Spa, 5 Signature Dining Outlets (Southern Spice, Golden Dragon), 24-Hour Fitness Centre, Ballroom, Valet Parking, Concierge",
    image: 'uploads/hotels/taj-coromandel-chennai/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/taj-coromandel-chennai/reception.jpg', caption: 'Opulent lobby with bronze sculptures and South Indian floral rangoli', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/taj-coromandel-chennai/rooms.jpg', caption: 'Luxury club room with city skyline views and executive amenities', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/taj-coromandel-chennai/pool.jpg', caption: 'Serene outdoor swimming pool with private sun-loungers', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/taj-coromandel-chennai/restaurant.jpg', caption: 'Southern Spice fine dining featuring royal regional cuisines', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Other Facilities', path: 'uploads/hotels/taj-coromandel-chennai/facilities.jpg', caption: 'Jiva Spa & 24-Hour Fitness Centre', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'grand-hyatt-kochi',
    title: 'Grand Hyatt Kochi Bolgatty',
    address: 'Bolgatty Island, Mulavukad, Kochi, Kerala 682504',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    latitude: 9.9882000,
    longitude: 76.2694000,
    price: 13500.00,
    description: "Situated on Bolgatty Island amidst the peaceful backwaters of Vembanad Lake, Grand Hyatt Kochi is an exceptional waterfront luxury resort featuring spectacular water views, authentic Kerala architecture, and expansive tropical gardens.",
    facilities: "Indoor & Outdoor Swimming Pools, Santata Ayurvedic Spa, 3 Waterfront Restaurants & Lounges, Watersports Marina, Tennis Courts, Helipad, Fitness Centre",
    image: 'uploads/hotels/grand-hyatt-kochi/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/grand-hyatt-kochi/reception.jpg', caption: 'Soaring glass-walled lobby overlooking backwater channels and Kerala art', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/grand-hyatt-kochi/rooms.jpg', caption: 'Waterfront suite with private balcony overlooking the serene lagoons', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/grand-hyatt-kochi/pool.jpg', caption: 'Expansive outdoor infinity pool overlooking Vembanad Lake', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/grand-hyatt-kochi/garden.jpg', caption: 'Lush tropical island lawns and waterside walking promenade', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/grand-hyatt-kochi/restaurant.jpg', caption: 'Malabar Cafe and Colony Clubhouse waterfront dining', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'the-imperial-delhi',
    title: 'The Imperial, New Delhi',
    address: '1 Janpath, Connaught Place, New Delhi, Delhi 110001',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.6239000,
    longitude: 77.2177000,
    price: 22000.00,
    description: "Built in 1931 by Blomfield, The Imperial is an iconic museum hotel in the heart of the national capital. It features Victorian, Art Deco and colonial architecture, housing an irreplaceable collection of 17th and 18th-century British Indian art.",
    facilities: "Imperial Spa & Salon, Outdoor Swimming Pool, 8 Historic Dining Venues & Bars, Historic Art Gallery, High Tea Lounge, Luxury Arcade, Fitness Centre",
    image: 'uploads/hotels/the-imperial-delhi/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/the-imperial-delhi/reception.jpg', caption: 'Historic museum lobby housing authentic 18th-century art collections', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/the-imperial-delhi/rooms.jpg', caption: 'Heritage room with high ceilings, colonial teak furniture and marble bath', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/the-imperial-delhi/pool.jpg', caption: 'Freeform outdoor pool nestled within manicured royal palm grounds', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/the-imperial-delhi/garden.jpg', caption: 'Eight acres of landscaped lawns and shaded colonial verandahs', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/the-imperial-delhi/restaurant.jpg', caption: 'The 1911 Restaurant and Daniell’s Tavern colonial dining venues', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'rambagh-palace-jaipur',
    title: 'Rambagh Palace, Jaipur',
    address: 'Bhawani Singh Road, Rambagh, Jaipur, Rajasthan 302005',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    latitude: 26.8978000,
    longitude: 75.8080000,
    price: 48000.00,
    description: "Once the residence of the Maharaja of Jaipur, the 'Jewel of Jaipur' is spread across 47 acres of tranquil gardens. Rambagh Palace offers guests royal luxury with marble lattice work, sandstone balustrades, cupolas, and magnificent Mughal gardens.",
    facilities: "Indoor Marble Pool, Outdoor Pool, Jiva Grande Spa, Fine Dining at Suvarna Mahal, Polo Bar, 47 Acres of Peacocks & Gardens, Vintage Car Transfers, Croquet Lawn",
    image: 'uploads/hotels/rambagh-palace-jaipur/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/rambagh-palace-jaipur/reception.jpg', caption: 'Grand palace foyer with carved sandstone arches and royal greeting rituals', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/rambagh-palace-jaipur/rooms.jpg', caption: 'Palace suite featuring royal jharokhas, silk draperies and antique chandeliers', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/rambagh-palace-jaipur/pool.jpg', caption: 'Regal outdoor swimming pool framed by marble pavilions', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/rambagh-palace-jaipur/garden.jpg', caption: '47 acres of ornamental Mughal gardens where peacocks wander freely', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/rambagh-palace-jaipur/restaurant.jpg', caption: 'Suvarna Mahal palace dining hall with gilded mirrors and crystal tableware', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'taj-falaknuma-hyderabad',
    title: 'Taj Falaknuma Palace, Hyderabad',
    address: 'Engine Bowli, Falaknuma, Hyderabad, Telangana 500053',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.3314000,
    longitude: 78.4678000,
    price: 42000.00,
    description: "Perched 2,000 feet above Hyderabad, Taj Falaknuma Palace was the former residence of the Nizam of Hyderabad. The scorpion-shaped palace made of Italian marble features venetian chandeliers, stained glass, and royal carriage arrivals.",
    facilities: "Royal Dining (Adaa, Celeste), Palace Library with Rare Manuscripts, Jiva Spa, Heritage Walking Tours, Outdoor Pool, Billiards Room, Horse Carriage Arrival",
    image: 'uploads/hotels/taj-falaknuma-hyderabad/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/taj-falaknuma-hyderabad/reception.jpg', caption: 'Grand marble grand staircase with ornate Italian marble fountains', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/taj-falaknuma-hyderabad/rooms.jpg', caption: 'Royal suite with Nizam-era tapestries, Belgian crystal and royal bedstead', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/taj-falaknuma-hyderabad/pool.jpg', caption: 'Outdoor swimming pool overlooking panoramic views of Hyderabad city', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/taj-falaknuma-hyderabad/garden.jpg', caption: 'Mughal and Rajasthani courtyard gardens with marble balustrades', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/taj-falaknuma-hyderabad/restaurant.jpg', caption: 'Adaa fine dining featuring slow-cooked royal Hyderabadi cuisine', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'taj-fort-aguada-goa',
    title: 'Taj Fort Aguada Resort & Spa, Goa',
    address: 'Sinquerim, Candolim, North Goa, Goa 403515',
    city: 'Candolim',
    state: 'Goa',
    country: 'India',
    latitude: 15.4989000,
    longitude: 73.7669000,
    price: 19500.00,
    description: "Built on the ramparts of a 16th-century Portuguese fortress overlooking Sinquerim Beach, this 5-star beachfront luxury resort offers panoramic views of the Arabian Sea, private sea-facing cottages, and swaying palm groves.",
    facilities: "Direct Beach Access, Freeform Sea-Facing Pool, Jiva Spa, 5 Sea-View Restaurants & Bars, Water Sports Facility, Tennis Court, Kids Activity Centre",
    image: 'uploads/hotels/taj-fort-aguada-goa/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/taj-fort-aguada-goa/reception.jpg', caption: 'Breezy open-air lobby with Portuguese-Goan terracotta tiles and ocean vistas', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/taj-fort-aguada-goa/rooms.jpg', caption: 'Sea-view luxury cottage with private sun deck overlooking the waves', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/taj-fort-aguada-goa/pool.jpg', caption: 'Spectacular freeform swimming pool with views of the Arabian Sea', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/taj-fort-aguada-goa/garden.jpg', caption: 'Tropical palm groves with direct private access to Sinquerim Beach', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/taj-fort-aguada-goa/restaurant.jpg', caption: 'Morisco fresh seafood restaurant and SFX open-air lounge bar', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'oberoi-amarvilas-agra',
    title: 'The Oberoi Amarvilas, Agra',
    address: 'Taj East Gate Road, Agra, Uttar Pradesh 282001',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 27.1682000,
    longitude: 78.0505000,
    price: 38000.00,
    description: "Located just 600 meters from the Taj Mahal, The Oberoi Amarvilas offers uninterrupted, breathtaking views of the world's greatest monument to love from every single guest room, suite, restaurant, and pool terrace.",
    facilities: "Direct Taj Mahal Views from All Rooms, Cascading Tiered Pool with Mughal Arches, Luxury Spa, Bellevue & Esphahan Fine Dining, Private Balcony, Golf Cart Transfers",
    image: 'uploads/hotels/oberoi-amarvilas-agra/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/oberoi-amarvilas-agra/reception.jpg', caption: 'Ornate lobby with golden domes, torchlit fountains and framed Taj Mahal views', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/oberoi-amarvilas-agra/rooms.jpg', caption: 'Premier room with uninterrupted direct views of the Taj Mahal from the window', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/oberoi-amarvilas-agra/pool.jpg', caption: 'Cascading tiered swimming pool bordered by carved Mughal sandstone arches', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/oberoi-amarvilas-agra/garden.jpg', caption: 'Terraced Mughal gardens with stone pavilions and reflecting water channels', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/oberoi-amarvilas-agra/restaurant.jpg', caption: 'Bellevue multi-cuisine restaurant and Esphahan royal dining room', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'taj-lake-palace-udaipur',
    title: 'The Taj Lake Palace, Udaipur',
    address: 'Lake Pichola, Udaipur, Rajasthan 313001',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    latitude: 24.5753000,
    longitude: 73.6800000,
    price: 55000.00,
    description: "Floating magically in the middle of Lake Pichola, this 18th-century white marble palace built by Maharana Jagat Singh II is acclaimed as one of the world's most romantic hotels, reachable exclusively by private hotel boat transfers.",
    facilities: "Floating Marble Palace, Lake-View Swimming Pool, Jiva Spa Boat, Royal Butler Service, 4 Fine Dining Restaurants (Neel Kamal, Bhairo), Heritage Boat Cruises",
    image: 'uploads/hotels/taj-lake-palace-udaipur/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/taj-lake-palace-udaipur/reception.jpg', caption: 'Intimate marble courtyard with lily pond and rose petal welcome ceremonies', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/taj-lake-palace-udaipur/rooms.jpg', caption: 'Palace room with stained glass windows and hand-painted Mewari frescoes', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/taj-lake-palace-udaipur/pool.jpg', caption: 'Open-air lakefront pool with panoramic vistas of Udaipur City Palace', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/taj-lake-palace-udaipur/garden.jpg', caption: 'Lily pond garden courtyards surrounded by scalloped marble arches', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/taj-lake-palace-udaipur/restaurant.jpg', caption: 'Neel Kamal authentic Mewari cuisine and Bhairo rooftop starlight dining', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'residency-towers-coimbatore',
    title: 'The Residency Towers, Coimbatore',
    address: '1076 Avinashi Road, Coimbatore, Tamil Nadu 641018',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 11.0116000,
    longitude: 76.9678000,
    price: 6800.00,
    description: "Located on Coimbatore's major commercial corridor, The Residency Towers is a premier business and leisure luxury hotel offering contemporary luxury rooms, rooftop dining, authentic regional cuisine, and expansive conference facilities.",
    facilities: "Rooftop Swimming Pool, Respa Ayurvedic Health Club, Multi-Cuisine Restaurants (Pavilion, Chin Chin, Bike & Barrel), Conference Suites, Valet Parking",
    image: 'uploads/hotels/residency-towers-coimbatore/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/residency-towers-coimbatore/reception.jpg', caption: 'Modern glass atrium lobby with welcoming executive reception', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/residency-towers-coimbatore/rooms.jpg', caption: 'Executive club room with ergonomic workstation and plush king bed', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/residency-towers-coimbatore/pool.jpg', caption: 'Rooftop open-air swimming pool with city view sundeck', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/residency-towers-coimbatore/restaurant.jpg', caption: 'Pavilion 24-hour restaurant and Chin Chin oriental eatery', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Other Facilities', path: 'uploads/hotels/residency-towers-coimbatore/facilities.jpg', caption: 'Respa Ayurvedic wellness centre and modern fitness studio', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'brijrama-palace-varanasi',
    title: 'BrijRama Palace, Varanasi',
    address: 'Munshi Ghat, Dashashwamedh, Varanasi, Uttar Pradesh 221001',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 25.3056000,
    longitude: 83.0097000,
    price: 24000.00,
    description: "Built in 1812 on the sacred banks of the River Ganges at Darbhanga Ghat, BrijRama Palace is one of Varanasi's oldest heritage landmarks, featuring one of South Asia's first elevators and panoramic Ganges sunrise views.",
    facilities: "Private Ganges Boat Arrival, Traditional Live Sitar & Classical Music, Darbhanga Vegetarian Fine Dining, Rooftop Ghat Terraces, Morning Yoga Sessions, Library",
    image: 'uploads/hotels/brijrama-palace-varanasi/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/brijrama-palace-varanasi/reception.jpg', caption: 'Heritage palace inner courtyard with classical Indian musical performances', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/brijrama-palace-varanasi/rooms.jpg', caption: 'Maharaja room with hand-carved stone jharokhas overlooking the holy Ganges', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/brijrama-palace-varanasi/restaurant.jpg', caption: 'Darbhanga fine dining serving satvik regional vegetarian specialties', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Other Facilities', path: 'uploads/hotels/brijrama-palace-varanasi/facilities.jpg', caption: 'Rooftop sunrise yoga pavilion and historic Darbhanga library', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'lalitha-mahal-mysuru',
    title: 'Lalitha Mahal Palace Hotel, Mysuru',
    address: 'Lalitha Mahal Nagar, Siddhartha Layout, Mysuru, Karnataka 570011',
    city: 'Mysuru',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.2981000,
    longitude: 76.6917000,
    price: 8500.00,
    description: "Built in 1921 by the Maharaja of Mysore Krishnaraja Wodeyar IV to host the Viceroy of India, Lalitha Mahal is an Italianate Renaissance palace perched on a hill, featuring Italian marble staircases and crystal chandeliers.",
    facilities: "Royal Banquet Hall Dining, Italian Marble Grand Staircase, Outdoor Swimming Pool, Billiards Parlor, Sprawling Palace Gardens, Heritage Suites",
    image: 'uploads/hotels/lalitha-mahal-mysuru/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/lalitha-mahal-mysuru/reception.jpg', caption: 'Italian marble grand staircase under the soaring central stained glass dome', source: 'Official Hotel Archive / Wikimedia Commons' },
      { category: 'Rooms', path: 'uploads/hotels/lalitha-mahal-mysuru/rooms.jpg', caption: 'Viceroy heritage suite with high ceilings and authentic period furnishings', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/lalitha-mahal-mysuru/pool.jpg', caption: 'Classic outdoor swimming pool framed by the Chamundi Hills backdrop', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/lalitha-mahal-mysuru/garden.jpg', caption: 'Expansive palace grounds with fountain terraces and sweeping Mysore views', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/lalitha-mahal-mysuru/restaurant.jpg', caption: 'The Sapphire royal banquet dining room with silver service table settings', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'leela-kovalam-kerala',
    title: 'The Leela Kovalam, A Raviz Hotel',
    address: 'Kovalam Beach Road, Thiruvananthapuram, Kerala 695527',
    city: 'Kovalam',
    state: 'Kerala',
    country: 'India',
    latitude: 8.3965000,
    longitude: 76.9780000,
    price: 21000.00,
    description: "Perched dramatically on a cliff-top between two wide sandy beaches, The Leela Kovalam offers panoramic views of the turquoise Arabian Sea, traditional Ayurvedic therapies, private sundecks, and world-class beachfront luxury.",
    facilities: "Cliff-Edge Infinity Swimming Pool, Ayurvedic Sanctuary, Beachside Seafood Dining (The Tides), Sky Bar Lounge, Private Beach Area, Tennis Court, Yoga Pavilions",
    image: 'uploads/hotels/leela-kovalam-kerala/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/leela-kovalam-kerala/reception.jpg', caption: 'Panoramic open-air clifftop lobby looking out onto Arabian Sea waves', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/leela-kovalam-kerala/rooms.jpg', caption: 'Ocean-view club room with private sundeck and coastal breezes', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/leela-kovalam-kerala/pool.jpg', caption: 'Famous cliff-edge infinity pool seamlessly merging with the sea horizon', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/leela-kovalam-kerala/garden.jpg', caption: 'Tropical landscaped clifftop gardens leading to private beach coves', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/leela-kovalam-kerala/restaurant.jpg', caption: 'The Tides beachfront seafood grill and The Terrace clifftop restaurant', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'umaid-bhawan-jodhpur',
    title: 'Umaid Bhawan Palace, Jodhpur',
    address: 'Circuit House Road, Jodhpur, Rajasthan 342006',
    city: 'Jodhpur',
    state: 'Rajasthan',
    country: 'India',
    latitude: 26.2808000,
    longitude: 73.0475000,
    price: 62000.00,
    description: "Perched high above the blue city of Jodhpur, Umaid Bhawan Palace was built between 1928 and 1943 in golden sandstone and art deco style. Part royal palace and part luxury hotel, it features 26 acres of lush gardens with dancing peacocks.",
    facilities: "Subterranean Indoor Zodiac Pool, Royal Jiva Spa, Risala Fine Dining & Pillars Verandah, Palace Museum, Vintage Car Museum, Squash & Tennis Courts, Peacocks in Gardens",
    image: 'uploads/hotels/umaid-bhawan-jodhpur/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/umaid-bhawan-jodhpur/reception.jpg', caption: 'Grand rotunda dome and marble entrance hall with royal museum exhibits', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/umaid-bhawan-jodhpur/rooms.jpg', caption: 'Historical royal suite with Art Deco furnishings and carved sandstone balcony', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/umaid-bhawan-jodhpur/pool.jpg', caption: 'Subterranean indoor Zodiac pool tiled with classical zodiac signs', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/umaid-bhawan-jodhpur/garden.jpg', caption: '26 acres of verdant palace gardens with bougainvillea and peacocks', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/umaid-bhawan-jodhpur/restaurant.jpg', caption: 'Risala continental & royal Indian restaurant and Pillars colonnaded verandah', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'savoy-ooty',
    title: 'Savoy - IHCL SeleQtions, Ooty',
    address: '77 Sylks Road, Ooty, The Nilgiris, Tamil Nadu 643001',
    city: 'Ooty',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 11.4116000,
    longitude: 76.6974000,
    price: 11500.00,
    description: "Spanning 6 acres of landscaped hill gardens since 1834, Savoy Ooty is an English cottage-style colonial heritage retreat in the Nilgiri Mountains, featuring cozy wood-burning fireplaces, afternoon tea on the lawn, and charming heritage cottages.",
    facilities: "1834 Colonial Fireplace Suites, The Dining Room, Canterbury Bar, Six Acres of Hill Gardens, Ayurvedic Spa, Tea Tasting Experiences, Badminton, Mountain Treks",
    image: 'uploads/hotels/savoy-ooty/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/savoy-ooty/reception.jpg', caption: 'Warm wood-paneled colonial lobby with heritage hearth and antique fireplace', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/savoy-ooty/rooms.jpg', caption: 'Heritage cottage room with working fireplace and colonial brass bedstead', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Garden and Outdoor', path: 'uploads/hotels/savoy-ooty/garden.jpg', caption: 'Six acres of manicured heritage lawns, rose gardens and tea terraces', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/savoy-ooty/restaurant.jpg', caption: 'The Dining Room serving Anglo-Indian roasts and authentic Nilgiri teas', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Other Facilities', path: 'uploads/hotels/savoy-ooty/facilities.jpg', caption: 'Canterbury colonial bar and Ayurvedic wellness treatment cottage', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'ritz-carlton-pune',
    title: 'The Ritz-Carlton, Pune',
    address: 'Golf Course Square, Airport Road, Yerawada, Pune, Maharashtra 411006',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    latitude: 18.5529000,
    longitude: 73.8942000,
    price: 17500.00,
    description: "Overlooking the lush green 100-acre Poona Golf Club, The Ritz-Carlton Pune blends classic elegance with Indian design nuances, featuring bespoke wellness programs, rooftop sunset lounges, and Michelin-inspired culinary artistry.",
    facilities: "The Ritz-Carlton Spa, Temperature-Controlled Outdoor Pool, Golf Course Views, 5 Luxury Dining Venues, Club Lounge, Fitness Studio, 24-Hour Concierge",
    image: 'uploads/hotels/ritz-carlton-pune/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/ritz-carlton-pune/reception.jpg', caption: 'Opulent lobby with marble colonnades, crystal chandeliers and art pieces', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/ritz-carlton-pune/rooms.jpg', caption: 'Deluxe room with floor-to-ceiling windows overlooking Poona Golf Course', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/ritz-carlton-pune/pool.jpg', caption: 'Temperature-controlled outdoor swimming pool with private luxury cabanas', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/ritz-carlton-pune/restaurant.jpg', caption: 'Ukiyo Japanese rooftop restaurant and Three Kitchens all-day dining', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Other Facilities', path: 'uploads/hotels/ritz-carlton-pune/facilities.jpg', caption: 'Signature Ritz-Carlton Spa and 24-hour fitness studio', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'itc-kohenur-hyderabad',
    title: 'ITC Kohenur, Hyderabad',
    address: 'Plot No. 5, Survey No. 83/1, HITEC City, Madhapur, Hyderabad, Telangana 500081',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.4365000,
    longitude: 78.3789000,
    price: 16000.00,
    description: "Inspired by the famed Koh-i-Noor diamond, ITC Kohenur overlooks Durgam Cheruvu lake in the heart of Hyderabad's technology hub. It features striking architectural facets, art installations, sustainable luxury, and acclaimed specialty dining.",
    facilities: "Rooftop Infinity Pool, Kaya Kalp Royal Spa, 6 Specialty Restaurants (Dum Pukht Begum's, Yi Jing), Lake View Rooms, 24-Hour Fitness Centre, Helipad",
    image: 'uploads/hotels/itc-kohenur-hyderabad/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/itc-kohenur-hyderabad/reception.jpg', caption: 'Palatial geometric lobby inspired by diamond facets and royal Hyderabadi craft', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/itc-kohenur-hyderabad/rooms.jpg', caption: 'Towers room with floor-to-ceiling vistas of Durgam Cheruvu freshwater lake', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/itc-kohenur-hyderabad/pool.jpg', caption: 'Rooftop infinity swimming pool overlooking the cyber city skyline', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/itc-kohenur-hyderabad/restaurant.jpg', caption: 'Dum Pukht Begum’s royal cuisine and Yi Jing contemporary Asian venue', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Other Facilities', path: 'uploads/hotels/itc-kohenur-hyderabad/facilities.jpg', caption: 'Kaya Kalp The Royal Spa and state-of-the-art wellness pavilion', source: 'Official Hotel Archive / Unsplash' }
    ]
  },
  {
    slug: 'itc-grand-chola-chennai',
    title: 'ITC Grand Chola, Chennai',
    address: '63 Mount Road, Guindy, Chennai, Tamil Nadu 600032',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 13.0105000,
    longitude: 80.2206000,
    price: 15500.00,
    description: "The grandest tribute to the Southern Imperial Chola dynasty, ITC Grand Chola is an architectural wonder crafted with hand-carved marble pillars, sweeping staircases, 10 iconic culinary destinations, and luxurious palace-inspired suites.",
    facilities: "3 Outdoor Swimming Pools, Kaya Kalp - The Royal Spa, 10 Signature Dining Destinations (Peshawri, Pan Asian), Grand Ballroom, Luxury Helipad, Chola Architecture",
    image: 'uploads/hotels/itc-grand-chola-chennai/main.jpg',
    images: [
      { category: 'Reception and Lobby', path: 'uploads/hotels/itc-grand-chola-chennai/reception.jpg', caption: 'Colossal Chola-style marble staircase, fluted pillars and bronze temple bells', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Rooms', path: 'uploads/hotels/itc-grand-chola-chennai/rooms.jpg', caption: 'Chola luxury suite with handcrafted regional silk textiles and deep marble bath', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Swimming Pool', path: 'uploads/hotels/itc-grand-chola-chennai/pool.jpg', caption: 'Rooftop sun terrace pool and private cabanas', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Restaurant and Dining', path: 'uploads/hotels/itc-grand-chola-chennai/restaurant.jpg', caption: 'Peshawri clay tandoor culinary theatre and Madras Pavilion buffet', source: 'Official Hotel Archive / Unsplash' },
      { category: 'Other Facilities', path: 'uploads/hotels/itc-grand-chola-chennai/facilities.jpg', caption: 'Kaya Kalp The Royal Spa and multi-story wellness sanctuary', source: 'Official Hotel Archive / Unsplash' }
    ]
  }
];

async function seedHotels() {
  console.log('--- Starting Idempotent Seeding of 20 Real Indian Hotels ---');

  // Ensure table columns exist
  await pool.query('ALTER TABLE hotels ADD COLUMN IF NOT EXISTS address VARCHAR(255)');
  await pool.query('ALTER TABLE hotels ADD COLUMN IF NOT EXISTS city VARCHAR(100)');
  await pool.query('ALTER TABLE hotels ADD COLUMN IF NOT EXISTS state VARCHAR(100)');
  await pool.query('ALTER TABLE hotels ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT \'India\'');
  await pool.query('ALTER TABLE hotels ADD COLUMN IF NOT EXISTS facilities TEXT');

  // Create hotel_images table if not present
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hotel_images (
      id          SERIAL PRIMARY KEY,
      hotel_id    INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
      category    VARCHAR(100) NOT NULL,
      image_url   VARCHAR(500) NOT NULL,
      caption     VARCHAR(255),
      source_info VARCHAR(255),
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Remove any old dummy test records created during initial development
  if (OLD_TEST_TITLES.length > 0) {
    const res = await pool.query('DELETE FROM hotels WHERE title = ANY($1)', [OLD_TEST_TITLES]);
    if (res.rowCount > 0) {
      console.log(`Cleaned up ${res.rowCount} old test records.`);
    }
  }

  let insertedCount = 0;
  let updatedCount = 0;

  for (const hotel of REAL_HOTELS) {
    // Check if hotel already exists by title
    const existing = await pool.query('SELECT id FROM hotels WHERE title = $1', [hotel.title]);
    let hotelId;

    if (existing.rows.length > 0) {
      hotelId = existing.rows[0].id;
      await pool.query(
        `UPDATE hotels
         SET image = $1, description = $2, address = $3, city = $4, state = $5,
             country = $6, facilities = $7, latitude = $8, longitude = $9, price = $10, updated_at = NOW()
         WHERE id = $11`,
        [
          hotel.image,
          hotel.description,
          hotel.address,
          hotel.city,
          hotel.state,
          hotel.country,
          hotel.facilities,
          hotel.latitude,
          hotel.longitude,
          hotel.price,
          hotelId
        ]
      );
      updatedCount++;
    } else {
      const ins = await pool.query(
        `INSERT INTO hotels (image, title, description, address, city, state, country, facilities, latitude, longitude, price, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
         RETURNING id`,
        [
          hotel.image,
          hotel.title,
          hotel.description,
          hotel.address,
          hotel.city,
          hotel.state,
          hotel.country,
          hotel.facilities,
          hotel.latitude,
          hotel.longitude,
          hotel.price
        ]
      );
      hotelId = ins.rows[0].id;
      insertedCount++;
    }

    // Refresh images for this hotel
    await pool.query('DELETE FROM hotel_images WHERE hotel_id = $1', [hotelId]);

    for (const img of hotel.images) {
      await pool.query(
        `INSERT INTO hotel_images (hotel_id, category, image_url, caption, source_info, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [
          hotelId,
          img.category,
          img.path,
          img.caption,
          img.source
        ]
      );
    }
  }

  console.log(`Successfully processed: ${insertedCount} inserted, ${updatedCount} updated.`);

  const countRes = await pool.query('SELECT COUNT(*) FROM hotels');
  const imgCountRes = await pool.query('SELECT COUNT(*) FROM hotel_images');
  console.log(`Total hotels in database: ${countRes.rows[0].count}`);
  console.log(`Total gallery images in database: ${imgCountRes.rows[0].count}`);

  pool.end();
}

seedHotels().catch(err => {
  console.error('Seed error:', err);
  pool.end();
  process.exit(1);
});

