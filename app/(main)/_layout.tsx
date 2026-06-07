import { Tabs } from "expo-router"
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
    Home,
    Compass,
    Plus,
    Map,
    User,
} from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"

export default function MainLayout() {
    const insets = useSafeAreaInsets()

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    ...styles.tabBar,
                    paddingBottom: Platform.OS === "ios" ? insets.bottom : 12,
                    height: Platform.OS === "ios" ? 80 + insets.bottom : 68,
                },
                tabBarActiveTintColor: colors.brand[500],
                tabBarInactiveTintColor: colors.text.placeholder,
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "Beranda",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={<Home size={20} color={color} />}
                            focused={focused}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="(explore)"
                options={{
                    title: "Jelajahi",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={<Compass size={20} color={color} />}
                            focused={focused}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="(create)"
                options={{
                    title: "",
                    tabBarIcon: () => (
                        <View style={[styles.fabWrap, shadows.brand]}>
                            <View style={styles.fab}>
                                <Plus size={24} color="#fff" strokeWidth={2.5} />
                            </View>
                        </View>
                    ),
                    tabBarLabel: () => null,
                }}
            />

            <Tabs.Screen
                name="(map)"
                options={{
                    title: "Peta",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={<Map size={20} color={color} />}
                            focused={focused}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="(profile)"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={<User size={20} color={color} />}
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tabs>
    )
}

function TabIcon({
    icon,
    focused,
}: {
    icon: React.ReactNode
    focused: boolean
}) {
    return (
        <View
            style={[
                styles.tabIconWrap,
                focused && styles.tabIconFocused,
            ]}
        >
            {icon}
        </View>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.cream[50],
        borderTopWidth: 1,
        borderTopColor: colors.cream[300],
        paddingTop: 8,
        elevation: 0,
        shadowColor: colors.brand[500],
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
    },
    tabLabel: {
        fontFamily: fontFamily.semibold,
        fontSize: 10,
        marginTop: 2,
    },
    tabIconWrap: {
        width: 36,
        height: 36,
        borderRadius: radius.md,
        justifyContent: "center",
        alignItems: "center",
    },
    tabIconFocused: {
        backgroundColor: colors.brand[50] + "80",
    },
    fabWrap: {
        position: "relative",
        top: -14,
    },
    fab: {
        width: 52,
        height: 52,
        borderRadius: radius.xl,
        backgroundColor: colors.brand[500],
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: colors.cream[50],
    },
})