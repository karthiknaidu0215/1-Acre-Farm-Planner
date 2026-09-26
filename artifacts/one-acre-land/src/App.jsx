import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Check, ChevronRight, CircleDollarSign, Download, FileText, Leaf, Library,
  LogOut, Map, MapPinned, Menu, Minus, Pencil, Plus, Receipt, Search, Settings2,
  Save, Shield, Sprout, Trash2, Truck, Users, X,
} from 'lucide-react'
import PlannerWorkspace from './PlannerWorkspace'
import { useStore } from './store'
import { calculatePlan, money, useETRStore } from './etrState'
import './index.css'

const CATEGORIES = ['All', 'Fruit plants', 'Timber / Wood', 'Avenue', 'Flower', 'Landscaping']

function BrandMark({ light = false }) {
  return (
    <div className={`brand-lockup ${light ? 'brand-light' : ''}`}>
      <div className="brand-mark"><Leaf size={17} strokeWidth={1.5} /></div>
      <div>
        <div className="brand-name">ETR NURSERY</div>
        <div className="brand-sub">PLANTATION INTELLIGENCE</div>
      </div>
    </div>
  )
}

function Intro({ onSkip }) {
  return (
    <main className="intro-screen">
      <div className="intro-noise" />
      <div className="intro-orbit intro-orbit-one" />
      <div className="intro-orbit intro-orbit-two" />
      <div className="intro-content">
        <div className="intro-mark"><Leaf size={38} strokeWidth={1.2} /></div>
        <div className="eyebrow">EST. 2024 · LAND, PLANNED WELL</div>
        <h1>ETR<br /><em>NURSERY</em></h1>
        <p>A considered way to turn one acre into a living future.</p>
        <button className="btn-primary intro-skip" onClick={onSkip}>Enter the nursery <ArrowRight size={15} /></button>
      </div>
      <button className="intro-skip-link" onClick={onSkip}>Skip intro</button>
    </main>
  )
}

function Landing({ content, onNavigate }) {
  return (
    <main className="landing">
      <div className="landing-grid" />
      <nav className="landing-nav">
        <BrandMark />
        <div className="landing-nav-actions">
          <button className="btn-quiet" onClick={() => onNavigate('catalog-public')}>Explore plants</button>
          <button className="btn-primary" onClick={() => onNavigate('user-auth')}>Start planning <ArrowRight size={14} /></button>
        </div>
      </nav>
      <section className="landing-main">
        <div className="landing-copy">
          <div className="eyebrow">PLANTATION PLANNING, REFINED</div>
          <h1 className="landing-title">{content.heroTitle.split('. ')[0]}<span>{content.heroTitle.split('. ')[1] || 'Grow your future.'}</span></h1>
          <p className="landing-sub">{content.heroSubtitle} ETR NURSERY brings land size, location, plant spacing, investment, and estimated requirements into one clear plan.</p>
          <div className="landing-ctas">
            <button className="btn-primary btn-large" onClick={() => onNavigate('user-auth')}>Plan my acre <ArrowRight size={16} /></button>
            <button className="btn-outline btn-large" onClick={() => onNavigate('catalog-public')}>Browse the collection</button>
          </div>
          <div className="landing-proof">
            <span><strong>01</strong> choose</span><span><strong>02</strong> arrange</span><span><strong>03</strong> grow</span>
          </div>
        </div>
        <div className="landing-orbit-wrap">
          <div className="landing-orbit">
            <div className="orbit-satellite satellite-one">1 ACRE</div>
            <div className="orbit-satellite satellite-two">LIVE PLAN</div>
            <div className="orbit-center"><Sprout size={35} strokeWidth={1} /><strong>1</strong><small>ACRE<br />READY</small></div>
          </div>
          <div className="floating-stat floating-stat-top"><span>Estimated capacity</span><strong>43560 <small>sq ft</small></strong></div>
          <div className="floating-stat floating-stat-bottom"><span>Planning signal</span><strong className="signal-dot">● <small>healthy</small></strong></div>
        </div>
      </section>
      <div className="landing-foot"><span>Smart plantation planning for every acre</span><button className="admin-access" onClick={() => onNavigate('admin-auth')}><Shield size={12} /> Admin access</button></div>
    </main>
  )
}

function AuthPage({ mode, onBack, onUserLogin, onAdminLogin }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const isAdmin = mode === 'admin'

  function submit(event) {
    event.preventDefault()
    if (isAdmin) {
      if (!onAdminLogin(username, password)) setError('That admin sign-in was not accepted.')
      return
    }
    if (name.trim().length < 2 || phone.trim().length < 6) {
      setError('Enter your name and a valid phone number to continue.')
      return
    }
    onUserLogin(name, phone)
  }

  return (
    <main className="auth-page">
      <section className="auth-art">
        <BrandMark light />
        <div>
          <div className="eyebrow">ETR NURSERY / {isAdmin ? 'CONTROL ROOM' : 'FIELD ACCESS'}</div>
          <h1 className="auth-quote">{isAdmin ? <>Keep every <em>planting decision</em> in view.</> : <>Your next acre starts with a <em>clearer plan.</em></>}</h1>
          <p className="auth-caption">{isAdmin ? 'Manage the living catalog, business settings, and every confirmed plantation plan from one place.' : 'Save your plans, compare plants, and return to the field layout whenever the idea changes.'}</p>
        </div>
        <div className="auth-art-footer">ETR / 01 — PLANTATION INTELLIGENCE</div>
      </section>
      <section className="auth-form-side">
        <div className="auth-box">
          <button className="back-link" onClick={onBack}><ArrowRight size={14} className="back-arrow" /> Back to ETR</button>
          <div className="eyebrow">{isAdmin ? 'ADMIN ACCESS' : 'USER ACCESS'}</div>
          <h1>{isAdmin ? 'Control room' : 'Welcome in'}</h1>
          <p>{isAdmin ? 'Sign in to manage the nursery operating layer.' : 'A name and phone number are all we need for this prototype.'}</p>
          <form onSubmit={submit}>
            {isAdmin ? (
              <>
                <Field label="Username" value={username} onChange={setUsername} placeholder="Your admin username" />
                <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" />
              </>
            ) : (
              <>
                <Field label="Your name" value={name} onChange={setName} placeholder="e.g. Ananya Rao" />
                <Field label="Phone number" value={phone} onChange={setPhone} placeholder="+91 00000 00000" />
              </>
            )}
            {error && <div className="error-note">{error}</div>}
            <button className="btn-primary btn-block" type="submit">{isAdmin ? 'Enter dashboard' : 'Create my workspace'} <ArrowRight size={15} /></button>
          </form>
          {!isAdmin && <p className="auth-note">By continuing, you agree to keep your planning details private to this workspace.</p>}
          {isAdmin && <button className="text-link auth-switch" onClick={() => onBack('user-auth')}>Return to user login</button>}
        </div>
      </section>
    </main>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return <div className="form-field"><label>{label}</label><input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></div>
}

function Shell({ admin, user, active, onNavigate, onLogout, children }) {
  const [open, setOpen] = useState(false)
  const userLinks = [
    ['dashboard', 'Overview', LayoutDashboardIcon],
    ['planner', 'Plan my acre', MapIcon],
    ['catalog', 'Plant library', Library],
    ['plan', 'Live estimate', CircleDollarSign],
    ['bill', 'Bills & plans', Receipt],
  ]
  const adminLinks = [
    ['admin', 'Command center', LayoutDashboardIcon],
    ['admin-plants', 'Plants & categories', Library],
    ['admin-pricing', 'Pricing & taxes', CircleDollarSign],
    ['admin-content', 'Website content', Pencil],
    ['admin-users', 'Users', Users],
    ['admin-orders', 'Plans & bills', FileText],
  ]
  const links = admin ? adminLinks : userLinks
  return (
    <div className="etr-shell">
      <aside className={`etr-sidebar ${open ? 'open' : ''}`}>
        <BrandMark />
        <div className="nav-label">{admin ? 'OPERATIONS' : 'YOUR WORKSPACE'}</div>
        <nav className="side-nav">
          {links.map(([id, label, Icon]) => <button key={id} className={`side-link ${active === id ? 'active' : ''}`} onClick={() => { onNavigate(id); setOpen(false) }}><Icon size={16} />{label}</button>)}
        </nav>
        <div className="sidebar-rail-note"><span className="rail-line" /><span>{admin ? 'ETR CONTROL ROOM' : 'FIELD NOTES / 01'}</span></div>
        <div className="sidebar-foot">
          <div className="account-mini"><div className="avatar">{admin ? 'R' : user?.name?.slice(0, 1).toUpperCase()}</div><span>{admin ? 'Rayudu · Admin' : user?.name}</span></div>
          <button className="logout-button" onClick={onLogout}><LogOut size={13} /> Sign out</button>
        </div>
      </aside>
      <div className="main-stage">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(!open)}><Menu size={17} /></button>
          <div className="breadcrumb">ETR NURSERY <ChevronRight size={12} /> <strong>{admin ? 'Control room' : labelFor(active)}</strong></div>
          <div className="top-actions">
            <span className="status-pulse"><span /> {admin ? 'LIVE OPERATIONS' : 'PLAN IN PROGRESS'}</span>
            {!admin && <button className="btn-quiet top-plan-button" onClick={() => onNavigate('plan')}><Receipt size={14} /> My estimate</button>}
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}

function LayoutDashboardIcon(props) { return <MapPinned {...props} /> }
function MapIcon(props) { return <Map {...props} /> }
function labelFor(active) {
  return { dashboard: 'Overview', planner: '1-acre planner', catalog: 'Plant library', plan: 'Live estimate', bill: 'Bills & plans', admin: 'Command center', 'admin-plants': 'Plants', 'admin-pricing': 'Pricing & taxes', 'admin-content': 'Website content', 'admin-users': 'Users', 'admin-orders': 'Plans & bills' }[active] || 'Overview'
}

function Dashboard({ user, state, onNavigate }) {
  const confirmed = state.plans.filter((plan) => plan.userId === user.id && plan.status !== 'draft')
  const draft = state.plans.find((plan) => plan.userId === user.id && plan.status === 'draft')
  return (
    <PageWrap eyebrow="FIELD NOTES / OVERVIEW" title={<>Good morning, <em>{user.name.split(' ')[0]}.</em></>} intro="Your land plan, nursery shortlist, and latest estimate stay together here.">
      <div className="metric-grid">
        <Metric label="Land in focus" value="1 acre" note="A clear starting point" />
        <Metric label="Plants shortlisted" value={String(draft?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0)} note="Across your live plan" />
        <Metric label="Saved plans" value={String(confirmed.length)} note="Ready for review" />
        <Metric label="Catalog signal" value={String(state.plants.length)} note="Nursery selections" />
      </div>
      <div className="dashboard-grid">
        <div className="glass-card plan-preview card-pad">
          <div className="plan-preview-content">
            <div><div className="card-kicker">YOUR NEXT FIELD</div><h2 className="card-title">One acre, made legible.</h2><p className="page-intro">Set spacing, place infrastructure, and see the farm before the first sapling arrives.</p></div>
            <div><div className="plan-preview-figure">01</div><div className="progress-line"><span style={{ width: draft?.items?.length ? '64%' : '18%' }} /></div><div className="preview-foot"><span>{draft?.items?.length ? 'Plan is taking shape' : 'Start with a plant shortlist'}</span><button className="text-link" onClick={() => onNavigate('planner')}>Open planner <ArrowRight size={13} /></button></div></div>
          </div>
        </div>
        <div className="glass-card card-pad">
          <div className="card-kicker">RECENT ACTIVITY</div>
          <div className="activity-list">
            <Activity title="Workspace opened" detail="Your 1-acre plan is ready" />
            {draft?.items?.length ? <Activity title="Plants shortlisted" detail={`${draft.items.length} varieties in estimate`} /> : <Activity title="No plants selected" detail="Visit the library to begin" />}
            {confirmed.length ? <Activity title="Plan confirmed" detail={`${confirmed.length} bill${confirmed.length > 1 ? 's' : ''} generated`} /> : <Activity title="No confirmed bills" detail="Your final bill appears here" />}
          </div>
        </div>
      </div>
      <div className="section-heading"><div><h2>Make the next move</h2><p>Everything you need for a considered first pass.</p></div></div>
      <div className="action-grid">
        <ActionCard icon={<Map size={18} />} eyebrow="01 / ARRANGE" title="Plan my acre" text="Use the living layout to test spacing and infrastructure." onClick={() => onNavigate('planner')} />
        <ActionCard icon={<Library size={18} />} eyebrow="02 / CHOOSE" title="Explore plants" text="Build a shortlist from the nursery collection." onClick={() => onNavigate('catalog')} />
        <ActionCard icon={<CircleDollarSign size={18} />} eyebrow="03 / COMMIT" title="Review estimate" text="See current prices, tax, and services in one view." onClick={() => onNavigate('plan')} />
      </div>
    </PageWrap>
  )
}

function Metric({ label, value, note }) { return <div className="glass-card metric-card"><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></div> }
function Activity({ title, detail }) { return <div className="activity-row"><span className="activity-dot" /><div className="activity-main"><strong>{title}</strong><br />{detail}</div><span className="activity-time">now</span></div> }
function ActionCard({ icon, eyebrow, title, text, onClick }) { return <button className="action-card glass-card" onClick={onClick}><div className="action-icon">{icon}</div><div className="card-kicker">{eyebrow}</div><h3>{title}</h3><p>{text}</p><ArrowRight size={15} /></button> }
function PageWrap({ eyebrow, title, intro, children }) { return <main className="page-wrap"><div className="eyebrow">{eyebrow}</div><h1 className="display-title">{title}</h1><p className="page-intro">{intro}</p>{children}</main> }

function CatalogPage({ state, onAdd, onNeedLogin, onBack, publicView = false }) {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState(null)
  const shown = state.plants.filter((plant) => (category === 'All' || plant.category === category) && `${plant.name} ${plant.category}`.toLowerCase().includes(search.toLowerCase()))
  return (
    <PageWrap eyebrow="THE COLLECTION / PLANT LIBRARY" title={<>Choose with <em>intention.</em></>} intro="Nursery stock with the spacing, maintenance, and growth context needed to make a confident acre plan.">
      {publicView && <button className="back-link page-back" onClick={onBack}><ArrowRight size={14} className="back-arrow" /> Back to ETR</button>}
      <div className="catalog-toolbar"><div className="search-box"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the collection" /></div><div className="filter-pills">{CATEGORIES.map((item) => <button key={item} className={`filter-pill ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
      <div className="catalog-grid">
        {shown.map((plant) => <PlantCard key={plant.id} plant={plant} onAdd={() => state.currentUser ? onAdd(plant.id) : onNeedLogin()} onDetail={() => setDetail(plant)} />)}
      </div>
      {!shown.length && <div className="empty-state glass-card"><Sprout size={24} /><h3>No plants in this view</h3><p>Try another search or category.</p></div>}
      {detail && <PlantDetail plant={detail} onClose={() => setDetail(null)} onAdd={() => { onAdd(detail.id); setDetail(null) }} canAdd={Boolean(state.currentUser)} onNeedLogin={onNeedLogin} />}
    </PageWrap>
  )
}

function PlantCard({ plant, onAdd, onDetail }) {
  return <article className="plant-card glass-card"><div className="plant-visual" style={{ '--plant-color': plant.color }}><div className="plant-glyph"><Sprout size={54} strokeWidth={1} /></div><div className="plant-category">{plant.category}</div><div className="plant-orb" /></div><div className="plant-card-body"><h3>{plant.name}</h3><p>{plant.description}</p><div className="plant-meta"><div className="meta-stat">SPACING<strong>{plant.spacing}</strong></div><div className="meta-stat">PER ACRE<strong>{plant.plantsPerAcre} plants</strong></div></div><div className="plant-actions"><span className="plant-price">{money(plant.price)} <small>/ sapling</small></span><div><button className="icon-text-button" onClick={onDetail}>Details</button><button className="btn-primary btn-small" onClick={onAdd}>Add to plan <Plus size={13} /></button></div></div></div></article>
}

function PlantDetail({ plant, onClose, onAdd, canAdd, onNeedLogin }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="detail-modal glass-card"><button className="modal-close" onClick={onClose}><X size={16} /></button><div className="detail-visual" style={{ '--plant-color': plant.color }}><Sprout size={74} strokeWidth={1} /></div><div className="eyebrow">{plant.category} / NURSERY NOTE</div><h2>{plant.name}</h2><p>{plant.description}</p><div className="detail-facts"><Fact label="Unit price" value={money(plant.price)} /><Fact label="Recommended spacing" value={plant.spacing} /><Fact label="Fertilizer" value={plant.fertilizer} /><Fact label="Growth signal" value={plant.growth} /><Fact label="Maintenance" value={plant.maintenance} /><Fact label="Plants / acre" value={String(plant.plantsPerAcre)} /></div><button className="btn-primary btn-block" onClick={() => canAdd ? onAdd() : onNeedLogin()}>{canAdd ? 'Add to my plan' : 'Sign in to add'} <ArrowRight size={15} /></button></div></div>
}
function Fact({ label, value }) { return <div><span>{label}</span><strong>{value}</strong></div> }

function PlanPage({ state, draft, onUpdateItems, onNavigate, onConfirm }) {
  const quote = calculatePlan(draft, state.plants, state.settings)
  const items = draft?.items || []
  const updateQty = (plantId, delta) => onUpdateItems(items.map((item) => item.plantId === plantId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0), draft?.landAcres || 1)
  return <PageWrap eyebrow="LIVE ESTIMATE / 01 ACRE" title={<>Your plan, in <em>numbers.</em></>} intro="Every quantity change recalculates nursery stock, services, fertilizer, transport, and GST immediately.">
    <div className="plan-toolbar"><button className="btn-outline" onClick={() => onNavigate('catalog')}><Plus size={14} /> Add plants</button><button className="btn-quiet" onClick={() => onNavigate('planner')}><Map size={14} /> Open field planner</button></div>
    {!items.length ? <div className="empty-state glass-card"><CircleDollarSign size={27} /><h3>Your estimate is waiting</h3><p>Choose a few plants from the library, then return here to see the live total.</p><button className="btn-primary" onClick={() => onNavigate('catalog')}>Explore plants <ArrowRight size={14} /></button></div> : <div className="summary-layout"><div className="glass-card summary-list"><div className="summary-list-head"><span>SELECTED PLANTS</span><span>QTY / TOTAL</span></div>{items.map((item) => { const plant = state.plants.find((entry) => entry.id === item.plantId); if (!plant) return null; return <div className="summary-row" key={item.plantId}><div className="summary-plant"><strong>{plant.name}</strong><small>{plant.spacing} · {money(plant.price)} per sapling · approx. {areaFor(plant, item.quantity)} sq ft</small></div><div className="qty-control"><button onClick={() => updateQty(plant.id, -1)}><Minus size={12} /></button><span>{item.quantity}</span><button onClick={() => updateQty(plant.id, 1)}><Plus size={12} /></button></div><div className="line-price">{money(plant.price * item.quantity)}</div><button className="remove-icon" onClick={() => onUpdateItems(items.filter((entry) => entry.plantId !== plant.id), draft?.landAcres || 1)}><Trash2 size={14} /></button></div> })}<div className="area-readout"><MapPinned size={15} /><div><span>Planning area</span><strong>1 acre · {items.reduce((sum, item) => sum + item.quantity, 0)} saplings shortlisted</strong></div><button className="text-link" onClick={() => onNavigate('planner')}>Arrange visually</button></div></div><QuoteCard quote={quote} settings={state.settings} onConfirm={onConfirm} /></div>}
  </PageWrap>
}

function QuoteCard({ quote, settings, onConfirm }) { return <aside className="glass-card summary-side"><div className="card-kicker">ESTIMATE / INR</div><h3>Investment view</h3><div className="cost-line"><span>Plant cost</span><strong>{money(quote.subtotal)}</strong></div><div className="cost-line"><span>Plantation services</span><strong>{money(quote.services)}</strong></div><div className="cost-line"><span>Fertilizer provision</span><strong>{money(quote.fertilizer)}</strong></div><div className="cost-line"><span>Transportation</span><strong>{money(quote.transportation)}</strong></div>{quote.otherCharges > 0 && <div className="cost-line"><span>Other charges</span><strong>{money(quote.otherCharges)}</strong></div>}{quote.discount > 0 && <div className="cost-line discount"><span>Discount</span><strong>- {money(quote.discount)}</strong></div>}<div className="cost-line"><span>GST ({settings.gstPercent}%)</span><strong>{money(quote.tax)}</strong></div><div className="cost-line total"><span>Grand total</span><strong>{money(quote.total)}</strong></div><p className="summary-note">This is a live working estimate. Confirm it when you are ready for a professional bill and nursery review.</p><button className="btn-primary btn-block" onClick={onConfirm}>Review & generate bill <ArrowRight size={14} /></button></aside> }
function areaFor(plant, quantity) {
  const side = Number.parseFloat(String(plant.spacing).replace(/[^0-9.]/g, '')) || 1
  return Math.round(side * side * quantity).toLocaleString('en-IN')
}

function PlannerPage({ onBack }) {
  useEffect(() => { useStore.getState().setLandAcres(1) }, [])
  return <main className="planner-page-wrap"><div className="planner-page-bar"><div><div className="eyebrow">FIELD LAB / INTERACTIVE</div><h1>1-acre plantation planner</h1></div><button className="btn-quiet" onClick={onBack}><ArrowRight size={14} className="back-arrow" /> Back to workspace</button></div><div className="planner-page"><PlannerWorkspace /></div></main>
}

function BillPage({ state, draft, onConfirm, onNavigate }) {
  const latest = state.bills.filter((bill) => bill.userId === state.currentUser?.id).at(-1)
  const confirmedPlan = latest ? state.plans.find((plan) => plan.id === latest.planId) : null
  const plan = confirmedPlan || draft
  const quote = calculatePlan(plan, state.plants, state.settings)
  const billId = latest?.id || 'ETR-DRAFT'
  const printBill = () => window.print()
  return <PageWrap eyebrow="BILLING / CONFIRMATION" title={<>Your plantation <em>plan.</em></>} intro="A clear final check before this acre moves from screen to soil.">
    {!plan?.items?.length ? <div className="empty-state glass-card"><Receipt size={26} /><h3>No bill yet</h3><p>Build a plant shortlist and confirm the estimate to generate your first bill.</p><button className="btn-primary" onClick={() => onNavigate('catalog')}>Choose plants <ArrowRight size={14} /></button></div> : <><div className="bill-paper"><div className="bill-head"><div><div className="bill-brand"><Leaf size={17} /> ETR NURSERY</div><small>PLANTATION INTELLIGENCE</small></div><div className="bill-meta">BILL {billId}<br />{new Date().toLocaleDateString('en-IN')}<br />STATUS: {latest?.status || 'DRAFT'}</div></div><h1>Plantation plan</h1><p className="bill-intro">Prepared for {state.currentUser?.name} · {state.currentUser?.phone} · Land size: {plan.landAcres || 1} acre</p><table className="bill-table"><thead><tr><th>Plant</th><th>Spacing</th><th>Qty</th><th>Amount</th></tr></thead><tbody>{plan.items.map((item) => { const plant = state.plants.find((entry) => entry.id === item.plantId); return plant ? <tr key={plant.id}><td>{plant.name}</td><td>{plant.spacing}</td><td>{item.quantity}</td><td>{money(plant.price * item.quantity)}</td></tr> : null })}</tbody></table><div className="bill-total-wrap"><div className="bill-totals"><div className="bill-total-line"><span>Plant cost</span><strong>{money(quote.subtotal)}</strong></div><div className="bill-total-line"><span>Services & provisions</span><strong>{money(quote.services + quote.fertilizer + quote.transportation + quote.otherCharges)}</strong></div><div className="bill-total-line"><span>GST ({state.settings.gstPercent}%)</span><strong>{money(quote.tax)}</strong></div><div className="bill-total-line grand"><span>Grand total</span><strong>{money(quote.total)}</strong></div></div></div><div className="bill-footer"><span>ETR NURSERY · GROW WITH CLARITY</span><span>{state.content.contact}</span></div></div><div className="bill-actions">{!latest && <button className="btn-primary" onClick={onConfirm}>Confirm & generate bill <Check size={14} /></button>}{latest && <button className="btn-primary" onClick={printBill}><Download size={14} /> Print / save as PDF</button>}<button className="btn-quiet" onClick={() => onNavigate('plan')}>Edit estimate</button></div></>}
  </PageWrap>
}

function AdminPage({ state, activeTab, setActiveTab, onUpdatePlant, onAddPlant, onRemovePlant, onUpdateSettings, onUpdateContent, onUpdateStatus }) {
  const [newPlant, setNewPlant] = useState({ name: '', category: 'Fruit plants', price: 100, spacing: '12 × 12 ft', plantsPerAcre: 300, fertilizer: '6 kg / year', maintenance: 'Moderate', growth: '3–4 years', description: 'A considered nursery selection for plantation plans.', color: '#98bf77' })
  const [editingPlant, setEditingPlant] = useState(null)
  const [settings, setSettings] = useState(state.settings)
  const [content, setContent] = useState(state.content)
  const tab = activeTab.replace('admin-', '')
  const title = tab === 'admin' ? 'Command center' : tab === 'plants' ? 'Plants & categories' : tab === 'pricing' ? 'Pricing & taxes' : tab === 'content' ? 'Website content' : tab === 'users' ? 'Users' : 'Plans & bills'
  return <PageWrap eyebrow="ETR NURSERY / ADMINISTRATION" title={<>{title.split(' ')[0]} <em>{title.split(' ').slice(1).join(' ')}</em></>} intro="A private operating layer for keeping the customer experience accurate and current.">
    <div className="admin-tabs">{[['admin', 'Overview'], ['admin-plants', 'Plants'], ['admin-pricing', 'Pricing & taxes'], ['admin-content', 'Website content'], ['admin-users', 'Users'], ['admin-orders', 'Plans & bills']].map(([id, label]) => <button key={id} className={`admin-tab ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>{label}</button>)}</div>
    {tab === 'admin' && <AdminOverview state={state} setActiveTab={setActiveTab} />}
    {tab === 'plants' && <div className="admin-grid"><section className="glass-card admin-panel"><h3>Plant catalog</h3><div className="admin-list">{state.plants.map((plant) => <div key={plant.id}><div className="admin-list-row admin-plant-row"><div><strong>{plant.name}</strong><span>{plant.category} · {money(plant.price)} · {plant.spacing}</span></div><div className="row-actions"><button className="icon-button" title="Edit plant" onClick={() => setEditingPlant({ ...plant })}><Pencil size={14} /></button><button className="icon-button danger-icon" onClick={() => onRemovePlant(plant.id)}><Trash2 size={14} /></button></div></div>{editingPlant?.id === plant.id && <div className="admin-inline-editor"><div className="admin-form-grid"><AdminField label="Name" value={editingPlant.name} onChange={(value) => setEditingPlant({ ...editingPlant, name: value })} /><AdminField label="Category" value={editingPlant.category} onChange={(value) => setEditingPlant({ ...editingPlant, category: value })} /><AdminField label="Price (₹)" value={editingPlant.price} type="number" onChange={(value) => setEditingPlant({ ...editingPlant, price: value })} /><AdminField label="Spacing" value={editingPlant.spacing} onChange={(value) => setEditingPlant({ ...editingPlant, spacing: value })} /><AdminField label="Plants per acre" value={editingPlant.plantsPerAcre} type="number" onChange={(value) => setEditingPlant({ ...editingPlant, plantsPerAcre: value })} /><AdminField label="Growth" value={editingPlant.growth} onChange={(value) => setEditingPlant({ ...editingPlant, growth: value })} /><AdminField label="Fertilizer" value={editingPlant.fertilizer} onChange={(value) => setEditingPlant({ ...editingPlant, fertilizer: value })} /><AdminField label="Maintenance" value={editingPlant.maintenance} onChange={(value) => setEditingPlant({ ...editingPlant, maintenance: value })} /><AdminField label="Description" value={editingPlant.description} full textarea onChange={(value) => setEditingPlant({ ...editingPlant, description: value })} /></div><div className="admin-actions"><button className="btn-quiet" onClick={() => setEditingPlant(null)}>Cancel</button><button className="btn-primary" onClick={() => { onUpdatePlant(plant.id, editingPlant); setEditingPlant(null) }}><Save size={14} /> Save plant</button></div></div>}</div>)}</div></section><section className="glass-card admin-panel"><h3>Add a plant</h3><div className="admin-form-grid"><AdminField label="Name" value={newPlant.name} onChange={(value) => setNewPlant({ ...newPlant, name: value })} /><AdminField label="Category" value={newPlant.category} onChange={(value) => setNewPlant({ ...newPlant, category: value })} /><AdminField label="Price (₹)" value={newPlant.price} type="number" onChange={(value) => setNewPlant({ ...newPlant, price: value })} /><AdminField label="Spacing" value={newPlant.spacing} onChange={(value) => setNewPlant({ ...newPlant, spacing: value })} /><AdminField label="Plants per acre" value={newPlant.plantsPerAcre} type="number" onChange={(value) => setNewPlant({ ...newPlant, plantsPerAcre: value })} /><AdminField label="Growth" value={newPlant.growth} onChange={(value) => setNewPlant({ ...newPlant, growth: value })} /><AdminField label="Description" value={newPlant.description} full onChange={(value) => setNewPlant({ ...newPlant, description: value })} /></div><div className="admin-actions"><button className="btn-primary" onClick={() => { if (newPlant.name.trim()) { onAddPlant(newPlant); setNewPlant({ ...newPlant, name: '' }) } }}>Add to catalog <Plus size={14} /></button></div></section></div>}
    {tab === 'pricing' && <section className="glass-card admin-panel narrow-panel"><div className="section-intro"><h3>Commercial settings</h3><p>These values flow into every live estimate immediately.</p></div><div className="admin-form-grid"><AdminField label="GST / tax %" value={settings.gstPercent} type="number" onChange={(value) => setSettings({ ...settings, gstPercent: value })} /><AdminField label="Plantation services (₹)" value={settings.serviceCharge} type="number" onChange={(value) => setSettings({ ...settings, serviceCharge: value })} /><AdminField label="Transportation (₹)" value={settings.transportation} type="number" onChange={(value) => setSettings({ ...settings, transportation: value })} /><AdminField label="Other charges (₹)" value={settings.otherCharges} type="number" onChange={(value) => setSettings({ ...settings, otherCharges: value })} /><AdminField label="Discount (₹)" value={settings.discount} type="number" onChange={(value) => setSettings({ ...settings, discount: value })} /></div><div className="admin-actions"><button className="btn-primary" onClick={() => onUpdateSettings(settings)}><Check size={14} /> Save pricing rules</button></div></section>}
    {tab === 'content' && <section className="glass-card admin-panel narrow-panel"><div className="section-intro"><h3>Website language</h3><p>Keep the public ETR story aligned with the business.</p></div><div className="admin-form-grid"><AdminField label="Hero title" value={content.heroTitle} full onChange={(value) => setContent({ ...content, heroTitle: value })} /><AdminField label="Hero subtitle" value={content.heroSubtitle} full onChange={(value) => setContent({ ...content, heroSubtitle: value })} /><AdminField label="Nursery description" value={content.description} full textarea onChange={(value) => setContent({ ...content, description: value })} /><AdminField label="Services" value={content.services} full textarea onChange={(value) => setContent({ ...content, services: value })} /><AdminField label="Contact information" value={content.contact} full onChange={(value) => setContent({ ...content, contact: value })} /></div><div className="admin-actions"><button className="btn-primary" onClick={() => onUpdateContent(content)}><Check size={14} /> Save website content</button></div></section>}
    {tab === 'users' && <section className="glass-card admin-panel"><h3>Registered users</h3><DataTable headers={['Name', 'Phone', 'Registered', 'Plans']} rows={state.users.map((user) => [<strong>{user.name}</strong>, user.phone, new Date(user.registeredAt).toLocaleDateString('en-IN'), state.plans.filter((plan) => plan.userId === user.id && plan.status !== 'draft').length])} empty="No user workspaces yet." /></section>}
    {tab === 'orders' && <section className="glass-card admin-panel"><h3>Plans & bills</h3><DataTable headers={['Bill', 'Customer', 'Amount', 'Status', 'Update']} rows={state.bills.map((bill) => { const user = state.users.find((entry) => entry.id === bill.userId); return [bill.id, user?.name || 'Guest', money(bill.amount), <span className={`status-tag ${bill.status === 'review' ? 'pending' : ''}`}>{bill.status}</span>, <select className="status-select" value={bill.status} onChange={(event) => onUpdateStatus(bill.id, event.target.value)}><option value="review">Review</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option></select>] })} empty="Confirmed bills will appear here." /></section>}
  </PageWrap>
}

function AdminOverview({ state, setActiveTab }) {
  const revenue = state.bills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0)
  return <><div className="metric-grid"><Metric label="Plant catalog" value={String(state.plants.length)} note="Live selections" /><Metric label="Registered users" value={String(state.users.length)} note="Customer workspaces" /><Metric label="Bills generated" value={String(state.bills.length)} note="Across all plans" /><Metric label="Gross estimate" value={money(revenue)} note="Confirmed value" /></div><div className="admin-overview-grid"><div className="glass-card admin-panel"><div className="card-kicker">OPERATING LAYER</div><h3>What needs attention</h3><div className="admin-list"><button className="admin-list-row clickable" onClick={() => setActiveTab('admin-plants')}><span><strong>Review catalog pricing</strong><small>Keep live nursery prices accurate</small></span><ChevronRight size={15} /></button><button className="admin-list-row clickable" onClick={() => setActiveTab('admin-orders')}><span><strong>Review incoming plans</strong><small>{state.bills.filter((bill) => bill.status === 'review').length} bills waiting for a response</small></span><ChevronRight size={15} /></button><button className="admin-list-row clickable" onClick={() => setActiveTab('admin-content')}><span><strong>Refresh the public story</strong><small>Edit hero, services, and contact details</small></span><ChevronRight size={15} /></button></div></div><div className="glass-card admin-panel admin-signal"><Shield size={25} /><div className="eyebrow">CONTROL SIGNAL</div><h3>All systems are local and live.</h3><p>Changes to the catalog and pricing rules are reflected in the customer estimate immediately in this prototype.</p></div></div></>
}

function AdminField({ label, value, onChange, type = 'text', full = false, textarea = false }) { const Tag = textarea ? 'textarea' : 'input'; return <label className={`admin-label ${full ? 'full' : ''}`}>{label}<Tag type={textarea ? undefined : type} value={value} onChange={(event) => onChange(event.target.value)} /></label> }
function DataTable({ headers, rows, empty }) { return rows.length ? <div className="table-scroll"><table className="data-table"><thead><tr>{headers.map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div> : <div className="empty-table">{empty}</div> }

export default function App() {
  const store = useETRStore()
  const [view, setView] = useState(store.currentUser ? 'dashboard' : store.introSeen ? 'landing' : 'intro')
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminTab, setAdminTab] = useState('admin')

  useEffect(() => { if (store.currentUser && view === 'landing') setView('dashboard') }, [store.currentUser, view])
  const draft = store.draftPlan
  const navigate = (next) => {
    if (next === 'user-auth' || next === 'admin-auth' || next === 'catalog-public') setView(next)
    else if (next === 'admin' || next.startsWith('admin-')) { setIsAdmin(true); setAdminTab(next); setView('admin') }
    else setView(next)
  }
  const userLogin = (name, phone) => { store.loginUser(name, phone); setView('dashboard') }
  const adminLogin = (username, password) => { const valid = store.adminLogin(username, password); if (valid) { setIsAdmin(true); setAdminTab('admin'); setView('admin') } return valid }
  const logout = () => { store.logout(); setIsAdmin(false); setView('landing') }
  const confirmPlan = () => { const quote = calculatePlan(draft, store.plants, store.settings); store.savePlan({ ...quote, items: draft.items, landAcres: 1 }); setView('bill') }

  if (view === 'intro') return <Intro onSkip={() => { store.patch({ introSeen: true }); setView('landing') }} />
  if (view === 'landing') return <Landing content={store.content} onNavigate={navigate} />
  if (view === 'user-auth') return <AuthPage mode="user" onBack={() => setView('landing')} onUserLogin={userLogin} onAdminLogin={adminLogin} />
  if (view === 'admin-auth') return <AuthPage mode="admin" onBack={(next) => next ? setView(next) : setView('landing')} onUserLogin={userLogin} onAdminLogin={adminLogin} />
  if (view === 'catalog-public') return <><LandingPublicBar onBack={() => setView('landing')} onLogin={() => setView('user-auth')} /><CatalogPage state={store} onAdd={store.addToPlan} onNeedLogin={() => setView('user-auth')} onBack={() => setView('landing')} publicView /></>
  if (isAdmin && view === 'admin') return <Shell admin active={adminTab} onNavigate={(next) => { setAdminTab(next); setView('admin') }} onLogout={logout}>{<AdminPage state={store} activeTab={adminTab} setActiveTab={setAdminTab} onUpdatePlant={store.updatePlant} onAddPlant={store.addPlant} onRemovePlant={store.removePlant} onUpdateSettings={store.updateSettings} onUpdateContent={store.updateContent} onUpdateStatus={(id, status) => store.patch((current) => ({ bills: current.bills.map((bill) => bill.id === id ? { ...bill, status } : bill), plans: current.plans.map((plan) => { const bill = current.bills.find((entry) => entry.id === id); return bill && plan.id === bill.planId ? { ...plan, status } : plan }) }))} />}</Shell>
  if (!store.currentUser) return <AuthPage mode="user" onBack={() => setView('landing')} onUserLogin={userLogin} onAdminLogin={adminLogin} />
  let page = null
  if (view === 'dashboard') page = <Dashboard user={store.currentUser} state={store} onNavigate={navigate} />
  if (view === 'planner') page = <PlannerPage onBack={() => setView('dashboard')} />
  if (view === 'catalog') page = <CatalogPage state={store} onAdd={store.addToPlan} onNeedLogin={() => setView('user-auth')} onBack={() => setView('dashboard')} />
  if (view === 'plan') page = <PlanPage state={store} draft={draft} onUpdateItems={store.updatePlanItems} onNavigate={navigate} onConfirm={confirmPlan} />
  if (view === 'bill') page = <BillPage state={store} draft={draft} onConfirm={confirmPlan} onNavigate={navigate} />
  return <Shell user={store.currentUser} active={view} onNavigate={navigate} onLogout={logout}>{page}</Shell>
}

function LandingPublicBar({ onBack, onLogin }) { return <div className="public-bar"><button className="back-link" onClick={onBack}><ArrowRight size={14} className="back-arrow" /> Back to ETR</button><BrandMark /><button className="btn-primary" onClick={onLogin}>Sign in <ArrowRight size={14} /></button></div> }