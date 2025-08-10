import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Moon({ paused }) {
  const pivot = useRef()

  useFrame((_, delta) => {
    if (!paused) pivot.current.rotation.y += 0.6 * delta
  })

  return (
    <group ref={pivot} name="OrbitPivot" position={[0, 0, 0]}>
      <mesh position={[2.3, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#cfd6de" roughness={0.8} />
      </mesh>
    </group>
  )
}
