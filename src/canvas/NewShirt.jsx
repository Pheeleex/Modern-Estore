import React from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import statte from '../assets/newStore'
import state from '../store';

const NewShirt = ({color, id, savedDesign, colors}) => {
    const snap = useSnapshot(state)
    console.log("NewShirt - Color:", color);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  useFrame((statte, delta) => {
    easing.dampC(materials.lambert1.color, color, 0.25, delta);
  });
  
  // Generate a unique key based on index
  const uniqueKey = `shirt-${id}`;
  console.log("New shirt color:", color)
  console.log(uniqueKey)


  return (
    
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
       key={uniqueKey}
      >
        {snap.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {snap.isLogoTexture && (
          <Decal 
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh> 
    
  )
}

export default NewShirt