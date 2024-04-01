import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';
import CameraRig from './CameraRig';
import NewShirt from './NewShirt';
import { AnimatePresence } from 'framer-motion';

const NewCanvas = ({ color, id, savedDesign, imgDecal }) => {
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
    <div style={{ width: '50%', height: '50vh', margin: '0px auto' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 0], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
        className="custom-canvas" // Optional class name for additional styling
      >
        <ambientLight intensity={0.5} />
        {hdrFileData && <Environment preset="city" files={hdrFileData} />}
        <CameraRig>
          <Center>
            <AnimatePresence>
              <NewShirt color={color} id={id} savedDesign={savedDesign} imgDecal={imgDecal} />
            </AnimatePresence>
          </Center>
        </CameraRig>
      </Canvas>
    </div>
  );
};

export default NewCanvas;
