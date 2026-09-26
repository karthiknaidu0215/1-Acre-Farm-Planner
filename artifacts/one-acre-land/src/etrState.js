import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const KEY = 'etr-nursery-prototype'

export const defaultPlants = [
  { id: 'mango-kesar', name: 'Kesar Mango', category: 'Fruit plants', price: 185, spacing: '24 × 24 ft', plantsPerAcre: 72, fertilizer: '12 kg / year', maintenance: 'Moderate', growth: '3–4 years', description: 'Sun-loving orchard trees with a generous canopy and dependable market demand.', color: '#d6a95c' },
  { id: 'coconut-tall', name: 'Tall Coconut', category: 'Avenue', price: 240, spacing: '25 × 25 ft', plantsPerAcre: 70, fertilizer: '18 kg / year', maintenance: 'Low', growth: '5–6 years', description: 'A resilient boundary and plantation staple for warm, open acreage.', color: '#8fc07a' },
  { id: 'arecanut-premium', name: 'Arecanut Premium', category: 'Avenue', price: 155, spacing: '9 × 9 ft', plantsPerAcre: 520, fertilizer: '9 kg / year', maintenance: 'High', growth: '5–7 years', description: 'Tall, elegant palms that reward careful irrigation and a considered grid.', color: '#78a983' },
  { id: 'guava-allahabad', name: 'Allahabad Guava', category: 'Fruit plants', price: 125, spacing: '15 × 15 ft', plantsPerAcre: 190, fertilizer: '8 kg / year', maintenance: 'Moderate', growth: '2–3 years', description: 'An early-bearing orchard choice with fragrant fruit and compact growth.', color: '#b2cb76' },
  { id: 'mosambi-sweet', name: 'Sweet Mosambi', category: 'Fruit plants', price: 145, spacing: '18 × 18 ft', plantsPerAcre: 130, fertilizer: '10 kg / year', maintenance: 'Moderate', growth: '3–4 years', description: 'Bright citrus with a measured canopy, ideal for mixed orchard plans.', color: '#d3c569' },
  { id: 'banana-grand-naine', name: 'Grand Naine Banana', category: 'Fruit plants', price: 42, spacing: '6 × 6 ft', plantsPerAcre: 1100, fertilizer: '5 kg / year', maintenance: 'High', growth: '10–12 months', description: 'Fast-turning, productive plants for a first harvest while the orchard matures.', color: '#d6b95b' },
  { id: 'teak-sapling', name: 'Teak Sapling', category: 'Timber / Wood', price: 95, spacing: '12 × 12 ft', plantsPerAcre: 300, fertilizer: '4 kg / year', maintenance: 'Low', growth: '12–15 years', description: 'A patient long-term asset with strong timber value and quiet presence.', color: '#9a7d5e' },
  { id: 'drumstick-moringa', name: 'Moringa', category: 'Landscaping', price: 38, spacing: '10 × 10 ft', plantsPerAcre: 435, fertilizer: '4 kg / year', maintenance: 'Low', growth: '8–10 months', description: 'A versatile, fast-growing utility crop for the working edge of a plan.', color: '#78b582' },
  { id: 'jasmine-star', name: 'Star Jasmine', category: 'Flower', price: 65, spacing: '5 × 5 ft', plantsPerAcre: 1742, fertilizer: '3 kg / year', maintenance: 'Moderate', growth: '12–18 months', description: 'A fragrant flowering layer for pathways, entries, and living garden edges.', color: '#d7c7a1' },
]

const initialState = {
  introSeen: false,
  currentUser: null,
  users: [],
  plants: defaultPlants,
  plans: [],
  bills: [],
  settings: { gstPercent: 5, serviceCharge: 1800, transportation: 1250, otherCharges: 0, discount: 0 },
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
    const parsed = JSON.parse(localStorage.getItem(KEY))
    if (parsed) return { ...initialState, ...parsed, settings: { ...initialState.settings, ...parsed.settings }, content: { ...initialState.content, ...parsed.content }, plants: parsed.plants?.length ? parsed.plants : defaultPlants }
  } catch {
    // Fresh prototype state.
  }
  return initialState
}

export function useETRStore() {
  const [state, setState] = useState(readState)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const patch = useCallback((updates) => setState((current) => ({ ...current, ...(typeof updates === 'function' ? updates(current) : updates) })), [])

  const loginUser = useCallback((name, phone) => {
    const cleanName = name.trim()
    const cleanPhone = phone.trim()
    const existing = state.users.find((user) => user.phone === cleanPhone)
    const user = existing || { id: uuidv4(), name: cleanName, phone: cleanPhone, registeredAt: new Date().toISOString() }
    setState((current) => ({ ...current, users: existing ? current.users : [...current.users, user], currentUser: user }))
    return user
  }, [state.users])

  const logout = useCallback(() => patch({ currentUser: null }), [patch])

  const updateSettings = useCallback((settings) => patch((current) => ({ settings: { ...current.settings, ...settings } })), [patch])
  const updateContent = useCallback((content) => patch((current) => ({ content: { ...current.content, ...content } })), [patch])

  const addToPlan = useCallback((plantId) => {
    patch((current) => {
      const currentPlan = current.plans.find((plan) => plan.userId === current.currentUser?.id && plan.status === 'draft')
      const items = currentPlan?.items || []
      const found = items.find((item) => item.plantId === plantId)
      const nextItems = found ? items.map((item) => item.plantId === plantId ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { plantId, quantity: 1 }]
      const nextPlan = currentPlan ? { ...currentPlan, items: nextItems } : { id: uuidv4(), userId: current.currentUser?.id || 'guest', items: nextItems, landAcres: 1, status: 'draft', createdAt: new Date().toISOString() }
      return { plans: currentPlan ? current.plans.map((plan) => plan.id === currentPlan.id ? nextPlan : plan) : [...current.plans, nextPlan] }
    })
  }, [patch])

  const getDraftPlan = useCallback((userId = state.currentUser?.id || 'guest') => state.plans.find((plan) => plan.userId === userId && plan.status === 'draft'), [state.plans, state.currentUser?.id])

  const updatePlanItems = useCallback((items, landAcres = 1) => {
    patch((current) => {
      const userId = current.currentUser?.id || 'guest'
      const draft = current.plans.find((plan) => plan.userId === userId && plan.status === 'draft')
      const next = draft ? { ...draft, items, landAcres } : { id: uuidv4(), userId, items, landAcres, status: 'draft', createdAt: new Date().toISOString() }
      return { plans: draft ? current.plans.map((plan) => plan.id === draft.id ? next : plan) : [...current.plans, next] }
    })
  }, [patch])

  const savePlan = useCallback((planInput) => {
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
  }, [patch])

  const adminLogin = useCallback((username, password) => username === 'rayudu' && password === 'rayudu', [])
  const addPlant = useCallback((plant) => patch((current) => ({ plants: [...current.plants, { ...plant, id: uuidv4(), price: Number(plant.price), plantsPerAcre: Number(plant.plantsPerAcre) }] })), [patch])
  const updatePlant = useCallback((id, updates) => patch((current) => ({ plants: current.plants.map((plant) => plant.id === id ? { ...plant, ...updates, price: Number(updates.price ?? plant.price) } : plant) })), [patch])
  const removePlant = useCallback((id) => patch((current) => ({ plants: current.plants.filter((plant) => plant.id !== id) })), [patch])
  const updateBillStatus = useCallback((id, status) => patch((current) => ({ bills: current.bills.map((bill) => bill.id === id ? { ...bill, status } : bill) })), [patch])

  const draftPlan = useMemo(() => getDraftPlan(), [getDraftPlan])
  return { ...state, patch, loginUser, logout, updateSettings, updateContent, addToPlan, getDraftPlan, draftPlan, updatePlanItems, savePlan, adminLogin, addPlant, updatePlant, removePlant, updateBillStatus }
}

export const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export function calculatePlan(plan, plants, settings) {
  const items = plan?.items || []
  const subtotal = items.reduce((sum, item) => sum + (plants.find((plant) => plant.id === item.plantId)?.price || 0) * item.quantity, 0)
  const services = Number(settings.serviceCharge || 0)
  const fertilizer = Math.round(subtotal * 0.06)
  const transportation = Number(settings.transportation || 0)
  const otherCharges = Number(settings.otherCharges || 0)
  const discount = Number(settings.discount || 0)
  const taxable = Math.max(0, subtotal + services + fertilizer + transportation + otherCharges - discount)
  const tax = Math.round(taxable * Number(settings.gstPercent || 0) / 100)
  return { subtotal, services, fertilizer, transportation, otherCharges, discount, tax, total: taxable + tax }
}