import { Text, View } from "react-native"
import Animated, { SlideInUp, BounceOutDown } from "react-native-reanimated"
import { MaterialIcons } from "@expo/vector-icons"
import { useEffect, useState } from "react"

type ToastProps = {
  message: string
}

export function ToastError({ message }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3500); // Toast Desaparece após alguns segundos

    return () => clearTimeout(timer); 
  }, []);

  if (!visible) return null;

  return (
    <Animated.View 
      className="bg-red-600 p-6 rounded-md absolute top-24 w-11/12 self-center"
      entering={SlideInUp.duration(500)} 
      exiting={BounceOutDown}
    >
      <View className="flex-row items-center gap-2">
        <MaterialIcons name="error" size={24} color="#FFF" />
        <Text className="text-white font-subtitle text-md">{message}</Text>
      </View>
    </Animated.View>
  )
}