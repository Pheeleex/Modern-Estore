import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';
import Joyride from 'react-joyride';
import { v4 as uuidv4 } from 'uuid';


const Customizer = ({handleViewSavedDesigns}) => {
  const snap = useSnapshot(state);
  console.log(snap.intro)
  console.log(snap.color)

//set state for file upload
  const [file, setFile] = useState('');

//set state for AI prompts
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
 
  //set state for handling current editor tabs
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })

  //set state for Joyride
  const [joyrideSteps,setJoyrideSteps] = useState([]); //state for joyride steps
  const [showJoyRide, setShowJoyRide] = useState(true)
  


  const handleTabClick = (tabName) => {
    setShowJoyRide(false)
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
      const response = await fetch("https://ai-stitches.onrender.com/api/v1/ai", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',       
        },
        body: JSON.stringify({
          prompt,
          textureType: type, // Add the textureType parameter
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch response from OpenAI API, if you like sleep');
      }
      const data = await response.json();
      handleDecals(type, `data:image/png;base64,${data.photo}`)
      setFile(data.photo)
      console.log(data.photo)
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
    setShowJoyRide(false)
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
  

  const handleSavedDesign = async (event) => {
    const textureType = state.isFullTexture ? 'fullTexture' : 'logoTexture';
  
    try {
      const imageData = file ? await getFileAsBase64(file) : snap.logoDecal;
      if (!imageData) {
        throw new Error('Failed to get image data');
      }
  
      const designDetails = {
        color: snap.color,
        file: file.name,
        imageData: imageData,
        textureType: textureType
      };
      saveCanvasState(designDetails);
      alert('Your design has been saved!');
      console.log('Shirt Color in customiser:', snap.color);
      console.log('Shirt File in customiser:', file);
      console.log(designDetails);
    } catch (error) {
      console.error('Error saving design:', error);
      // Handle the error as needed, e.g., show an error message to the user
    }
  };

  const getFileAsBase64 = async (file) => {
    if (!file) {
      console.error('File object is null or undefined');
      return null;
    }
  
    // Check if the file is already a data URL
    if (typeof file === 'string' && file.startsWith('data:')) {
      return file;
    }
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      
      // Check if file is a Blob or File object before reading as data URL
      if (file instanceof Blob || file instanceof File) {
        reader.readAsDataURL(file);
      } else {
        reject(new Error('Invalid file type'));
      }
    });
  };
  

// Initialize Joyride steps
useEffect(() => {

  const steps = [
    {
      target: '.tabs',
      content: 'This is tabs help you edit the shirt properties',
      key: 'key-1',
    },
    {
      target: '.color-picker',
      content: 'Click here to change the color of the shirt',
      key: 'color-step'
    },
    {
      target: '.file-picker',
      content: 'Click here to add an image to the shirt, could be a logo or a full print',
      key: 'file-step'
    },
    
    {
      target: '.ai-picker',
      content: 'Click here to describe to our AI tool, what type of design you want',
      key: 'aipicker-step'
    },
    {
      target: '.logo-shirt',
      content: 'Click here to add or remove the logo',
      key: 'logo-step'
    },
    {
      target: '.style-shirt',
      content: 'Click here to add or remove the full print',
      key: 'full-step'
    },
    {
      target: '.save',
      content: "click here when, you are ok with your design and ready to save, you can save as many designs as possible",
      key: 'save-step'
    },
    {
      target: '.view',
      content: 'Click here to view saved designs',
      key: 'view-step'
    },
    {
      target: '.help-button',
      content: 'Click here to go over how the buttons work again',
      key: 'help-step'
    }
  ];

  setJoyrideSteps(steps);
  console.log('Joyride steps:', steps);
  console.log('EditorTabs', EditorTabs);
  
 
}, [])


  // Event handler for when joyride ends
  const handleJoyrideCallback = (data) => {
    console.log(data);  
    // You can update state or perform actions based on joyride events
  }

  const toggleHelp = () => {
    setShowJoyRide((prev) => !prev)
  }



  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className='mt-4 flex flex-col p-0'>
            <div className="view mx-4">
              <CustomButton
                 type="filled"
                 title="View saved design"
                 handleClick={handleViewSavedDesigns}
                 customStyles="m-0 w-28"
                 />
              </div>
                 <button className="help-button rounded-full bg-yellow-500 p-1 w-10 m-4"
                 onClick={toggleHelp}>?</button>
            </div>
            <div className="flex items-center min-h-screen">
              <div className=" editortabs-container tabs">
                {EditorTabs.map((tab, index) => (
                  <Tab 
                  key={uuidv4()}
                    tab={tab}
                    handleClick = {() => handleTabClick(tab.name)}
                    className= {tab.className}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

                  {
                    showJoyRide && (
                      <Joyride
                        steps={joyrideSteps}
                        continuous={true}
                        scrollToFirstStep={true}
                        showProgress={true}
                        callback={handleJoyrideCallback}
                        key={uuidv4()}
                      />
                    )
                  }
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <div className="flex flex-col sm:flex-row gap-4">
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
              customStyles="save w-fit px-4 py-2.5 font-bold text-sm"
            />
           
            </div>
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab, index) => (
              <Tab
                key={uuidv4()}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
                className={tab.className}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer