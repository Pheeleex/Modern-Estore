// store.js
import { proxy } from 'valtio';

const statte = proxy({
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './threejs.png',
  savedDesigns: [] // Initialize savedDesigns array
});

export default statte;
