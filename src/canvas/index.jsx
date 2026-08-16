import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber'
import { Center } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import Shirt from './Shirt';
import CameraRig from './CameraRig';
import state from '../store';
import Loader from '../components/Loader';

const CanvasModel = () => {
  const snap = useSnapshot(state);
  const color =  snap.color;

  return (
    <Canvas
    shadows
    camera={{ position: [0, 0, 0], fov: 25 }}
    gl={{ preserveDrawingBuffer: true }}
    className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <CameraRig>
        <Center>
        <Suspense fallback={<Loader />}>
          <Shirt color={color} />
        </Suspense>
        </Center>
      </CameraRig>
    </Canvas>
  )
}

export default CanvasModel
