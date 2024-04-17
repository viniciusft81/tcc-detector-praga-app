import { useEffect } from "react"
import { StyleSheet, View, useWindowDimensions } from "react-native"
import { router } from "expo-router"

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  runOnJS,
} from "react-native-reanimated"

export default function Splash() {
  const logoScale = useSharedValue(1)
  const logoPositionY = useSharedValue(0)

  const dimensions = useWindowDimensions()

  const logoAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { translateY: logoPositionY.value },
    ],
  }))

  function logoAnimation() {
    logoScale.value = withSequence(
      withTiming(0.7),
      withTiming(1.3),
      withTiming(1, undefined, (finished) => {
        if (finished) {
          logoPositionY.value = withSequence(
            withTiming(50),
            withTiming(-dimensions.height, { duration: 400 })
          )

          runOnJS(onEndSplash)()
        }
      })
    )
  }

  function onEndSplash() {
    setTimeout(() => {
      router.navigate("/home")
    }, 2000)
  }

  useEffect(() => {
    logoAnimation()
  }, [])

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("@/assets/logo.png")}
        style={[styles.logo, logoAnimatedStyles]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#052E39",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  logo: {
    width: 64,
    height: 64,
  },
})
