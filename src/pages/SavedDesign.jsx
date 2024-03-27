import React, { useEffect, useState } from 'react';
import { CustomButton } from '../components';
import NewCanvas from '../canvas/NewCanvas';
import { useSnapshot } from 'valtio';
import state from '../store';
import NewShirt from '../canvas/NewShirt';

const SavedDesign = ({ savedDesignString, handleGoBack, color, imgDecal }) => {
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(0); // State to track the selected design index
  const [refreshKey, setRefreshKey] = useState(0)
  const snap = useSnapshot(state);

  useEffect(() => {
    if (savedDesignString) {
      const parsedDesigns = JSON.parse(savedDesignString).map((design, index) => ({
        ...design,
        id: index // Generate a unique ID for each design
      }));
      state.savedDesign = parsedDesigns;
    }
  }, [savedDesignString]);

  const handleDeleteDesign = (id) => {
    // Filter out the design with the specified id
    const updatedDesigns = state.savedDesign.filter((design) => design.id !== id);
    state.savedDesign = updatedDesigns; // Update the state with the updated designs

    // Update local storage with the updated designs
    localStorage.setItem('CanvasState', JSON.stringify(updatedDesigns));

    //call refresh key
    setRefreshKey((prevKey) => prevKey +1)
  };

  const handleShowDesign = (index) => {
    setSelectedDesignIndex(index);
  };

  return (
    <div key={refreshKey} style={{ marginTop: '4rem' }}>
      <h2>Saved Design Details</h2>
      {state.savedDesign && state.savedDesign.length > 0 ? (
        state.savedDesign.map((savedDesign, index) => (
          <div key={savedDesign.id}>
            <p>Shirt Color: {savedDesign.color}</p>
            <p>File Chosen: {savedDesign.file}</p>+
            <CustomButton
              type="filled"
              title="Delete"
              handleClick={() => handleDeleteDesign(savedDesign.id)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
            <CustomButton
              type="filled"
              title={`Show Design ${index + 1}`}
              handleClick={() => handleShowDesign(index)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
            
          </div>
        ))
      ) : (
        <p>No saved designs found.</p>
      )}
      <NewCanvas color={state.savedDesign[selectedDesignIndex]?.color}
          imgDecal={state.savedDesign[selectedDesignIndex]?.imageData}
        id={state.savedDesign[selectedDesignIndex]?.id}
        key={state.savedDesign[selectedDesignIndex]?.id} /> {/* Add key prop */}
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
