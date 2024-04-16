import { swatch, fileIcon, ai, logoShirt, stylishShirt } from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch,
    className: 'color-picker'
  },
  {
    name: "filepicker",
    icon: fileIcon,
    className: 'file-picker'
  },
  {
    name: "aipicker",
    icon: ai,
    className: 'ai-picker'
  }, 
];

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: logoShirt,
    className: 'logo-shirt'
  },
  {
    name: "stylishShirt",
    icon: stylishShirt,
    className: 'style-shirt'
  },
];

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoShirt",
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
  },
};
