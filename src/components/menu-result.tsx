import { Text, View } from "react-native"
import Animated, { SlideInDown, BounceOutDown } from "react-native-reanimated"
import { MaterialIcons } from "@expo/vector-icons"

import { ButtonSend } from '@/components/button-send'

type Props = {
  onClear: () => void
  onResultIncorrect: () => void
  onResultCorrect: () => void
}

export function MenuResult({ onClear, onResultIncorrect, onResultCorrect }: Props) {
  return (
    <Animated.View 
      className="bg-slate-800 p-6 rounded-3xl absolute bottom-6 w-11/12 self-center"
      entering={SlideInDown.duration(500)} 
      exiting={BounceOutDown}
    >
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-white text-sm font-body">A inferência está correta?</Text>
        <MaterialIcons name="close" size={24} onPress={onClear} color="#9ca3af" />
      </View>

      <View className="flex-row gap-3">

        <ButtonSend title="Incorreta" onPress={onResultIncorrect} />
        <ButtonSend title="Correta" onPress={onResultCorrect} />
      </View>
    </Animated.View>
  )
}