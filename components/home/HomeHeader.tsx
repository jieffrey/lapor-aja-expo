import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Bell, Trophy } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { User } from "@/lib/types"

type Props = {
    user: User
    unreadCount: number
}

export default function HomeHeader({ user, unreadCount }: Props) {
    const router = useRouter()
    const firstName = user.name.split(" ")[0]

    return (
        <View style={styles.container}>
            {/* Left — greeting */}
            <View style={styles.left}>
                <Text style={styles.greeting}>Selamat datang</Text>
                <Text style={styles.name}>{firstName}</Text>
            </View>

            {/* Right — points + bell */}
            <View style={styles.right}>
                {/* Points chip */}
                <View style={styles.pointsChip}>
                    <Trophy size={12} color={colors.accent.amber} />
                    <Text style={styles.pointsText}>
                        {user.points.toLocaleString("id-ID")}
                    </Text>
                </View>

                {/* Notification bell */}
                <TouchableOpacity
                    style={styles.bellBtn}
                    activeOpacity={0.7}
                    onPress={() => router.push("/(main)/(profile)/notifications" as any)}
                >
                    <Bell size={18} color={colors.text.muted} />
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    left: {},
    greeting: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.base,
        color: colors.text.muted,
    },
    name: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize.xl,
        color: colors.text.primary,
        letterSpacing: -0.3,
        marginTop: 2,
    },
    right: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    pointsChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#FEF3C7",
        borderWidth: 1,
        borderColor: "#FCD34D",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: radius.full,
    },
    pointsText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.sm,
        color: "#92400E",
    },
    bellBtn: {
        width: 38,
        height: 38,
        borderRadius: radius.md,
        backgroundColor: colors.cream[200],
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: 4,
        right: 4,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.accent.orange,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 3,
    },
    badgeText: {
        fontFamily: fontFamily.bold,
        fontSize: 9,
        color: "#fff",
    },
})