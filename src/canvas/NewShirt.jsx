import React, { useState } from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import state from '../store';
import { AnimatePresence, motion } from 'framer-motion';

const NewShirt = ({ color, id, imgDecal, textureType }) => {
  const [shirtColor, setShirtColor] = useState(color); // Local state for shirt color

  const snap = useSnapshot(state);
  console.log("NewShirt - Color:", shirtColor);

  const { nodes, materials } = useGLTF('/shirt_baked.glb');

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  
  const savedImgTexture = imgDecal ? useTexture(imgDecal) : null; // Check if imgDecal is defined

  useFrame((state, delta) => {
    easing.dampC(materials.lambert1.color, shirtColor, 0.25, delta); // Use local shirtColor state
  });

  // Generate a unique key based on index
  const uniqueKey = `shirt-${id}`;
  console.log("New shirt color:", shirtColor);
  console.log(uniqueKey);

  const renderShirt = () => {
    switch (textureType) {
      case 'fullTexture':
        return (
          <mesh
            castShadow
            geometry={nodes.T_Shirt_male.geometry}
            material={materials.lambert1}
            material-roughness={1}
            dispose={null}
            key={`fullShirt-${id}`} // Use a unique key for full texture shirts
          >
            {!imgDecal && (
              <Decal
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                scale={1}
                map={fullTexture}
                anisotropy={16}
                depthTest={false}
                depthWrite={true}
              />
            )}
            {savedImgTexture && (
              <Decal
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                scale={1}
                map={savedImgTexture}
                anisotropy={16}
                depthTest={false}
                depthWrite={true}
              />
            )}
          </mesh>
        );
      case 'logoTexture':
        return (
          <mesh
            castShadow
            geometry={nodes.T_Shirt_male.geometry}
            material={materials.lambert1}
            material-roughness={1}
            dispose={null}
            key={`logoShirt-${id}`} // Use a unique key for logo texture shirts
          >
            {!imgDecal && (
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
            {savedImgTexture && (
              <Decal
              position={[0, 0.04, 0.15]}
              rotation={[0, 0, 0]}
                scale={0.15}
                map={savedImgTexture}
                anisotropy={16}
                depthTest={false}
                depthWrite={true}
              />
            )}
          </mesh>
        );
      default:
        return null; // Handle any other cases if needed
    }
  };
  
  return renderShirt();
};

export default NewShirt;

{/*
switch (textureType) {
      case 'fullTexture':
        return (
          <mesh
            castShadow
            geometry={nodes.T_Shirt_male.geometry}
            material={materials.lambert1}
            material-roughness={1}
            dispose={null}
            key={`shirt-${id}`} // Use a unique key based on the design ID
          >
            {!imgDecal && <Decal 
                            position={[0, 0, 0]} 
                            rotation={[0, 0, 0]} 
                            scale={1} 
                            map={fullTexture} 
                            anisotropy={16}
                            depthTest={false}
                            depthWrite={true}/>}
            {savedImgTexture && (
              <Decal
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                scale={1}
                map={savedImgTexture}
                anisotropy={16}
                depthTest={false}
                depthWrite={true}
              />
            )}
          </mesh>
        );
      case 'logoTexture':
        return (
          <mesh
            castShadow
            geometry={nodes.T_Shirt_male.geometry}
            material={materials.lambert1}
            material-roughness={1}
            dispose={null}
            key={`shirt-${id}`} // Use a unique key based on the design ID
          >
            {!imgDecal && <Decal 
                              position={[0, 0.04, 0.15]} 
                              rotation={[0, 0, 0]} 
                              scale={0.15} 
                              map={logoTexture}
                              anisotropy={16}
                              depthTest={false}
                            depthWrite={true} />}
            {savedImgTexture && (
              <Decal
                position={[0, 0.04, 0.15]}
                rotation={[0, 0, 0]}
                scale={0.15}
                map={savedImgTexture}
                anisotropy={16}
                depthTest={false}
                depthWrite={true}
              />
            )}
          </mesh>
        );
    }
  };

  return renderShirt();
}; */}