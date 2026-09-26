// Single Source of Truth for Plant Library and Plan My Acre

export const PLANT_SIZES = [
  { 
    code: 'S', 
    label: 'Small', 
    name: 'Small Plant', 
    badge: '1–2 ft sapling',
    height: '1–2 ft sapling',
    stage: 'Young nursery polybag sapling with active taproot',
    details: 'Compact 1–2 ft root-trained sapling in nursery polybag. High vigor and optimal for large-scale economic field plantation.'
  },
  { 
    code: 'M', 
    label: 'Medium', 
    name: 'Medium Plant', 
    badge: '3–4 ft established',
    height: '3–4 ft established',
    stage: 'Hardened container specimen with sturdy trunk and early lateral branching',
    details: 'Vigorous 3–4 ft container tree with sturdy stem. Balanced root system with rapid field adaptation and strong wind tolerance.'
  },
  { 
    code: 'L', 
    label: 'Large', 
    name: 'Large Plant', 
    badge: '5–6 ft mature stock',
    height: '5–6 ft mature stock',
    stage: 'Advanced specimen with developed crown and early fruiting wood',
    details: 'Mature 5–6+ ft rootball specimen with developed crown. Instant field presence, accelerated canopy shade and faster fruiting.'
  },
]

export function getPlantSizePrices(plant) {
  const base = Number(plant?.price) || 100
  return {
    S: Number(plant?.sizePrices?.S) || Math.round(base * 0.68),
    M: Number(plant?.sizePrices?.M) || base,
    L: Number(plant?.sizePrices?.L) || Math.round(base * 1.48),
  }
}

export function getPlantSizeImage(plant, size = 'M') {
  if (plant?.sizeImages?.[size]) return plant.sizeImages[size]
  return plant?.image
}

export function getPlantSizeDetails(plant, size = 'M') {
  return PLANT_SIZES.find((s) => s.code === size) || PLANT_SIZES[1]
}

export function getPlantSizeAvailability(plant) {
  return {
    S: plant?.sizeAvailability?.S !== false,
    M: plant?.sizeAvailability?.M !== false,
    L: plant?.sizeAvailability?.L !== false,
  }
}

export function isPlantSizeAvailable(plant, size = 'M') {
  if (!plant) return false
  if (plant.sizeAvailability && plant.sizeAvailability[size] !== undefined) {
    return plant.sizeAvailability[size] !== false && plant.sizeAvailability[size] !== 'false'
  }
  return true
}

export const defaultPlants = [
  {
    id: 'mango-kesar',
    name: 'Kesar Mango',
    shortName: 'Mango',
    category: 'Fruit plants',
    price: 185,
    sizePrices: {
      S: 125,
      M: 185,
      L: 275,
    },
    sizeAvailability: {
      S: true,
      M: true,
      L: true,
    },
    sizeImages: {
      S: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
      M: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      L: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
    },
    spacing: '24 × 24 ft',
    p2p: 24,
    r2r: 24,
    plantsPerAcre: 72,
    fertilizer: '12 kg / year',
    maintenance: 'Moderate',
    growth: '3–4 years',
    description: 'Sun-loving orchard trees with a generous canopy and dependable market demand.',
    color: '#e67e22',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    modelType: 'Mango'
  },
  {
    id: 'guava-allahabad',
    name: 'Allahabad Guava',
    shortName: 'Guava',
    category: 'Fruit plants',
    price: 125,
    sizePrices: {
      S: 85,
      M: 125,
      L: 195,
    },
    sizeImages: {
      S: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80',
      M: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=800&q=80',
      L: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?auto=format&fit=crop&w=800&q=80',
    },
    spacing: '15 × 15 ft',
    p2p: 15,
    r2r: 15,
    plantsPerAcre: 190,
    fertilizer: '8 kg / year',
    maintenance: 'Moderate',
    growth: '2–3 years',
    description: 'An early-bearing orchard choice with fragrant fruit and compact growth.',
    color: '#8e44ad',
    image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=800&q=80',
    modelType: 'Guava'
  },
  {
    id: 'teak-sapling',
    name: 'Teak Sapling',
    shortName: 'Teak',
    category: 'Timber / Wood',
    price: 95,
    sizePrices: {
      S: 65,
      M: 95,
      L: 150,
    },
    sizeImages: {
      S: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      M: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      L: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
    },
    spacing: '12 × 12 ft',
    p2p: 12,
    r2r: 12,
    plantsPerAcre: 300,
    fertilizer: '4 kg / year',
    maintenance: 'Low',
    growth: '12–15 years',
    description: 'A patient long-term asset with strong timber value and quiet presence.',
    color: '#7f8c8d',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    modelType: 'Timber'
  },
  {
    id: 'coconut-tall',
    name: 'Tall Coconut',
    shortName: 'Coconut',
    category: 'Avenue',
    price: 240,
    sizePrices: {
      S: 160,
      M: 240,
      L: 360,
    },
    sizeImages: {
      S: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      M: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      L: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    },
    spacing: '25 × 25 ft',
    p2p: 25,
    r2r: 25,
    plantsPerAcre: 70,
    fertilizer: '18 kg / year',
    maintenance: 'Low',
    growth: '5–6 years',
    description: 'A resilient boundary and plantation staple for warm, open acreage.',
    color: '#16a085',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    modelType: 'Coconut'
  },
  {
    id: 'arecanut-premium',
    name: 'Arecanut Premium',
    shortName: 'Arecanut',
    category: 'Avenue',
    price: 155,
    sizePrices: {
      S: 105,
      M: 155,
      L: 235,
    },
    sizeImages: {
      S: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
      M: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      L: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    },
    spacing: '9 × 9 ft',
    p2p: 9,
    r2r: 9,
    plantsPerAcre: 520,
    fertilizer: '9 kg / year',
    maintenance: 'High',
    growth: '5–7 years',
    description: 'Tall, elegant palms that reward careful irrigation and a considered grid.',
    color: '#27ae60',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    modelType: 'Arecanut'
  },
  {
    id: 'mosambi-sweet',
    name: 'Sweet Mosambi',
    shortName: 'Mosambi',
    category: 'Fruit plants',
    price: 145,
    sizePrices: {
      S: 95,
      M: 145,
      L: 220,
    },
    sizeImages: {
      S: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80',
      M: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=800&q=80',
      L: 'https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&w=800&q=80',
    },
    spacing: '18 × 18 ft',
    p2p: 18,
    r2r: 18,
    plantsPerAcre: 130,
    fertilizer: '10 kg / year',
    maintenance: 'Moderate',
    growth: '3–4 years',
    description: 'Bright citrus with a measured canopy, ideal for mixed orchard plans.',
    color: '#2980b9',
    image: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=800&q=80',
    modelType: 'Mosambi'
  },
  {
    id: 'banana-grand-naine',
    name: 'Grand Naine Banana',
    shortName: 'Banana',
    category: 'Fruit plants',
    price: 42,
    sizePrices: {
      S: 28,
      M: 42,
      L: 65,
    },
    sizeImages: {
      S: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      M: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
      L: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80',
    },
    spacing: '6 × 6 ft',
    p2p: 6,
    r2r: 6,
    plantsPerAcre: 1100,
    fertilizer: '5 kg / year',
    maintenance: 'High',
    growth: '10–12 months',
    description: 'Fast-turning, productive plants for a first harvest while the orchard matures.',
    color: '#f1c40f',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    modelType: 'Banana'
  },
  {
    id: 'drumstick-moringa',
    name: 'Moringa',
    shortName: 'Moringa',
    category: 'Landscaping',
    price: 38,
    sizePrices: {
      S: 25,
      M: 38,
      L: 58,
    },
    sizeImages: {
      S: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
      M: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      L: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    },
    spacing: '10 × 10 ft',
    p2p: 10,
    r2r: 10,
    plantsPerAcre: 435,
    fertilizer: '4 kg / year',
    maintenance: 'Low',
    growth: '8–10 months',
    description: 'A versatile, fast-growing utility crop for the working edge of a plan.',
    color: '#78b582',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    modelType: 'Moringa'
  },
  {
    id: 'jasmine-star',
    name: 'Star Jasmine',
    shortName: 'Jasmine',
    category: 'Flower',
    price: 65,
    sizePrices: {
      S: 45,
      M: 65,
      L: 98,
    },
    sizeImages: {
      S: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80',
      M: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=800&q=80',
      L: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80',
    },
    spacing: '5 × 5 ft',
    p2p: 5,
    r2r: 5,
    plantsPerAcre: 1742,
    fertilizer: '3 kg / year',
    maintenance: 'Moderate',
    growth: '12–18 months',
    description: 'A fragrant flowering layer for pathways, entries, and living garden edges.',
    color: '#d7c7a1',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80',
    modelType: 'Flower'
  }
]

export const initialSelectedPlantIds = ['mango-kesar', 'guava-allahabad', 'teak-sapling']
