//import React from 'react'

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
                    <motion.header {...slideAnimation('down')}>
                        <img 
                            src='./threejs.png' 
                            alt='logo'
                            className='w-8 h-8 object-contain' />
                    </motion.header>
                    <motion.div className='home-content'{...headContainerAnimation}>
                        <motion.div className='home-content' {...headTextAnimation}>
                            <h1 className='head-text'>
                                Let's <br className='xl:block hidden' /> DO IT
                            </h1>
                        </motion.div>
                        <motion.div
                            {...headContentAnimation}
                            className='flex flex-col gap-5'
                        >
                            <p className='max-w-md font-normal text-gray-600 text-base'>
                                Create your unique and exclusive shirt with our brand-new 3D customization tool. <strong>Bring your imagination to life</strong>{" "} and define your own style
                            </p>
                            { loaded && (
                                <CustomButton
                                    type="filled"
                                    title="Customise It"
                                    handleClick={handleClick}
                                    customStyles='w-fit px-4 py-2.5 font-bold text-sm'
                                />
                            )}
                        </motion.div>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    );
};

export default Home;


