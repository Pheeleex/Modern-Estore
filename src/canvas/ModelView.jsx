import { View } from '@react-three/drei'
import React from 'react'
import Shirt from './Shirt'

const ModelView = ({id}) => {
  return (
    <View 
    id={id}>
        <Shirt />
    </View>
  )
}

export default ModelView