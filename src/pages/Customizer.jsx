import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = ({handleViewSavedDesigns}) => {
  const snap = useSnapshot(state);
  console.log(snap.intro)
  console.log(snap.color)

  const [file, setFile] = useState('');

  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);

  
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })


  const handleTabClick = (tabName) => {
    // Toggle the active tab if the same tab is clicked again
    setActiveEditorTab((prevTab) => (prevTab === tabName ? '' : tabName));
  };

  
  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case "aipicker":
        return <AIPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null;
    }
  }

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");

   

    try {
      setGeneratingImg(true);
      const response = await fetch('https://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({
          prompt: prompt,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch response from OpenAI API');
      }

      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`)
    } catch (error) {
      alert(error)
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  
 

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

 

  const saveCanvasState = (designDetails) => {
    try {
      // Get existing designs from local storage
      const existingDesignsString = localStorage.getItem('CanvasState');
      const existingDesigns = existingDesignsString ? JSON.parse(existingDesignsString) : [];
  
      // Add the new design details to the existing designs
      const updatedDesigns = [...existingDesigns, designDetails];
  
      // Serialize and store the updated designs in local storage
      const serializedState = JSON.stringify(updatedDesigns);
      localStorage.setItem('CanvasState', serializedState);
    } catch (error) {
      console.error('Error saving:', error);
    }
  }
  

  const handleSavedDesign = () => {
    const designDetails = {
      color: snap.color,
    }
    console.log('Shirt Color in customiser:', snap.color);
    saveCanvasState(designDetails)
    console.log(designDetails)
  }




  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="className='mt-10">
              <CustomButton
                 type="filled"
                 title="View saved design"
                 handleClick={handleViewSavedDesigns}
                 />
            </div>
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick = {() => handleTabClick(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <div style={{ display: 'flex', gap: '1.2rem' }}>
            <CustomButton 
              type="filled"
              title="Go Back"
              handleClick={() => state.intro = true}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />

            <CustomButton 
              type="filled"
              title="Save Design"
              handleClick={handleSavedDesign}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
            </div>
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer