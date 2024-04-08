import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function Button({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-600 absolute right-10 top-10 z-50"
      {...rest}
    >
      <MaterialIcons
        name="add-a-photo"
        color="#FFF"
        size={24}
      />
    </TouchableOpacity>
  );
}