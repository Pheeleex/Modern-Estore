import React, { useEffect, useState } from 'react';
import { CustomButton } from '../components';
import NewCanvas from '../canvas/NewCanvas';
import { useSnapshot } from 'valtio';
import state from '../store';

const SavedDesign = ({ savedDesignString, handleGoBack }) => {
  const [colors, setColors] = useState([])
  const snap = useSnapshot(state)

  
  useEffect(() => {
    if (savedDesignString) {
      const parsedDesigns = JSON.parse(savedDesignString).map((design, index) => ({
        ...design,
        id: index // Generate a unique ID for each design
      }));
      state.savedDesign = parsedDesigns

      const extractedColors = parsedDesigns.map((design) =>  (design.color))
      setColors(extractedColors)
    }
  }, [savedDesignString]);

  
  const handleDeleteDesign = (id) => {
    // Filter out the design with the specified id
    const updatedDesigns = state.savedDesign.filter((design) => design.id !== id);
    state.savedDesign = updatedDesigns; // Update the state with the updated designs

    // Update local storage with the updated designs
    localStorage.setItem('CanvasState', JSON.stringify(updatedDesigns));
  };


  
  return (
    <div style={{ marginTop: '4rem' }}>
      <h2>Saved Design Details</h2>
      { state.savedDesign && state.savedDesign.map((savedDesign) => (
        <div key={savedDesign.id}>
          <p>Shirt Color: {savedDesign.color}</p>
          <p>File Chosen: {savedDesign.file}</p>
          <NewCanvas
            savedDesign={savedDesign}
            id={savedDesign.id}
            color={savedDesign.color}
            colors={colors} />
            <CustomButton 
            type="filled"
            title="Delete"
            handleClick={() => handleDeleteDesign(savedDesign.id)}
            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
          />
            <div style={{padding: "1rem"}}></div>
        </div>
      ))}
      <CustomButton 
        type="filled"
        title="GoBack"
        handleClick={handleGoBack}
        customStyles="w-fit px-4 py-2.5 font-bold text-sm"
      />
    </div>
  );
};

export default SavedDesign;

