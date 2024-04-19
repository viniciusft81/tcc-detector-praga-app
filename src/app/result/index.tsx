import { Image, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ButtonSend } from "@/components/button-send";

export default function Result() {
  const params = useLocalSearchParams<{ imgBase64: string }>()
  const imgbase64 = params.imgBase64

  return (
    <View className="flex-1">

      <View className="px-8 pt-16 mb-3">
        <MaterialIcons 
          name="arrow-back" 
          size={32} onPress={() => router.back()} 
        />
        <Text className="font-heading text-xl mt-8 text-green-600">Correção da inferência</Text>
      </View>

      <View className="w-10/12 gap-6 mt-7 ml-4 pt-10">

        <TextInput 
          placeholder="Rótulo correto da imagem..."
          placeholderTextColor={'#D0D5DB'}
          cursorColor={'#22c55e'}
          className="border-b-2 border-green-600 text-green-600 font-body px-2 py-1 w-full"  
        />
      </View>
      
      <View className="mt-10 pt-8 w-4/5 ml-10">

        <ButtonSend message="Enviar" onSendImage={() => {}} />

        <Image 
          source={{ uri: imgbase64 }}
          resizeMode="contain"
          className="mt-8 w-full h-96"
        />
      </View>

    </View>
  )
}