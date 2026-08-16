import { useEffect, useMemo, useState } from 'react';
import { CustomButton } from '../components';
import NewCanvas from '../canvas/NewCanvas';

const SavedDesign = ({ savedDesigns = [], handleDesignsChange, handleGoBack }) => {
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(0);
  const designs = useMemo(
    () => savedDesigns.map((design, index) => ({ ...design, id: design.id || index })),
    [savedDesigns]
  );

  useEffect(() => {
    if (selectedDesignIndex > designs.length - 1) {
      setSelectedDesignIndex(Math.max(designs.length - 1, 0));
    }
  }, [designs.length, selectedDesignIndex]);

  const handleDeleteDesign = (id) => {
    const updatedDesigns = designs.filter((design) => design.id !== id);
    handleDesignsChange(updatedDesigns);
  };

  const handleNextDesign = () => {
    setSelectedDesignIndex((prevIndex) => Math.min(prevIndex + 1, designs.length - 1));
  };

  const handlePreviousDesign = () => {
    setSelectedDesignIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const selectedDesign = designs[selectedDesignIndex];

  return (
    <div className='mt-20 mx-10 lg:mx-20 mb-20'>
      <h2>Saved Design Details</h2>
      <div>
        {selectedDesign ? (
          <div key={selectedDesign.id} className='flex flex-col justify-between md:flex-row align-center'>
            <p>Shirt Color: {selectedDesign.color}</p>
            <p>File Chosen: {selectedDesign.file}</p>
            <CustomButton
              type="outline"
              title="Delete"
              handleClick={() => handleDeleteDesign(selectedDesign.id)}
              customStyles="flex-grow-0 w-[40%] px-4 py-2.5 font-bold text-sm justify-self-center"
            />
          </div>
        ) : (
          <p>No saved designs found.</p>
        )}
      </div>
      {selectedDesign && (
        <NewCanvas
          color={selectedDesign.color}
          imgDecal={selectedDesign.imageData}
          id={selectedDesign.id}
          textureType={selectedDesign.textureType}
          key={selectedDesign.id}
        />
      )}
      {selectedDesign && (
        <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between mt-4">
          <CustomButton
            type="filled"
            title="Previous Design"
            handleClick={handlePreviousDesign}
            customStyles={`flex-grow-0 w-[40%] px-4 py-2.5 font-bold text-sm justify-self-center 
            ${selectedDesignIndex === 0 ? 'bg-gray-500 cursor-not-allowed' : ''}`}
            disabled={selectedDesignIndex === 0}
          />
          <span className="self-center">Saved Design {selectedDesignIndex + 1}</span>
          <CustomButton
            type="filled"
            title="Next Design"
            handleClick={handleNextDesign}
            customStyles={`flex-grow-0 w-[40%] px-4 py-2.5 font-bold text-sm justify-self-center 
            ${selectedDesignIndex === designs.length - 1 ? 'bg-gray-400 cursor-not-allowed' : ''}`}
            disabled={selectedDesignIndex === designs.length - 1}
          />
        </div>
      )}
      <CustomButton
        type="filled"
        title="Go Back"
        handleClick={handleGoBack}
        customStyles="w-fit px-4 py-2.5 font-bold text-sm mt-4"
      />
    </div>
  );
};

export default SavedDesign;
