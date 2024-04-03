import React from 'react'
import { useSnapshot } from 'valtio'
import state from '../store'
import { getContrastingColor } from '../config/helpers'

const CustomButton = ({type, title, customStyles, handleClick, disabled}) => {
    const snap = useSnapshot(state)

    const generateStyle = (type) => {
        if (disabled) {
            return {
              backgroundColor: 'gray',
              color: '#ffffff', // Change text color to white for better contrast
            };
          }
        if(type === 'filled'){
            return {backgroundColor: snap.color,
            color: getContrastingColor(snap.color)}
        }
        else if(type === "outline"){
            return {
                borderWidth: "5px",
                borderColor: (snap.color),
                color: snap.color
            }
        }
    }
  return (
   <button
        className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
        style={generateStyle(type)}
        onClick={handleClick}
   >
    {title}
   </button>
  )
}

export default CustomButton