import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'

import state from '../store'
import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation
} from '../config/motion';

import { CustomButton } from '../components';
import { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';

const landingWords = [
    'Garments',
    1000,
    'Graphics',
    1000,
    'Colorways',
    1000,
    'Statements',
    1000,
];

const Home = () => {
    const snap = useSnapshot(state);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadTime = setTimeout(() => {
            setLoaded(true);
        }, 5000);
        return () => clearTimeout(loadTime);
    }, []);

    const handleClick = () => {
        state.intro = false;
    };

    return (
        <AnimatePresence>
            {snap.intro && (
                <motion.section className='home' {...slideAnimation('left')}>
                    <motion.header className='landing-header' {...slideAnimation('down')}>
                        <h1 className='logo'>Oysterlabs</h1>
                        <div className='landing-header-meta'>
                            <span>3D atelier</span>
                            <span>Live garment system</span>
                        </div>
                    </motion.header>
                    <motion.div className='home-content'{...headContainerAnimation}>
                        <motion.div className='landing-title-wrap' {...headTextAnimation}>
                            <p className='landing-kicker'>Wearable interface / made in motion</p>
                            <h1 className='head-text'>
                                Shape
                                <span>
                            <TypeAnimation
                                        sequence={landingWords}
                                        wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                    cursor= {false}
                                />
                                </span>
                            </h1>
                        </motion.div>
                        <motion.div
                            {...headContentAnimation}
                            className='home-copy flex flex-col gap-5'
                        >
                            <p className='para'>
                                A playful design studio for one-of-one shirts. Paint with color, source graphics from your own archive, or generate something unexpected.
                            </p>
                            <div className='landing-actions'>
                                { loaded && (
                                    <CustomButton
                                        type="filled"
                                        title="Enter Studio"
                                        handleClick={handleClick}
                                        customStyles='landing-primary-button'
                                    />
                                )}
                                <span className='landing-note'>Rotate, recolor, print, save.</span>
                            </div>
                        </motion.div>
                    </motion.div>
                    <motion.div className='landing-strip' {...headContentAnimation}>
                        <span>Generative print</span>
                        <span>Realtime canvas</span>
                        <span>Personal archive</span>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    );
};

export default Home;
