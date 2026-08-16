import { easing } from 'maath';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

const NewShirt = ({ color, id, imgDecal, textureType }) => {
  const { nodes, materials } = useGLTF('/shirt_baked.glb');
  const savedImgTexture = useTexture(imgDecal || '/threejs.png');

  useFrame((state, delta) => {
    easing.dampC(materials.lambert1.color, color, 0.25, delta);
  });

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
            key={`fullShirt-${id}`}
          >
            <Decal
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1}
              map={savedImgTexture}
              anisotropy={16}
              depthTest={false}
              depthWrite={true}
            />
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
            key={`logoShirt-${id}`}
          >
            <Decal
              position={[0, 0.04, 0.15]}
              rotation={[0, 0, 0]}
              scale={0.15}
              map={savedImgTexture}
              anisotropy={16}
              depthTest={false}
              depthWrite={true}
            />
          </mesh>
        );
      default:
        return null;
    }
  };
  
  return renderShirt();
};

export default NewShirt;
