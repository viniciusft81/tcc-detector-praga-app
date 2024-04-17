import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function ButtonGallery({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="w-16 h-16 rounded-full flex items-center justify-center bg-green-600 absolute left-10 top-80 z-50"
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