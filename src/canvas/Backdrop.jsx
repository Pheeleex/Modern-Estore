import React, { useEffect, useRef } from 'react'
import {easing} from 'maath'
import { useFrame } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei'



const Backdrop = () => {
    const shadows = useRef()

  return (
    <AccumulativeShadows
    ref={shadows}
    temporal
    frames={30} // Reduce frames for smoother performance on mobile
    alphaTest={0.9}
    scale={5} // Adjust scale for better performance
    rotation={[Math.PI / 2, 0, 0]}
    position={[0, 0, -0.14]}
>
    <RandomizedLight
        amount={2} // Reduce the number of lights
        radius={5}
        intensity={0.5} // Lower intensity for better performance
        ambient={0.1} // Lower ambient for better performance
        position={[5, 5, -10]}
    />
    <RandomizedLight
        amount={2} // Reduce the number of lights
        radius={5}
        intensity={0.5} // Lower intensity for better performance
        ambient={0.1} // Lower ambient for better performance
        position={[-5, 5, -9]}
    />
</AccumulativeShadows>
  )
}

export default Backdrop