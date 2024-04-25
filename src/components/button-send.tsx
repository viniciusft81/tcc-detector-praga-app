import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  message: string;
  onSendImage: () => void;
}

export function ButtonSend({ message, onSendImage }: Props) {
  return (
    <TouchableOpacity 
      className="w-full flex flex-row gap-3 items-center h-14 rounded-lg justify-center bg-green-600 z-10"
      onPress={onSendImage}
    >
      <Ionicons
        name="leaf"
        color="#FFF"
        size={24}
      />
      
      <Text className="font-body text-base text-white">
        {message}
      </Text>
    </TouchableOpacity>
  )
}