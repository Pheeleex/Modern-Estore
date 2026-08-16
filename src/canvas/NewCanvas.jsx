import { Canvas } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import CameraRig from './CameraRig';
import NewShirt from './NewShirt';

const NewCanvas = ({ color, id, imgDecal, textureType }) => {
  return (
    <div className="saved-canvas">
      <Canvas
        shadows
        camera={{ position: [0, 0, 0], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
        className="custom-canvas" // Optional class name for additional styling
      >
        <ambientLight intensity={0.5} />
        <CameraRig>
          <Center>
            <NewShirt
              color={color}
              id={id}
              textureType={textureType}
              imgDecal={imgDecal}
            />
          </Center>
        </CameraRig>
      </Canvas>
    </div>
  );
};

export default NewCanvas;
