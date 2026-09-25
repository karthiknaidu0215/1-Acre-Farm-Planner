import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const ACRE_SQ_FT = 43560;

const calculateBlocks = (acres, borderWidth, cropZones) => {
  const totalSqFt = acres * ACRE_SQ_FT;
  const landSide = Math.sqrt(totalSqFt); 
  
  const interiorSide = Math.max(0, landSide - (2 * borderWidth));
  const interiorArea = interiorSide * interiorSide;
  const borderArea = totalSqFt - interiorArea;
  
  let currentZ = -interiorSide / 2;
  
  const zones = cropZones.map(zone => {
    const area = interiorArea * (zone.percentage / 100);
    const lengthZ = interiorSide * (zone.percentage / 100);
    const block = {
      x: 0, 
      z: currentZ + (lengthZ / 2), 
      width: interiorSide,
      length: lengthZ,
      minX: -interiorSide / 2,
      maxX: interiorSide / 2,
      minZ: currentZ,
      maxZ: currentZ + lengthZ,
      area
    };
    currentZ += lengthZ;
    return { ...zone, block };
  });
  
  return { zones, landSide, interiorSide, interiorArea, borderArea };
};

// Math helpers
export const isPointInRotatedRect = (px, pz, cx, cz, w, l, angle) => {
  // Translate point to origin
  const tx = px - cx;
  const tz = pz - cz;
  
  // Rotate point backwards
  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);
  
  const rx = tx * cos - tz * sin;
  const rz = tx * sin + tz * cos;
  
  return (Math.abs(rx) <= w / 2 && Math.abs(rz) <= l / 2);
}

export const getInfraArea = (infra) => {
  if (infra.type === 'Borewell' || infra.type === 'Water Tank') return Math.PI * Math.pow(infra.radius, 2);
  if (infra.type === 'Road') return infra.width * infra.length;
  // Rectangular objects
  return infra.width * infra.length;
}

const initialCalculations = calculateBlocks(25, 10, []);

export const useStore = create((set, get) => ({
  landAcres: 25, 
  borderWidth: 10,
  landSideFt: initialCalculations.landSide,
  interiorSideFt: initialCalculations.interiorSide,
  interiorAreaSqFt: initialCalculations.interiorArea,
  borderAreaSqFt: initialCalculations.borderArea,
  
  showStats: true,
  toggleStats: () => set((state) => ({ showStats: !state.showStats })),
  
  cropZones: [],  
  borderZone: { id: 'border-zone', type: 'Coconut', targetPlants: 0 },
  
  plants: [], // All intended plants
  selectedPlantId: null,
  draggingPlantId: null,
  measuring: false,
  measurePoints: [],
  manualPlacementZoneId: null,

  // --- INFRASTRUCTURE ---
  infrastructure: [],
  selectedInfraId: null,
  draggingInfraId: null,
  activeDrawTool: null, // 'Road'
  draftRoad: null, // { startX, startZ, endX, endZ }
  
  addInfrastructure: (type) => set((state) => {
    let width = 20;
    let length = 20;
    let radius = 5;

    if (type === 'Farm House') { width = 30; length = 40; }
    if (type === 'Pond') { width = 40; length = 40; }
    if (type === 'Storage Shed') { width = 20; length = 30; }
    if (type === 'Water Tank') { width = 15; length = 15; radius = 7.5; }
    if (type === 'Pump Room') { width = 10; length = 10; }
    if (type === 'Gate') { width = 15; length = 5; }
    if (type === 'Custom Obstacle') { width = 20; length = 20; }
    if (type === 'Borewell') { width = 10; length = 10; radius = 5; }

    const newItem = {
      id: uuidv4(),
      type,
      x: 0,
      z: 0,
      width,
      length,
      radius,
      rotation: 0
    };
    
    return { infrastructure: [...state.infrastructure, newItem], selectedInfraId: newItem.id };
  }),

  addDrawnRoad: (startX, startZ, endX, endZ, width) => set((state) => {
    const dx = endX - startX;
    const dz = endZ - startZ;
    const length = Math.hypot(dx, dz);
    const angle = Math.atan2(dx, dz);
    const cx = (startX + endX) / 2;
    const cz = (startZ + endZ) / 2;

    const newItem = {
      id: uuidv4(),
      type: 'Road',
      x: cx,
      z: cz,
      width,
      length,
      rotation: angle
    };

    return { infrastructure: [...state.infrastructure, newItem], selectedInfraId: newItem.id, draftRoad: null, activeDrawTool: null };
  }),

  addFullRoad: (position) => set((state) => {
    const width = 12; // default 12ft road
    const length = state.landSideFt;
    let x = 0;
    let z = 0;
    let rotation = 0;
    const halfL = state.landSideFt / 2;

    if (position === 'top') { z = -halfL + width/2; rotation = Math.PI/2; }
    else if (position === 'bottom') { z = halfL - width/2; rotation = Math.PI/2; }
    else if (position === 'left') { x = -halfL + width/2; rotation = 0; }
    else if (position === 'right') { x = halfL - width/2; rotation = 0; }
    else if (position === 'center-h') { rotation = Math.PI/2; }
    else if (position === 'center-v') { rotation = 0; }
    
    const newItem = {
      id: uuidv4(),
      type: 'Road',
      x,
      z,
      width,
      length,
      rotation
    };

    return { infrastructure: [...state.infrastructure, newItem], selectedInfraId: newItem.id };
  }),

  // --- SELECTION STATE ---
  selectedPlantId: null,
  draggingPlantId: null,
  selectedInfraId: null,
  draggingInfraId: null,
  dragOffsetX: 0,
  dragOffsetZ: 0,
  selectedCropZoneId: null,
  activeDrawTool: null, 
  draftRoad: null, 
  manualPlacementZoneId: null,
  measuring: false,
  measurePoints: [],

  updateInfrastructure: (id, updates) => set((state) => ({
    infrastructure: state.infrastructure.map(inf => inf.id === id ? { ...inf, ...updates } : inf)
  })),

  removeInfrastructure: (id) => set((state) => ({
    infrastructure: state.infrastructure.filter(inf => inf.id !== id),
    selectedInfraId: state.selectedInfraId === id ? null : state.selectedInfraId
  })),

  // Unified Setters
  setSelectedInfraId: (id) => set({ selectedInfraId: id, selectedPlantId: null, selectedCropZoneId: null, manualPlacementZoneId: null, measuring: false, activeDrawTool: null }),
  setSelectedPlantId: (id) => set({ selectedPlantId: id, selectedInfraId: null, selectedCropZoneId: null, manualPlacementZoneId: null, measuring: false, activeDrawTool: null }),
  setSelectedCropZoneId: (id) => set({ selectedCropZoneId: id, selectedPlantId: null, selectedInfraId: null, manualPlacementZoneId: null, measuring: false, activeDrawTool: null }),
  
  clearSelection: () => set({ selectedInfraId: null, selectedPlantId: null, selectedCropZoneId: null, manualPlacementZoneId: null, measuring: false, activeDrawTool: null }),

  setDraggingInfraId: (id, offsetX = 0, offsetZ = 0) => set({ draggingInfraId: id, dragOffsetX: offsetX, dragOffsetZ: offsetZ }),
  setDraggingPlantId: (id, offsetX = 0, offsetZ = 0) => set({ draggingPlantId: id, dragOffsetX: offsetX, dragOffsetZ: offsetZ }),
  setActiveDrawTool: (tool) => set({ activeDrawTool: tool, selectedInfraId: null, selectedPlantId: null, selectedCropZoneId: null, manualPlacementZoneId: null }),
  setDraftRoad: (draft) => set({ draftRoad: draft }),
  setManualPlacementZoneId: (id) => set({ manualPlacementZoneId: id, activeDrawTool: null, selectedInfraId: null, selectedPlantId: null, selectedCropZoneId: null }),
  setMeasuring: (val) => set({ measuring: val, measurePoints: [], activeDrawTool: null, selectedInfraId: null, selectedPlantId: null, selectedCropZoneId: null }),
  
  addMeasurePoint: (id) => set((state) => {
    if (state.measurePoints.length < 2 && !state.measurePoints.includes(id)) {
      return { measurePoints: [...state.measurePoints, id] }
    }
    if (state.measurePoints.length === 2) {
      return { measurePoints: [id] }
    }
    return state;
  }),

  setLandAcres: (acres) => set((state) => {
    const { zones, landSide, interiorSide, interiorArea, borderArea } = calculateBlocks(acres, state.borderWidth, state.cropZones);
    return { 
      landAcres: acres, 
      landSideFt: landSide, 
      interiorSideFt: interiorSide,
      interiorAreaSqFt: interiorArea,
      borderAreaSqFt: borderArea,
      cropZones: zones, 
      plants: [], 
      manualPlacementZoneId: null 
    }; 
  }),

  setBorderWidth: (width) => set((state) => {
    const { zones, landSide, interiorSide, interiorArea, borderArea } = calculateBlocks(state.landAcres, width, state.cropZones);
    return { 
      borderWidth: width, 
      landSideFt: landSide, 
      interiorSideFt: interiorSide,
      interiorAreaSqFt: interiorArea,
      borderAreaSqFt: borderArea,
      cropZones: zones 
    };
  }),
  
  addCropZone: (type) => set((state) => {
    const used = state.cropZones.reduce((sum, z) => sum + z.percentage, 0);
    let perc = Math.min(100 - used, 10);
    if (perc <= 0) perc = 10; 
    
    const newZone = {
      id: uuidv4(),
      type,
      percentage: perc,
      p2p: 10,
      r2r: 10,
      targetPlants: 0
    };
    
    const { zones, interiorArea, borderArea } = calculateBlocks(state.landAcres, state.borderWidth, [...state.cropZones, newZone]);
    return { cropZones: zones, interiorAreaSqFt: interiorArea, borderAreaSqFt: borderArea };
  }),
  
  updateCropZone: (id, updates) => set((state) => {
    const updated = state.cropZones.map(z => z.id === id ? { ...z, ...updates } : z);
    const { zones } = calculateBlocks(state.landAcres, state.borderWidth, updated);
    return { cropZones: zones };
  }),

  updateBorderZone: (updates) => set((state) => ({
    borderZone: { ...state.borderZone, ...updates }
  })),
  
  removeCropZone: (id) => set((state) => {
    const updated = state.cropZones.filter(z => z.id !== id);
    const { zones } = calculateBlocks(state.landAcres, state.borderWidth, updated);
    return { 
      cropZones: zones, 
      plants: state.plants.filter(p => p.zoneId !== id),
      manualPlacementZoneId: state.manualPlacementZoneId === id ? null : state.manualPlacementZoneId
    };
  }),
  
  setManualPlacementZoneId: (id) => set({ manualPlacementZoneId: id, activeDrawTool: null, selectedInfraId: null }),

  placeManualPlant: (x, z) => set((state) => {
    if (!state.manualPlacementZoneId) return state;
    
    let type = '';
    let zoneId = state.manualPlacementZoneId;
    
    if (zoneId === 'border-zone') {
      const halfL = state.landSideFt / 2;
      const halfI = state.interiorSideFt / 2;
      const inOuter = x >= -halfL && x <= halfL && z >= -halfL && z <= halfL;
      const inInner = x > -halfI && x < halfI && z > -halfI && z < halfI;
      if (!inOuter || inInner) return state; 
      type = state.borderZone.type;
    } else {
      const zone = state.cropZones.find(z => z.id === zoneId);
      if (!zone) return state;
      if (x < zone.block.minX || x > zone.block.maxX || z < zone.block.minZ || z > zone.block.maxZ) {
        return state;
      }
      type = zone.type;
    }

    const newPlant = {
      id: uuidv4(),
      zoneId,
      type,
      x,
      z
    };
    
    return { plants: [...state.plants, newPlant] };
  }),

  autoArrangeZone: (zoneId) => set((state) => {
    const zone = state.cropZones.find(z => z.id === zoneId);
    if (!zone) return state;
    
    const otherPlants = state.plants.filter(p => p.zoneId !== zoneId);
    let newPlants = [];
    
    const maxCols = Math.floor(zone.block.width / zone.p2p);
    const maxRows = Math.floor(zone.block.length / zone.r2r);
    const capacity = maxCols * maxRows;
    
    const actualToPlace = Math.min(zone.targetPlants, capacity);
    
    const gridWidth = maxCols * zone.p2p;
    const gridLength = maxRows * zone.r2r;
    
    const startX = zone.block.minX + (zone.block.width - gridWidth) / 2 + (zone.p2p / 2);
    const startZ = zone.block.minZ + (zone.block.length - gridLength) / 2 + (zone.r2r / 2);
    
    let currentX = startX;
    let currentZ = startZ;
    let col = 0;
    
    for (let i = 0; i < actualToPlace; i++) {
      newPlants.push({
        id: uuidv4(),
        zoneId,
        type: zone.type,
        x: currentX,
        z: currentZ
      });
      
      col++;
      currentX += zone.p2p;
      if (col >= maxCols) {
        col = 0;
        currentX = startX;
        currentZ += zone.r2r;
      }
    }
    
    return { plants: [...otherPlants, ...newPlants] };
  }),

  autoArrangeBorder: () => set((state) => {
    const otherPlants = state.plants.filter(p => p.zoneId !== 'border-zone');
    let newPlants = [];
    
    const p = (state.landSideFt / 2) - (state.borderWidth / 2);
    const spacing = 20; 
    
    for(let x = -p; x < p; x += spacing) {
      newPlants.push({ id: uuidv4(), zoneId: 'border-zone', type: state.borderZone.type, x, z: -p });
    }
    for(let z = -p; z < p; z += spacing) {
      newPlants.push({ id: uuidv4(), zoneId: 'border-zone', type: state.borderZone.type, x: p, z });
    }
    for(let x = p; x > -p; x -= spacing) {
      newPlants.push({ id: uuidv4(), zoneId: 'border-zone', type: state.borderZone.type, x, z: p });
    }
    for(let z = p; z > -p; z -= spacing) {
      newPlants.push({ id: uuidv4(), zoneId: 'border-zone', type: state.borderZone.type, x: -p, z });
    }

    return { plants: [...otherPlants, ...newPlants] };
  }),
  
  updatePlantPosition: (id, x, z) => set((state) => ({
    plants: state.plants.map(p => p.id === id ? { ...p, x, z } : p)
  })),
  
  removePlant: (id) => set((state) => ({
    plants: state.plants.filter(p => p.id !== id),
    selectedPlantId: state.selectedPlantId === id ? null : state.selectedPlantId,
    draggingPlantId: state.draggingPlantId === id ? null : state.draggingPlantId
  })),

  duplicatePlant: (id) => set((state) => {
    const plantToClone = state.plants.find(p => p.id === id);
    if (!plantToClone) return state;
    const newPlant = {
      ...plantToClone,
      id: uuidv4(),
      x: plantToClone.x + 2,
      z: plantToClone.z + 2
    };
    return {
      plants: [...state.plants, newPlant],
      selectedPlantId: newPlant.id
    };
  }),
  
  clearAllPlants: () => set({ plants: [], selectedPlantId: null, manualPlacementZoneId: null })
}));
