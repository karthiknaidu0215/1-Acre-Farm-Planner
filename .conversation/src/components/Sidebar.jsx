import { useState, useMemo } from 'react'
import { useStore, isPointInRotatedRect } from '../store'

export default function Sidebar() {
  const { 
    landAcres, 
    borderWidth, setBorderWidth,
    cropZones, addCropZone, updateCropZone, removeCropZone,
    borderZone, updateBorderZone, autoArrangeBorder,
    autoArrangeZone, manualPlacementZoneId, setManualPlacementZoneId,
    measuring, setMeasuring, clearAllPlants, plants,
    activeDrawTool, setActiveDrawTool,
    addInfrastructure, infrastructure, addFullRoad,
    showStats, toggleStats
  } = useStore()
  
  const visiblePlants = useMemo(() => {
    return plants.filter(p => {
      let isRemoved = false;
      for (const inf of infrastructure) {
        if (inf.type === 'Borewell' || inf.type === 'Water Tank') {
          const dist = Math.hypot(p.x - inf.x, p.z - inf.z);
          if (dist <= (inf.radius || inf.width/2)) { isRemoved = true; break; }
        } else {
          if (isPointInRotatedRect(p.x, p.z, inf.x, inf.z, inf.width, inf.length, inf.rotation)) {
            isRemoved = true; break;
          }
        }
      }
      return !isRemoved;
    });
  }, [plants, infrastructure]);
  
  const totalPercentage = cropZones.reduce((s, z) => s + z.percentage, 0);
  const isValidAllocation = totalPercentage === 100;

  const borderPlacedCount = visiblePlants.filter(p => p.zoneId === 'border-zone').length;

  const [infraMenuOpen, setInfraMenuOpen] = useState(true);

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Farm Land Planner</h2>
      
      {/* HIGHLIGHTED STATS TOGGLE */}
      <button 
        onClick={toggleStats}
        style={{
          width: '100%',
          padding: '12px',
          background: showStats ? 'var(--primary)' : 'var(--secondary)',
          color: 'white',
          border: showStats ? '1px solid #059669' : '1px solid var(--border)',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1rem',
          marginBottom: '25px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: showStats ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
          transition: 'all 0.3s'
        }}
      >
        <span>📊 Farm Space Stats</span>
        <span style={{ 
          background: showStats ? 'white' : '#475569', 
          color: showStats ? 'var(--primary)' : 'white',
          padding: '2px 8px', 
          borderRadius: '12px', 
          fontSize: '0.8rem' 
        }}>
          {showStats ? 'ON' : 'OFF'}
        </span>
      </button>
      
      <div className="control-group">
        <h3>1. LAND</h3>
        <div className="input-row">
          <label>Total Land Size (Acres)</label>
          <input type="number" value={landAcres} onChange={e => useStore.getState().setLandAcres(Number(e.target.value))} min="1" max="1000" />
        </div>
        <div className="input-row" style={{ marginTop: '10px' }}>
          <label>Boundary Strip Width (ft)</label>
          <input type="number" value={borderWidth} onChange={e => setBorderWidth(Number(e.target.value))} min="0" />
        </div>
        <div className="input-row" style={{ marginTop: '10px' }}>
          <label>Border Plant Type</label>
          <select value={borderZone.type} onChange={e => updateBorderZone({ type: e.target.value })}>
            <option>Coconut</option><option>Arecanut</option><option>Timber</option>
            <option>Mango</option><option>Guava</option><option>Mosambi</option><option>Banana</option>
          </select>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', marginTop: '10px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Boundary Plants ({borderZone.type}):</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>{borderPlacedCount}</span>
          </div>
        </div>

        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <button className="btn btn-secondary" onClick={autoArrangeBorder}>
            Auto Arrange Border (20 ft)
          </button>
          <button 
            className={`btn ${manualPlacementZoneId === 'border-zone' ? '' : 'btn-secondary'}`} 
            onClick={() => setManualPlacementZoneId(manualPlacementZoneId === 'border-zone' ? null : 'border-zone')}
            style={{ borderColor: manualPlacementZoneId === 'border-zone' ? 'var(--primary)' : '' }}
          >
            {manualPlacementZoneId === 'border-zone' ? 'Cancel Add' : '+ Add Border Plant'}
          </button>
        </div>
      </div>
      
      <div className="control-group">
        <h3>2. CROPS ({totalPercentage}%)</h3>
        {totalPercentage > 100 && (
          <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '10px' }}>Error: Allocation &gt; 100%</div>
        )}
        {totalPercentage < 100 && (
          <div style={{ color: 'var(--warning)', fontSize: '0.85rem', marginBottom: '10px' }}>Warning: {100 - totalPercentage}% unallocated</div>
        )}

        {cropZones.map((zone) => {
          const maxRows = Math.floor(zone.block.length / zone.r2r)
          const plantsPerRow = Math.floor(zone.block.width / zone.p2p)
          const capacity = maxRows * plantsPerRow
          const placedCount = visiblePlants.filter(p => p.zoneId === zone.id).length
          
          return (
            <div key={zone.id} style={{ background: 'var(--bg)', padding: '10px', borderRadius: '6px', marginBottom: '10px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <select value={zone.type} onChange={e => updateCropZone(zone.id, { type: e.target.value })} style={{ flex: 1, marginRight: '10px', fontWeight: 'bold' }}>
                  <option>Mango</option><option>Guava</option><option>Mosambi</option>
                  <option>Banana</option><option>Arecanut</option><option>Coconut</option>
                </select>
                <button onClick={() => removeCropZone(zone.id)} className="btn btn-secondary" style={{ padding: '4px 8px', width: 'auto' }}>X</button>
              </div>
              
              <div className="input-row">
                <label>Allocation (%)</label>
                <input type="number" value={zone.percentage} onChange={e => updateCropZone(zone.id, { percentage: Number(e.target.value) })} min="1" max="100" />
              </div>
              
              <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <div className="input-row" style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', margin: 0 }}>
                  <label style={{fontSize: '0.8rem'}}>Plant Space</label>
                  <input type="number" value={zone.p2p} onChange={e => updateCropZone(zone.id, { p2p: Number(e.target.value) })} min="1" style={{width: '100%', boxSizing: 'border-box'}} />
                </div>
                <div className="input-row" style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', margin: 0 }}>
                  <label style={{fontSize: '0.8rem'}}>Row Space</label>
                  <input type="number" value={zone.r2r} onChange={e => updateCropZone(zone.id, { r2r: Number(e.target.value) })} min="1" style={{width: '100%', boxSizing: 'border-box'}} />
                </div>
              </div>
              
              <div className="input-row">
                <label>Target Plants</label>
                <input type="number" value={zone.targetPlants} onChange={e => updateCropZone(zone.id, { targetPlants: Number(e.target.value) })} min="0" />
              </div>
              
              <div style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'var(--text-muted)' }}>
                Placed: <strong style={{color: 'white'}}>{placedCount}</strong> / {capacity} Max
              </div>
              
              <button className="btn btn-secondary" onClick={() => autoArrangeZone(zone.id)} disabled={!isValidAllocation}>
                Plant Field
              </button>
            </div>
          )
        })}
        
        <button className="btn btn-secondary" onClick={() => addCropZone('Mango')} disabled={totalPercentage >= 100}>
          + Add Crop Zone
        </button>
      </div>

      <div className="control-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid var(--border)', paddingBottom: '5px' }} onClick={() => setInfraMenuOpen(!infraMenuOpen)}>
          <h3 style={{ margin: 0, border: 'none', padding: 0 }}>3. FARM INFRASTRUCTURE</h3>
          <span style={{ color: 'var(--text-muted)' }}>{infraMenuOpen ? '▼' : '▶'}</span>
        </div>
        
        {infraMenuOpen && (
          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={() => addInfrastructure('Gate')}>Gate</button>
              <button className={`btn ${activeDrawTool === 'Road' ? '' : 'btn-secondary'}`} style={{ borderColor: activeDrawTool === 'Road' ? 'var(--primary)' : '' }} onClick={() => setActiveDrawTool(activeDrawTool === 'Road' ? null : 'Road')}>
                {activeDrawTool === 'Road' ? 'Cancel Road' : 'Road'}
              </button>
              <button className="btn btn-secondary" onClick={() => addInfrastructure('Farm House')}>Farm House</button>
              
              <div style={{ gridColumn: 'span 2', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Add: Full-Length Road</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button className="btn btn-secondary" onClick={() => addFullRoad('top')} style={{ fontSize: '0.8rem' }}>Top Edge</button>
                  <button className="btn btn-secondary" onClick={() => addFullRoad('bottom')} style={{ fontSize: '0.8rem' }}>Bottom Edge</button>
                  <button className="btn btn-secondary" onClick={() => addFullRoad('left')} style={{ fontSize: '0.8rem' }}>Left Edge</button>
                  <button className="btn btn-secondary" onClick={() => addFullRoad('right')} style={{ fontSize: '0.8rem' }}>Right Edge</button>
                  <button className="btn btn-secondary" onClick={() => addFullRoad('center-h')} style={{ fontSize: '0.8rem' }}>Center ↔</button>
                  <button className="btn btn-secondary" onClick={() => addFullRoad('center-v')} style={{ fontSize: '0.8rem' }}>Center ↕</button>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => addInfrastructure('Pond')}>Pond</button>
              <button className="btn btn-secondary" onClick={() => addInfrastructure('Borewell')}>Borewell</button>
              <button className="btn btn-secondary" onClick={() => addInfrastructure('Water Tank')}>Water Tank</button>
              <button className="btn btn-secondary" onClick={() => addInfrastructure('Pump Room')}>Pump Room</button>
              <button className="btn btn-secondary" onClick={() => addInfrastructure('Storage Shed')}>Storage Shed</button>
              <button className="btn btn-secondary" style={{ gridColumn: 'span 2' }} onClick={() => addInfrastructure('Custom Obstacle')}>Custom Obstacle</button>
            </div>
          </div>
        )}
      </div>

      <div className="control-group">
        <h3>4. TOOLS</h3>
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <button 
            className={`btn ${measuring ? '' : 'btn-secondary'}`} 
            onClick={() => setMeasuring(!measuring)}
          >
            {measuring ? 'Cancel Measurement' : 'Measure Distance'}
          </button>
          <button className="btn btn-secondary" onClick={clearAllPlants} style={{color: 'var(--danger)', borderColor: 'var(--danger)'}}>
            Clear All Plants
          </button>
        </div>
      </div>
    </div>
  )
}
