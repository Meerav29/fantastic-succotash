import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Planet({ paused }) {
  const planet = useRef()

  useFrame((_, delta) => {
    if (!paused) planet.current.rotation.y += 0.02 * delta
  })

  return (
    <group>
      <mesh ref={planet}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial
          color="#7b57c8"
          metalness={0.2}
          roughness={0.5}
          emissive="#2a1f55"
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.78, 64]} />
        <meshStandardMaterial color="#0e1320" side={2} />
      </mesh>
    </group>
  )
}
