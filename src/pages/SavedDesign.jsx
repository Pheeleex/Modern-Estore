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
    <section className='saved-page'>
      <h2 className="saved-page-title">Saved Design Details</h2>
      <div className="saved-details">
        {selectedDesign ? (
          <div key={selectedDesign.id} className='saved-details-row'>
            <p>Shirt Color: {selectedDesign.color}</p>
            <p>File Chosen: {selectedDesign.file}</p>
            <CustomButton
              type="outline"
              title="Delete"
              handleClick={() => handleDeleteDesign(selectedDesign.id)}
              customStyles="saved-delete-button"
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
        <div className="saved-navigation">
          <CustomButton
            type="filled"
            title="Previous Design"
            handleClick={handlePreviousDesign}
            customStyles={`saved-nav-button 
            ${selectedDesignIndex === 0 ? 'bg-gray-500 cursor-not-allowed' : ''}`}
            disabled={selectedDesignIndex === 0}
          />
          <span className="saved-count">Saved Design {selectedDesignIndex + 1}</span>
          <CustomButton
            type="filled"
            title="Next Design"
            handleClick={handleNextDesign}
            customStyles={`saved-nav-button 
            ${selectedDesignIndex === designs.length - 1 ? 'bg-gray-400 cursor-not-allowed' : ''}`}
            disabled={selectedDesignIndex === designs.length - 1}
          />
        </div>
      )}
      <CustomButton
        type="filled"
        title="Go Back"
        handleClick={handleGoBack}
        customStyles="saved-back-button"
      />
    </section>
  );
};

export default SavedDesign;
