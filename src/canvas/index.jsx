import React, {useState, useEffect} from 'react';
import { Canvas } from '@react-three/fiber'
import { Environment, Center } from '@react-three/drei';

import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

const CanvasModel = () => {

  const [hdrFileData, setHdrFileData] = useState(null);

  useEffect(() => {
    const hdrFilePath = '/hdr/potsdamer_platz_1k.hdr'; // Correct relative path to HDR file


    fetch(hdrFilePath)
      .then(response => response.blob())
      .then(hdrBlob => {
        setHdrFileData(URL.createObjectURL(hdrBlob));
      })
      .catch(error => {
        console.error('Error fetching HDR file:', error);
      });
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
       {/* <Backdrop /> */}
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  )
}

export default CanvasModel