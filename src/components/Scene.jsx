import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import Planet from './Planet.jsx'
import Moon from './Moon.jsx'
import StarsBg from './StarsBg.jsx'

function ThreeScene({ reduced }) {
  const group = useRef()
  const target = useRef([0, 0])

  const handlePointerMove = (e) => {
    target.current = [
      (e.clientX / window.innerWidth - 0.5) * 0.4,
      -(e.clientY / window.innerHeight - 0.5) * 0.4,
    ]
  }

  useFrame(() => {
    group.current.position.x += (target.current[0] - group.current.position.x) * 0.1
    group.current.position.y += (target.current[1] - group.current.position.y) * 0.1
  })

  return (
    <Canvas
      className="hero-canvas"
      camera={{ fov: 45, position: [0, 0, 6] }}
      dpr={[1, 2]}
      onPointerMove={handlePointerMove}
      gl={{ powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#0b1220')
        gl.outputColorSpace = THREE.SRGBColorSpace
      }}
    >
      <group ref={group}>
        <ambientLight intensity={0.25} />
        <hemisphereLight intensity={0.2} />
        <pointLight position={[0.8, 0.6, 2]} />
        <StarsBg />
        <Planet paused={reduced} />
        <Moon paused={reduced} />
      </group>
      <EffectComposer>
        <Bloom intensity={0.2} luminanceThreshold={0.6} />
      </EffectComposer>
    </Canvas>
  )
}

function Fallback() {
  return (
    <div className="fallback-container">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="64" fill="#7b57c8" />
        <circle cx="100" cy="100" r="68" fill="none" stroke="#0e1320" strokeWidth="6" />
        <g transform="translate(100 100)" className="fallback-moon">
          <circle cx="0" cy="0" r="14" fill="#cfd6de" />
        </g>
      </svg>
    </div>
  )
}

export default function Scene() {
  const [webgl, setWebgl] = useState(true)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setWebgl(false)
    } catch {
      setWebgl(false)
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const scrollToContent = () =>
    document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {webgl ? <ThreeScene reduced={reduced} /> : <Fallback />}
      <button
        aria-label="Scroll"
        onClick={scrollToContent}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce"
        style={{ animationDuration: '2s' }}
      >
        ▼
      </button>
    </section>
  )
}
