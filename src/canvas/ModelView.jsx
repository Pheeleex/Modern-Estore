import { View } from '@react-three/drei'
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
