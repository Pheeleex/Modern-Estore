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
        id: index //Generate a unique ID for each design
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

  const handleNextDesign = () => {
    setSelectedDesignIndex((prevIndex) => Math.min(prevIndex + 1, state.savedDesign.length - 1));
  };

  const handlePreviousDesign = () => {
    setSelectedDesignIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div key={refreshKey} className='mt-20 mx-10 lg:mx-20  mb-20'>
      <h2>Saved Design Details</h2>
      <div>
        {state.savedDesign && state.savedDesign.length > 0 ? (
          <div key={state.savedDesign[selectedDesignIndex].id} className='flex flex-col justify-between md:flex-row align-center'>
            <p>Shirt Color: {state.savedDesign[selectedDesignIndex].color}</p>
            <p>File Chosen: {state.savedDesign[selectedDesignIndex].file}</p>
            <CustomButton
              type="outline"
              title="Delete"
              handleClick={() => handleDeleteDesign(state.savedDesign[selectedDesignIndex].id)}
              customStyles="flex-grow-0 w-3/4 px-4 py-2.5 font-bold text-sm justify-self-center"
            />
          </div>
        ) : (
          <p>No saved designs found.</p>
        )}
      </div>
      <NewCanvas color={state.savedDesign[selectedDesignIndex]?.color}
          imgDecal={state.savedDesign[selectedDesignIndex]?.imageData}
        id={state.savedDesign[selectedDesignIndex]?.id}
        textureType={state.savedDesign[selectedDesignIndex]?.textureType}
        key={state.savedDesign[selectedDesignIndex]?.id} /> {/* Add key prop */}
     <div className="flex  flex-col md:flex-row lg:flex-row items-center justify-between mt-4 ">
      <CustomButton
    type="filled"
    title="Previous Design"
    handleClick={handlePreviousDesign}
    customStyles={`flex-grow-0 w-3/4 px-4 py-2.5 font-bold text-sm justify-self-center 
    ${selectedDesignIndex === 0 ? 'bg-gray-500 cursor-not-allowed' : ''}`}
    disabled={selectedDesignIndex === 0}
  />
  
  <span className="self-center">Saved Design {selectedDesignIndex + 1}</span>
  <CustomButton
    type="filled"
    title="Next Design"
    handleClick={handleNextDesign}
    customStyles={`flex-grow-0 w-3/4 px-4 py-2.5 font-bold text-sm justify-self-center 
    ${selectedDesignIndex === state.savedDesign.length - 1 ? 'bg-gray-400 cursor-not-allowed' : ''}`}
    disabled = {selectedDesignIndex === state.savedDesign.length - 1}
  />
      </div>
      <CustomButton
        type="filled"
        title="GoBack"
        handleClick={handleGoBack}
        customStyles="w-fit px-4 py-2.5 font-bold text-sm mt-4"
      />
    </div>
  );
};

export default SavedDesign;

