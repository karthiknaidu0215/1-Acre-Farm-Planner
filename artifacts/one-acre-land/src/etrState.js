import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useStore } from './store'
import { defaultPlants, initialSelectedPlantIds, PLANT_SIZES, getPlantSizePrices, getPlantSizeImage, getPlantSizeDetails, getPlantSizeAvailability, isPlantSizeAvailable } from './plantsData'

export { defaultPlants, initialSelectedPlantIds, PLANT_SIZES, getPlantSizePrices, getPlantSizeImage, getPlantSizeDetails, getPlantSizeAvailability, isPlantSizeAvailable }

const KEY = 'etr-nursery-prototype'

export const defaultLandPricing = {
  S: {
    id: 'S',
    code: 'S',
    name: 'Small Plot',
    acres: 0.5,
    size: '0.5 Acre',
    sqft: '21,780 sq ft',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    description: 'Compact 0.5-acre agricultural plot with rich soil and distinct boundary fencing. Ideal for high-density fruit orchards, nursery beds, or specialized agroforestry.',
    capacity: '120–180 saplings',
    dimensions: '147.5 × 147.5 ft'
  },
  M: {
    id: 'M',
    code: 'M',
    name: 'Standard Acre',
    acres: 1.0,
    size: '1.0 Acre',
    sqft: '43,560 sq ft',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=1200&q=80',
    description: 'Full 1-acre fertile parcel engineered for balanced multi-crop zoning, internal irrigation access roads, and optimum crop yield.',
    capacity: '300–450 saplings',
    dimensions: '208.7 × 208.7 ft'
  },
  L: {
    id: 'L',
    code: 'L',
    name: 'Estate Acreage',
    acres: 2.5,
    size: '2.5 Acres',
    sqft: '1,08,900 sq ft',
    price: 195000,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
    description: 'Expansive 2.5-acre agro-estate suitable for extensive commercial timber, orchard blocks, farmhouses, and water retention lakes.',
    capacity: '750–1,100 saplings',
    dimensions: '330 × 330 ft'
  }
}

const defaultUser = { id: 'usr-karthik', name: 'Karthik Naidu', phone: '+91 98490 21212', registeredAt: '2026-01-01' }

const initialSelectedPlantSizes = {
  'mango-kesar': 'M',
  'guava-allahabad': 'M',
  'teak-sapling': 'M',
  'coconut-tall': 'M',
  'arecanut-premium': 'M',
  'mosambi-sweet': 'M',
  'banana-grand-naine': 'M',
  'drumstick-moringa': 'M',
  'jasmine-star': 'M',
}

const initialState = {
  introSeen: true,
  currentUser: defaultUser,
  users: [defaultUser],
  plants: defaultPlants,
  selectedPlantIds: initialSelectedPlantIds,
  selectedPlantSizes: initialSelectedPlantSizes,
  plans: [],
  bills: [],
  settings: {
    gstPercent: 5,
    serviceCharge: 1800,
    transportation: 1250,
    otherCharges: 0,
    discount: 0,
    landPricing: defaultLandPricing,
  },
  content: {
    heroTitle: 'Plan Your Land. Grow Your Future.',
    heroSubtitle: 'Smart plantation planning for every acre.',
    description: 'ETR NURSERY brings planting intelligence, trusted nursery stock, and practical planning into one calm command center for landowners.',
    services: 'Plant selection, spatial planning, nursery supply, delivery coordination, and aftercare guidance.',
    contact: '+91 98490 21212 · nursery@etr.ag'
  }
}

function readState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed) {
        // Merge stored plants with defaultPlants so new images, spacing, and sizePrices (S, M, L) are preserved
        const mergedPlants = (parsed.plants?.length ? parsed.plants : defaultPlants).map((p) => {
          const def = defaultPlants.find((dp) => dp.id === p.id)
          const fallbackPrices = getPlantSizePrices(p)
          const sizePrices = p.sizePrices || def?.sizePrices || fallbackPrices
          const sizeAvailability = {
            S: p.sizeAvailability?.S !== false && def?.sizeAvailability?.S !== false,
            M: p.sizeAvailability?.M !== false && def?.sizeAvailability?.M !== false,
            L: p.sizeAvailability?.L !== false && def?.sizeAvailability?.L !== false,
          }
          if (p.sizeAvailability) {
            if (p.sizeAvailability.S !== undefined) sizeAvailability.S = Boolean(p.sizeAvailability.S)
            if (p.sizeAvailability.M !== undefined) sizeAvailability.M = Boolean(p.sizeAvailability.M)
            if (p.sizeAvailability.L !== undefined) sizeAvailability.L = Boolean(p.sizeAvailability.L)
          }
          return def ? {
            ...def,
            ...p,
            sizePrices: {
              S: Number(sizePrices.S || def.sizePrices.S),
              M: Number(sizePrices.M || def.sizePrices.M),
              L: Number(sizePrices.L || def.sizePrices.L),
            },
            sizeAvailability,
            sizeImages: def.sizeImages || p.sizeImages,
            price: Number(p.price || sizePrices.M || def.price),
            image: def.image,
            p2p: def.p2p,
            r2r: def.r2r,
            shortName: def.shortName
          } : {
            ...p,
            sizePrices,
            sizeAvailability,
            price: Number(p.price || sizePrices.M || 100)
          }
        })

        // Ensure newly added default plants are present
        defaultPlants.forEach((dp) => {
          if (!mergedPlants.some((p) => p.id === dp.id)) {
            mergedPlants.push(dp)
          }
        })

        const selectedPlantIds = Array.isArray(parsed.selectedPlantIds)
          ? parsed.selectedPlantIds
          : initialSelectedPlantIds

        const selectedPlantSizes = {
          ...initialSelectedPlantSizes,
          ...(parsed.selectedPlantSizes || {})
        }

        const landPricing = {
          S: { ...defaultLandPricing.S, ...(parsed.settings?.landPricing?.S || {}) },
          M: { ...defaultLandPricing.M, ...(parsed.settings?.landPricing?.M || {}) },
          L: { ...defaultLandPricing.L, ...(parsed.settings?.landPricing?.L || {}) }
        }

        return {
          ...initialState,
          ...parsed,
          introSeen: true,
          currentUser: parsed.currentUser || defaultUser,
          plants: mergedPlants,
          selectedPlantIds,
          selectedPlantSizes,
          settings: { ...initialState.settings, ...parsed.settings, landPricing },
          content: { ...initialState.content, ...parsed.content },
        }
      }
    }
  } catch {
    // Fresh prototype state.
  }
  return initialState
}

export function useETRStore() {
  const [state, setState] = useState(readState)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch (err) {
      console.warn('Failed to save to localStorage:', err)
    }
    // Keep 3D planner store in sync safely
    try {
      const storeState = useStore?.getState?.()
      if (storeState && typeof storeState.syncWithLibrary === 'function') {
        storeState.syncWithLibrary(state.plants, state.selectedPlantIds, state.selectedPlantSizes)
      }
    } catch (err) {
      console.warn('Sync with library deferred:', err)
    }
  }, [state])

  const patch = (updates) => setState((current) => ({
    ...current,
    ...(typeof updates === 'function' ? updates(current) : updates)
  }))

  const loginUser = (name, phone) => {
    const cleanName = name.trim()
    const cleanPhone = phone.trim()
    const existing = state.users.find((user) => user.phone === cleanPhone)
    const user = existing || { id: uuidv4(), name: cleanName, phone: cleanPhone, registeredAt: new Date().toISOString() }
    setState((current) => ({ ...current, users: existing ? current.users : [...current.users, user], currentUser: user }))
    return user
  }

  const logout = () => patch({ currentUser: null })

  const updateSettings = (settings) => patch((current) => ({ settings: { ...current.settings, ...settings } }))
  const updateContent = (content) => patch((current) => ({ content: { ...current.content, ...content } }))

  // Select plant size (S, M, L) and sync unit price into draft plan items
  const setPlantSelectedSize = (plantId, size) => {
    patch((current) => {
      const plant = current.plants.find((p) => p.id === plantId)
      const sizePrices = getPlantSizePrices(plant)
      const unitPrice = sizePrices[size] || plant?.price || 0
      const nextSizes = { ...(current.selectedPlantSizes || {}), [plantId]: size }

      const plans = current.plans.map((plan) => {
        if (plan.status !== 'draft') return plan
        const items = (plan.items || []).map((item) => {
          if (item.plantId === plantId) {
            return { ...item, size, price: unitPrice }
          }
          return item
        })
        return { ...plan, items }
      })

      return {
        selectedPlantSizes: nextSizes,
        plans
      }
    })
  }

  // Toggle selection for Plan My Acre connection with chosen plant size
  const togglePlantSelection = (plantId, optionalSize) => {
    patch((current) => {
      const currentSelected = current.selectedPlantIds || []
      const isSelected = currentSelected.includes(plantId)
      const nextSelected = isSelected
        ? currentSelected.filter((id) => id !== plantId)
        : [...currentSelected, plantId]

      const plant = current.plants.find((p) => p.id === plantId)
      const size = optionalSize || current.selectedPlantSizes?.[plantId] || 'M'
      const sizePrices = getPlantSizePrices(plant)
      const price = sizePrices[size] || plant?.price || 0

      // Also ensure draft plan reflects items if adding or removing
      let plans = current.plans
      if (!isSelected) {
        const currentPlan = current.plans.find((plan) => plan.userId === (current.currentUser?.id || 'guest') && plan.status === 'draft')
        const items = currentPlan?.items || []
        if (!items.some((i) => i.plantId === plantId)) {
          const nextItems = [...items, { plantId, size, price, quantity: 10 }]
          const nextPlan = currentPlan
            ? { ...currentPlan, items: nextItems }
            : { id: uuidv4(), userId: current.currentUser?.id || 'guest', items: nextItems, landAcres: 1, status: 'draft', createdAt: new Date().toISOString() }
          plans = currentPlan ? current.plans.map((p) => p.id === currentPlan.id ? nextPlan : p) : [...current.plans, nextPlan]
        }
      } else {
        const currentPlan = current.plans.find((plan) => plan.userId === (current.currentUser?.id || 'guest') && plan.status === 'draft')
        if (currentPlan) {
          const nextItems = (currentPlan.items || []).filter((i) => i.plantId !== plantId)
          const nextPlan = { ...currentPlan, items: nextItems }
          plans = current.plans.map((p) => p.id === currentPlan.id ? nextPlan : p)
        }
      }

      return {
        selectedPlantIds: nextSelected,
        selectedPlantSizes: { ...(current.selectedPlantSizes || {}), [plantId]: size },
        plans,
      }
    })
  }

  const isPlantSelected = (plantId) => {
    return (state.selectedPlantIds || []).includes(plantId)
  }

  const addToPlan = (plantId, optionalSize) => {
    patch((current) => {
      const currentSelected = current.selectedPlantIds || []
      const nextSelected = currentSelected.includes(plantId) ? currentSelected : [...currentSelected, plantId]

      const plant = current.plants.find((p) => p.id === plantId)
      const size = optionalSize || current.selectedPlantSizes?.[plantId] || 'M'
      const sizePrices = getPlantSizePrices(plant)
      const price = sizePrices[size] || plant?.price || 0

      const currentPlan = current.plans.find((plan) => plan.userId === (current.currentUser?.id || 'guest') && plan.status === 'draft')
      const items = currentPlan?.items || []
      const found = items.find((item) => item.plantId === plantId)
      const nextItems = found
        ? items.map((item) => item.plantId === plantId ? { ...item, quantity: item.quantity + 1, size: size || item.size, price: price || item.price } : item)
        : [...items, { plantId, size, price, quantity: 1 }]
      const nextPlan = currentPlan
        ? { ...currentPlan, items: nextItems }
        : { id: uuidv4(), userId: current.currentUser?.id || 'guest', items: nextItems, landAcres: 1, status: 'draft', createdAt: new Date().toISOString() }

      return {
        selectedPlantIds: nextSelected,
        selectedPlantSizes: { ...(current.selectedPlantSizes || {}), [plantId]: size },
        plans: currentPlan ? current.plans.map((plan) => plan.id === currentPlan.id ? nextPlan : plan) : [...current.plans, nextPlan]
      }
    })
  }

  const getDraftPlan = (userId = state.currentUser?.id || 'guest') => state.plans.find((plan) => plan.userId === userId && plan.status === 'draft')

  const updatePlanItems = (items, landAcres = 1) => {
    patch((current) => {
      const userId = current.currentUser?.id || 'guest'
      const draft = current.plans.find((plan) => plan.userId === userId && plan.status === 'draft')
      const next = draft ? { ...draft, items, landAcres } : { id: uuidv4(), userId, items, landAcres, status: 'draft', createdAt: new Date().toISOString() }
      return { plans: draft ? current.plans.map((plan) => plan.id === draft.id ? next : plan) : [...current.plans, next] }
    })
  }

  const savePlan = (planInput) => {
    let saved
    patch((current) => {
      const userId = current.currentUser?.id || 'guest'
      const draft = current.plans.find((plan) => plan.userId === userId && plan.status === 'draft')
      saved = { ...(draft || {}), ...planInput, id: draft?.id || uuidv4(), userId, status: 'confirmed', createdAt: draft?.createdAt || new Date().toISOString() }
      const plans = draft ? current.plans.map((plan) => plan.id === draft.id ? saved : plan) : [...current.plans, saved]
      const bill = { id: `ETR-${new Date().getFullYear()}-${String(current.bills.length + 1).padStart(4, '0')}`, planId: saved.id, userId, amount: saved.total, status: 'review', createdAt: saved.createdAt }
      return { plans, bills: [...current.bills, bill] }
    })
    return saved
  }

  const adminLogin = (username, password) => username === 'rayudu' && password === 'rayudu'

  const addPlant = (plant) => patch((current) => {
    const sizePrices = plant.sizePrices || getPlantSizePrices(plant)
    const sizeAvailability = plant.sizeAvailability || { S: true, M: true, L: true }
    const newPlant = {
      ...plant,
      id: uuidv4(),
      price: Number(sizePrices.M || plant.price),
      sizePrices: {
        S: Number(sizePrices.S),
        M: Number(sizePrices.M || plant.price),
        L: Number(sizePrices.L),
      },
      sizeAvailability: {
        S: sizeAvailability.S !== false,
        M: sizeAvailability.M !== false,
        L: sizeAvailability.L !== false,
      },
      plantsPerAcre: Number(plant.plantsPerAcre)
    }
    return {
      plants: [...current.plants, newPlant]
    }
  })

  const updatePlant = (id, updates) => patch((current) => {
    const updatedPlants = current.plants.map((plant) => {
      if (plant.id !== id) return plant
      const currentSizePrices = plant.sizePrices || getPlantSizePrices(plant)
      const nextSizePrices = {
        S: Number(updates.sizePrices?.S ?? updates.priceS ?? currentSizePrices.S),
        M: Number(updates.sizePrices?.M ?? updates.priceM ?? updates.price ?? currentSizePrices.M),
        L: Number(updates.sizePrices?.L ?? updates.priceL ?? currentSizePrices.L),
      }
      const currentAvailability = plant.sizeAvailability || { S: true, M: true, L: true }
      const nextAvailability = {
        S: updates.sizeAvailability?.S !== undefined ? Boolean(updates.sizeAvailability.S) : currentAvailability.S,
        M: updates.sizeAvailability?.M !== undefined ? Boolean(updates.sizeAvailability.M) : currentAvailability.M,
        L: updates.sizeAvailability?.L !== undefined ? Boolean(updates.sizeAvailability.L) : currentAvailability.L,
      }
      const price = Number(updates.price ?? nextSizePrices.M ?? plant.price)
      return {
        ...plant,
        ...updates,
        price,
        sizePrices: nextSizePrices,
        sizeAvailability: nextAvailability,
      }
    })

    // Sync updated prices into any existing draft plans
    const updatedPlans = current.plans.map((plan) => {
      if (plan.status !== 'draft') return plan
      const items = (plan.items || []).map((item) => {
        if (item.plantId === id) {
          const plantObj = updatedPlants.find((p) => p.id === id)
          const sizePrices = getPlantSizePrices(plantObj)
          const unitPrice = sizePrices[item.size || 'M'] || plantObj?.price || item.price
          return { ...item, price: unitPrice }
        }
        return item
      })
      return { ...plan, items }
    })

    return {
      plants: updatedPlants,
      plans: updatedPlans,
    }
  })

  const setPlantSizeAvailability = (plantId, size, isAvailable) => {
    updatePlant(plantId, {
      sizeAvailability: {
        [size]: Boolean(isAvailable)
      }
    })
  }

  const removePlant = (id) => patch((current) => ({
    plants: current.plants.filter((plant) => plant.id !== id),
    selectedPlantIds: (current.selectedPlantIds || []).filter((pid) => pid !== id),
  }))

  const updateBillStatus = (id, status) => patch((current) => ({
    bills: current.bills.map((bill) => bill.id === id ? { ...bill, status } : bill),
    plans: current.plans.map((plan) => {
      const bill = current.bills.find((entry) => entry.id === id)
      return bill && plan.id === bill.planId ? { ...plan, status } : plan
    })
  }))

  const draftPlan = getDraftPlan()

  return {
    ...state,
    patch,
    loginUser,
    logout,
    updateSettings,
    updateContent,
    addToPlan,
    togglePlantSelection,
    setPlantSelectedSize,
    isPlantSelected,
    getDraftPlan,
    draftPlan,
    updatePlanItems,
    savePlan,
    adminLogin,
    addPlant,
    updatePlant,
    setPlantSizeAvailability,
    removePlant,
    updateBillStatus
  }
}

export const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export function calculatePlan(plan, plants, settings) {
  const items = plan?.items || []
  const subtotal = items.reduce((sum, item) => {
    const plant = plants.find((p) => p.id === item.plantId)
    const unitPrice = item.price || (item.size && plant?.sizePrices?.[item.size]) || plant?.price || 0
    return sum + unitPrice * item.quantity
  }, 0)
  const services = Number(settings.serviceCharge || 0)
  const fertilizer = Math.round(subtotal * 0.06)
  const transportation = Number(settings.transportation || 0)
  const otherCharges = Number(settings.otherCharges || 0)
  const discount = Number(settings.discount || 0)
  const taxable = Math.max(0, subtotal + services + fertilizer + transportation + otherCharges - discount)
  const tax = Math.round(taxable * Number(settings.gstPercent || 0) / 100)
  return { subtotal, services, fertilizer, transportation, otherCharges, discount, tax, total: taxable + tax }
}
