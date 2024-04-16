import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function ButtonGallery({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-600 absolute right-32 top-80 z-10"
      {...rest}
    >
      <MaterialIcons
        name="image"
        color="#FFF"
        size={24}
      />
    </TouchableOpacity>
  );
}