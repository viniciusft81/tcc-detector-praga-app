import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  message: string;
  onSendImage: () => void;
}

export function ButtonSend({ message }: Props) {
  return (
    <View className="w-full flex flex-row gap-3 items-center h-14 rounded-lg justify-center bg-green-600">
      <Ionicons
        name="leaf"
        color="#FFF"
        size={24}
      />
      
      <Text className="font-body text-base text-white">
        {message}
      </Text>
    </View>
  )
}