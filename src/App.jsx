import { useState } from 'react';
import './index.css';
import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Home from './pages/Home';
import SavedDesign from './pages/SavedDesign';

const loadSavedDesigns = () => {
  try {
    const savedDesignString = localStorage.getItem('CanvasState');
    return savedDesignString ? JSON.parse(savedDesignString) : [];
  } catch (error) {
    console.error('Unable to load saved designs:', error);
    return [];
  }
};

function App() {
  const [savedDesigns, setSavedDesigns] = useState(loadSavedDesigns);
  const [viewSavedDesigns, setViewSavedDesigns] = useState(false);

  const handleViewSavedDesigns = () => {
    setSavedDesigns(loadSavedDesigns());
    setViewSavedDesigns(true);
  };

  const handleGoBack = () => {
    setViewSavedDesigns(false);
  };

  const handleDesignsChange = (designs) => {
    setSavedDesigns(designs);
    localStorage.setItem('CanvasState', JSON.stringify(designs));
  };

  return (
    <main className='app transition-all ease-in'>
      <Home />
      {viewSavedDesigns ? (
        <SavedDesign 
          savedDesigns={savedDesigns}
          handleDesignsChange={handleDesignsChange}
          handleGoBack={handleGoBack}
        />
      ) : (
        <>
          <Canvas />
          <Customizer
            handleDesignsChange={handleDesignsChange}
            handleViewSavedDesigns={handleViewSavedDesigns}
          />
        </>
      )}
    </main>
  );
}

export default App;
