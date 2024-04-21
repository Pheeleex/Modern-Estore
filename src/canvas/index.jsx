import React, {useState, useEffect, Suspense} from 'react';
import { Canvas } from '@react-three/fiber'
import { Environment, Center, OrbitControls } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';
import state from '../store';
import Loader from '../components/Loader';

const CanvasModel = () => {
  const snap = useSnapshot(state);
  const [hdrFileData, setHdrFileData] = useState(null);

  const color =  snap.color;
  console.log("canvas-shirt-color", color);
 

  useEffect(() => {
    const hdrFilePath = '../../HDR/potsdamer_platz_1k.ekr'; // Correct relative path to HDR file

    fetch(hdrFilePath)
      .then(response => response.blob())
      .then(hdrBlob => {
        setHdrFileData(URL.createObjectURL(hdrBlob));
      })
      .catch(error => {
        console.error('Error fetching HDR file:', error);
      });

    // Cleanup function to revoke the object URL
    return () => {
      if (hdrFileData) {
        URL.revokeObjectURL(hdrFileData);
      }
    };
  }, []); // Removed hdrFileData from the dependency array

  return (
    <Canvas
    shadows
    camera={{ position: [0, 0, 0], fov: 25 }}
    gl={{ preserveDrawingBuffer: true }}
    className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      {hdrFileData && <Environment preset="city" files={hdrFileData} />}

      <CameraRig>
     {/* <Backdrop /> */}
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