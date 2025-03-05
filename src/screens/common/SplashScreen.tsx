"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, Image, Animated } from "react-native"
import { colors } from "../../theme/colors"

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0)
  const scaleAnim = new Animated.Value(0.9)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, scaleAnim])

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("../../assets/images/logo.jpg")}
          style={styles.logo}
          defaultSource={require("../../assets/images/logo.jpg")}
        />
        <Text style={styles.title}>Loyalty App</Text>
        <Text style={styles.subtitle}>Earn rewards, redeem benefits</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
})

export default SplashScreen

