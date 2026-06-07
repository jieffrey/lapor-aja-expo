import { View, Text, StyleSheet } from "react-native"
import { Trophy } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { User } from "@/lib/types"

type Props = { user: User }

function getLevel(points: number) {
    if (points >= 500) return { label: "Warga Aktif", stars: 3 }
    if (points >= 200) return { label: "Kontributor", stars: 2 }
    if (points >= 50) return { label: "Pemula", stars: 1 }
    return { label: "Baru", stars: 0 }
}

export default function ProfileHeader({ user }: Props) {
    const level = getLevel(user.points)
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()

    return (
        <View style={[styles.card, shadows.md]}>
            {/* Avatar */}
            <View style={[styles.avatar, shadows.brand]}>
                <Text style={styles.initials}>{initials}</Text>
            </View>

            {/* Name + email */}
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>

            {/* Level + points row */}
            <View style={styles.badgeRow}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>
                        {level.label}{" "}
                        {"★".repeat(level.stars)}
                        {"☆".repeat(3 - level.stars)}
                    </Text>
                </View>

                <View style={styles.pointsBadge}>
                    <Trophy size={12} color={colors.accent.amber} />
                    <Text style={styles.pointsText}>
                        {user.points.toLocaleString("id-ID")} poin
                    </Text>
                </View>
            </View>

            {/* Member since */}
            <Text style={styles.memberSince}>
                Bergabung{" "}
                {new Date(user.created_at).toLocaleDateString("id-ID", {
                    month: "long",
                    year: "numeric",
                })}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius["2xl"],
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: "center",
        marginHorizontal: 20,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.brand[500],
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
    },
    initials: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize["2xl"],
        color: "#fff",
    },
    name: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize.xl,
        color: colors.text.primary,
        letterSpacing: -0.3,
    },
    email: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.muted,
        marginTop: 3,
    },
    badgeRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 14,
    },
    levelBadge: {
        backgroundColor: colors.brand[50],
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: radius.full,
    },
    levelText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xs,
        color: colors.brand[500],
    },
    pointsBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#FEF3C7",
        borderWidth: 1,
        borderColor: "#FCD34D",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: radius.full,
    },
    pointsText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xs,
        color: "#92400E",
    },
    memberSince: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 12,
    },
})