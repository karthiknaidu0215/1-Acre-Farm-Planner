import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sky, Environment, ContactShadows } from '@react-three/drei'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Ground from './components/Ground'
import PlantModels from './components/PlantModels'
import Infrastructure from './components/Infrastructure'
import Stats from './components/Stats'
import ObjectPropertiesPanel from './components/ObjectPropertiesPanel'
import { useStore } from './store'

function WebGLFallback() {
  return (
    <div className="webgl-fallback" role="status">
      <div className="webgl-fallback-card">
        <span className="webgl-fallback-kicker">3D preview unavailable</span>
        <h2>Open this planner in a WebGL-enabled browser</h2>
        <p>The planning controls are ready, but this preview environment cannot start the 3D renderer.</p>
      </div>
    </div>
  )
}

export default function PlannerWorkspace() {
  const { draggingPlantId, draggingInfraId, activeDrawTool, manualPlacementZoneId, selectedInfraId, showStats } = useStore()
  const [webglAvailable] = useState(() => {
    try {
      const canvas = document.createElement('canvas')
      return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
    } catch {
      return false
    }
  })

  let helperText = ''
  if (activeDrawTool === 'Road') helperText = 'Road Mode — Click and drag on the farm to draw a road'
  else if (manualPlacementZoneId === 'border-zone') helperText = 'Border Plant Mode — Click on the border strip to place a plant'
  else if (manualPlacementZoneId) helperText = 'Manual Placement — Click inside the crop zone to place'

  return (
    <div className="app-container">
      {helperText && <div className="context-helper">{helperText}</div>}
      <Sidebar />
      <div
        className="canvas-container"
        style={{ marginRight: selectedInfraId ? '280px' : '0', transition: 'margin-right 0.2s ease' }}
      >
        {showStats && <Stats />}
        {webglAvailable ? (
          <Canvas shadows fallback={<WebGLFallback />}>
            <PerspectiveCamera makeDefault position={[0, 600, 750]} fov={55} far={5000} />
            <OrbitControls
              makeDefault
              maxPolarAngle={Math.PI / 2 - 0.05}
              maxDistance={2500}
              enabled={!draggingPlantId && !draggingInfraId}
            />
            <Sky sunPosition={[500, 400, 500]} turbidity={0.3} rayleigh={0.5} />
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[500, 600, 300]}
              intensity={1.5}
              castShadow
              shadow-mapSize={[4096, 4096]}
              shadow-camera-left={-600}
              shadow-camera-right={600}
              shadow-camera-top={600}
              shadow-camera-bottom={-600}
            />
            <ContactShadows resolution={1024} scale={1200} blur={2} opacity={0.4} far={40} color="#000000" />
            <Ground />
            <Infrastructure />
            <PlantModels />
          </Canvas>
        ) : (
          <WebGLFallback />
        )}
        <ObjectPropertiesPanel />
      </div>
    </div>
  )
}