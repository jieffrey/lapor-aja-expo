import { useEffect } from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { PaperProvider } from "react-native-paper"
import * as SplashScreen from "expo-splash-screen"
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans"
import { useAuthStore } from "@/stores/auth.store"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const loadSession = useAuthStore((s) => s.loadSession)

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  })

  useEffect(() => {
    const init = async () => {
      await loadSession()
      if (fontsLoaded) {
        await SplashScreen.hideAsync()
      }
    }
    init()
  }, [fontsLoaded, loadSession])

  if (!fontsLoaded) return null

  return (
    <PaperProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
    </PaperProvider>
  )
}