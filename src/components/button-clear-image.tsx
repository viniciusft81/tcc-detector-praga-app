import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function ButtonClearImage({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={"w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-800 absolute right-10 top-14 z-10"}
      {...rest}
    >
      <MaterialIcons
        name="close"
        color="#FFF"
        size={22}
      />
    </TouchableOpacity>
  );
}