import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { useAuthStore } from "@/stores/auth.store"
import { colors } from "@/lib/theme"

export default function Index() {
    const router = useRouter()
    const { loading, isAuthenticated, hasSeenOnboarding } = useAuthStore()

    useEffect(() => {
        if (loading) return

        return router.replace("/(onboarding)")
        // if (!hasSeenOnboarding) {
        //     router.replace("/(onboarding)")
        // } else if (isAuthenticated) {
        //     router.replace("/(main)/(home)")
        // } else {
        //     router.replace("/(auth)/login")
        // }
    }, [loading, isAuthenticated, hasSeenOnboarding, router])

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.cream[100],
            }}
        >
            <ActivityIndicator size="large" color={colors.brand[500]} />
        </View>
    )
}