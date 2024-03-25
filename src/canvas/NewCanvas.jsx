import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';
import CameraRig from './CameraRig';
import NewShirt from './NewShirt';
import { AnimatePresence } from 'framer-motion';

const NewCanvas = ({color,id, savedDesign }) => {
  
  const [hdrFileData, setHdrFileData] = useState(null);
 

  useEffect(() => {
    const hdrFilePath = '/hdr/potsdamer_platz_1k.hdr';

    fetch(hdrFilePath)
      .then((response) => response.blob())
      .then((hdrBlob) => {
        setHdrFileData(URL.createObjectURL(hdrBlob));
      })
      .catch((error) => {
        console.error('Error fetching HDR file:', error);
      });

    return () => {
      if (hdrFileData) {
        URL.revokeObjectURL(hdrFileData);
      }
    };
  }, []);



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
        <Center>
          <AnimatePresence>
              <NewShirt color={color}
              id={id}
              savedDesign={savedDesign}
            />
           </AnimatePresence>
          
        </Center>
      </CameraRig>
    </Canvas>
  );
};

export default NewCanvas;
