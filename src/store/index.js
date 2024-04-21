import { proxy } from "valtio";

const state = proxy({
    intro: true,
    color: '#40e0d0',
    isLogoTexture: true,
    isFullTexture: false,
    logoDecal: './threejs.png',
    fullDecal: './threejs.png',
    savedDesign: []
})
export default state;