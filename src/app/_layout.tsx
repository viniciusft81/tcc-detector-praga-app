import "@/styles/global.css"
import { Slot } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import Loading from "@/components/loading"

import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_700Bold
 } from "@expo-google-fonts/poppins"

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  if(!fontsLoaded) {
    return <Loading />
  }
  
  return (
    <GestureHandlerRootView style={ { flex: 1} }>
      <StatusBar style="dark" />
      <Slot />
    </GestureHandlerRootView>
  )
}