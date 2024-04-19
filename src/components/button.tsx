import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function Button({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={"w-16 h-16 rounded-2xl flex items-center justify-center bg-green-600 absolute right-10 top-80 z-10"}
      {...rest}
    >
      <MaterialIcons
        name="photo-camera"
        color="#FFF"
        size={28}
      />
    </TouchableOpacity>
  );
}