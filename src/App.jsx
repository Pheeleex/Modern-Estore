import React, { useState } from 'react';
import './index.css';
import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Home from './pages/Home';
import SavedDesign from './pages/SavedDesign';

function App() {
  const savedDesignString = localStorage.getItem('CanvasState');
  const [viewSavedDesigns, setViewSavedDesigns] = useState(false);


  const handleViewSavedDesigns = () => {
    setViewSavedDesigns(true);
    console.log("App props:", savedDesignString)
  };

  const handleGoBack = () => {
    setViewSavedDesigns(false);
  };

  return (
    <main className='app transition-all ease-in'>
      <Home />
      {viewSavedDesigns ? (
        <SavedDesign 
            savedDesignString={savedDesignString}
            handleGoBack={handleGoBack}
            />
      ) : (
        <>
        <Canvas />
        <Customizer handleViewSavedDesigns={handleViewSavedDesigns} />
        </>
      )}
    </main>
  );
}

export default App;

