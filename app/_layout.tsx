import { useEffect, useState } from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { PaperProvider } from "react-native-paper"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans"
import { useAuthStore } from "@/stores/auth.store"
import SplashScreen from "@/components/SplashScreen"

export default function RootLayout() {
  const loadSession = useAuthStore((s) => s.loadSession)
  const [appReady, setAppReady] = useState(false)
  const [splashDone, setSplashDone] = useState(false)

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  })

  useEffect(() => {
    if (!fontsLoaded) return
    const init = async () => {
      await loadSession()
      setAppReady(true)
    }
    init()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <StatusBar style={splashDone ? "dark" : "light"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
        <SplashScreen
          isVisible={!appReady}
          onExitComplete={() => setSplashDone(true)}
        />
      </PaperProvider>
    </GestureHandlerRootView>
  )
}