import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { download } from "../assets";
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';
import Joyride from 'react-joyride';

const AI_ENDPOINT = "https://ai-stitches.onrender.com/api/v1/ai";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const AI_REQUEST_TIMEOUT = 45000;

const Customizer = ({ handleDesignsChange, handleViewSavedDesigns }) => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })
  const [fileError, setFileError] = useState('');
  const [aiError, setAiError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [joyrideSteps,setJoyrideSteps] = useState([]);
  const [showJoyRide, setShowJoyRide] = useState(true)

  const handleTabClick = (tabName) => {
    setShowJoyRide(false)
    setActiveEditorTab((prevTab) => (prevTab === tabName ? '' : tabName));
  };

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={handleFileSelect}
          readFile={readFile}
          error={fileError}
        />
      case "aipicker":
        return <AIPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
          error={aiError}
        />
      default:
        return null;
    }
  }

  const getErrorMessage = (error, fallback) => {
    if (error.name === 'AbortError') {
      return 'The request took too long. Please try again.';
    }

    return error.message || fallback;
  };

  const validateImageFile = (selectedFile) => {
    if (!selectedFile) {
      return 'Please choose an image first.';
    }

    if (!(selectedFile instanceof File)) {
      return 'Please choose a valid image file.';
    }

    if (!selectedFile.type.startsWith('image/')) {
      return 'Please choose a PNG, JPG, or another image file.';
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      return 'Please choose an image smaller than 5MB.';
    }

    return '';
  };

  const handleFileSelect = (selectedFile) => {
    const error = selectedFile ? validateImageFile(selectedFile) : '';
    setFileError(error);
    setSaveError('');

    if (error) {
      setFile('');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (type) => {
    const trimmedPrompt = prompt.trim();

    if(!trimmedPrompt) {
      setAiError("Please enter a prompt.");
      return;
    }

    setAiError('');
    setSaveError('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT);

    try {
      setGeneratingImg(true);
      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',       
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          textureType: type,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error('Unable to generate an image right now. Please try again.');
      }

      const data = await response.json();
      if (!data?.photo) {
        throw new Error('The AI response did not include an image.');
      }

      const imageData = `data:image/png;base64,${data.photo}`;
      handleDecals(type, imageData)
      setFile(imageData)
      setFileError('');
    } catch (error) {
      setAiError(getErrorMessage(error, 'Unable to generate an image right now. Please try again.'));
    } finally {
      clearTimeout(timeoutId);
      setGeneratingImg(false);
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

    setShowJoyRide(false)
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    setFileError('');
    setSaveError('');

    if (typeof file === 'string' && file.startsWith('data:')) {
      handleDecals(type, file);
      setActiveEditorTab("");
      return;
    }

    const error = validateImageFile(file);
    if (error) {
      setFileError(error);
      return;
    }

    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
      .catch((error) => setFileError(getErrorMessage(error, 'Unable to read that image. Please try another file.')))
  }

 
  const saveCanvasState = (designDetails) => {
    try {
      const existingDesignsString = localStorage.getItem('CanvasState');
      const existingDesigns = existingDesignsString ? JSON.parse(existingDesignsString) : [];
      const updatedDesigns = [...existingDesigns, designDetails];
      handleDesignsChange(updatedDesigns);
      return updatedDesigns;
    } catch (error) {
      console.error('Unable to save design:', error);
      return null;
    }
  }
  

  const handleSavedDesign = async () => {
    setSaveError('');
  
    try {
      downloadCanvasToImage()
      const textureType = state.isFullTexture ? 'fullTexture' : 'logoTexture';
      const imageData = file ? await getFileAsBase64(file) : snap.logoDecal;

      if (!imageData) {
        throw new Error('Failed to get image data');
      }
  
      const designDetails = {
        id: crypto.randomUUID(),
        color: snap.color,
        file: file?.name || 'Generated image',
        imageData,
        textureType
      };
      const savedDesigns = saveCanvasState(designDetails);
      if (savedDesigns) {
        alert('Your design has been saved.');
      }
    } catch (error) {
      console.error('Unable to save design:', error);
      setSaveError(getErrorMessage(error, 'Unable to save your design. Please try again.'));
    }
  };

  const getFileAsBase64 = async (file) => {
    if (!file) {
      return null;
    }
  
    if (typeof file === 'string' && file.startsWith('data:')) {
      return file;
    }
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      
      if (file instanceof Blob || file instanceof File) {
        reader.readAsDataURL(file);
      } else {
        reject(new Error('Invalid file type'));
      }
    });
  };
  

useEffect(() => {

  const steps = [
    {
      target: '.tabs',
      content: 'Use these tabs to edit the shirt.',
      key: 'key-1',
    },
    {
      target: '.color-picker',
      content: 'Change the shirt color.',
      key: 'color-step'
    },
    {
      target: '.file-picker',
      content: 'Upload an image for a logo or full-shirt print.',
      key: 'file-step'
    },
    
    {
      target: '.ai-picker',
      content: 'Describe the design you want to generate.',
      key: 'aipicker-step'
    },
    {
      target: '.logo-shirt',
      content: 'Show or hide the logo texture.',
      key: 'logo-step'
    },
    {
      target: '.style-shirt',
      content: 'Show or hide the full-shirt texture.',
      key: 'full-step'
    },
    {
      target: '.download-btn',
      content: 'Download and save your current design.',
      key: 'download-step'
    },
    {
      target: '.view',
      content: 'View your saved designs.',
      key: 'view-step'
    },
    {
      target: '.help-button',
      content: 'Restart this guide.',
      key: 'help-step'
    }
  ];

  setJoyrideSteps(steps);
}, [])

  const handleJoyrideCallback = (data) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      setShowJoyRide(false);
    }
  }

  const toggleHelp = () => {
    setShowJoyRide((prev) => !prev)
  }



  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            className="studio-hud"
            {...fadeAnimation}
          >
            <div>
              <p className="studio-hud-label">Oysterlabs Studio</p>
              <p className="studio-hud-title">Live garment composer</p>
            </div>
            <div className="studio-hud-color">
              <span style={{ backgroundColor: snap.color }} />
              <strong>{snap.color}</strong>
            </div>
          </motion.div>
          <motion.div
            className="customizer-side-panel"
            {...slideAnimation('left')}
          >
            <div className='customizer-back'>
            <CustomButton 
              type="filled"
              title="Go Back"
              handleClick={() => state.intro = true}
              customStyles="w-fit m-2 px-4 py-2.5 font-bold text-sm"
            />
                 
            </div>
            <div className="editor-shell">
              <div className=" editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
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
                      />
                    )
                  }
          <motion.div
            className="saved-designs-action"
            {...fadeAnimation}
          >
            <div className="flex sm:flex-row gap-4">
            <div className="view">
              <CustomButton
                 type="filled"
                 title="Saved Designs"
                 handleClick={handleViewSavedDesigns}
                 customStyles="saved-designs-button"
                 />
              </div>
            </div>
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation("up")}
          >
            <div className="toolbelt-label">Texture</div>
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
                className={tab.className}
              />
            ))}
            <button className='download-btn' onClick={handleSavedDesign}>
                        <img
                            src={download}
                            alt='download_image'
                            className='w-3/5 h-3/5 object-contain'
                        />
                    </button>
                    {saveError && <p className="save-error">{saveError}</p>}
                    <CustomButton
                  type="filled"
                  title="Help"
                  handleClick={toggleHelp}
                  customStyles='help-button w-fit px-4 py-2.5 font-bold text-sm' />

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer
