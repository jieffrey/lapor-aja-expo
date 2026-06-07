import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
    FileText,
    Trophy,
    Bell,
    LogOut,
    ChevronRight,
    User,
} from "lucide-react-native"
import { useAuthStore } from "@/stores/auth.store"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import ProfileHeader from "@/components/profile/ProfileHeader"

type MenuItem = {
    icon: React.ReactNode
    label: string
    sub: string
    route?: string
    color: string
    onPress?: () => void
}

export default function ProfileScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const { user, logout } = useAuthStore()

    if (!user) return null

    const handleLogout = () => {
        Alert.alert("Keluar", "Yakin mau keluar dari akun?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Keluar",
                style: "destructive",
                onPress: async () => {
                    await logout()
                    router.replace("/(auth)/login")
                },
            },
        ])
    }

    const menuItems: MenuItem[] = [
        {
            icon: <FileText size={18} color={colors.brand[500]} />,
            label: "Laporan Saya",
            sub: "Lihat semua laporanmu",
            route: "/(main)/(profile)/my-reports",
            color: colors.brand[50],
        },
        {
            icon: <Trophy size={18} color={colors.accent.amber} />,
            label: "Leaderboard",
            sub: "Peringkat warga aktif",
            route: "/(main)/(profile)/leaderboard",
            color: "#FEF3C7",
        },
        {
            icon: <Bell size={18} color={colors.accent.orange} />,
            label: "Notifikasi",
            sub: "Update laporan dan poin",
            route: "/(main)/(profile)/notifications",
            color: "#FEE2E2",
        },
    ]

    return (
        <ScrollView
            style={[styles.container, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.pageHeader}>
                <User size={20} color={colors.brand[500]} />
                <Text style={styles.pageTitle}>Profil</Text>
            </View>

            <ProfileHeader user={user} />

            {/* Menu */}
            <View style={[styles.menuCard, shadows.sm]}>
                {menuItems.map((item, idx) => (
                    <TouchableOpacity
                        key={item.label}
                        onPress={() =>
                            item.route
                                ? router.push(item.route as any)
                                : item.onPress?.()
                        }
                        style={[
                            styles.menuItem,
                            idx < menuItems.length - 1 && styles.menuBorder,
                        ]}
                        activeOpacity={0.6}
                    >
                        <View
                            style={[
                                styles.menuIcon,
                                { backgroundColor: item.color },
                            ]}
                        >
                            {item.icon}
                        </View>
                        <View style={styles.menuText}>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Text style={styles.menuSub}>{item.sub}</Text>
                        </View>
                        <ChevronRight
                            size={16}
                            color={colors.text.placeholder}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout */}
            <TouchableOpacity
                onPress={handleLogout}
                style={[styles.logoutBtn, shadows.sm]}
                activeOpacity={0.7}
            >
                <LogOut size={16} color={colors.danger} />
                <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cream[100],
    },
    content: {
        gap: 16,
        paddingBottom: 100,
    },
    pageHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 4,
    },
    pageTitle: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize.xl,
        color: colors.text.primary,
    },
    menuCard: {
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius.xl,
        marginHorizontal: 20,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    menuBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.cream[200],
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: radius.md,
        justifyContent: "center",
        alignItems: "center",
    },
    menuText: {
        flex: 1,
    },
    menuLabel: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.md,
        color: colors.text.primary,
    },
    menuSub: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 2,
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: colors.dangerBg,
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: radius.xl,
        marginHorizontal: 20,
        paddingVertical: 14,
    },
    logoutText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.md,
        color: colors.danger,
    },
})