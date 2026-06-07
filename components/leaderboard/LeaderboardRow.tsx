import { StyleSheet, Text, View } from "react-native"
import { colors, fontFamily, fontSize, radius } from "@/lib/theme"
import type { User } from "@/lib/types"

const TOP3_RANK_COLOR: Record<number, string> = {
    1: "#F59E0B",
    2: colors.cream[300],
    3: "#FEF3C7",
}

interface Props {
    user: User
    rank: number
    isMe: boolean
}

export default function LeaderboardRow({ user, rank, isMe }: Props) {
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()

    const isTop3 = rank <= 3
    const rankBgColor = TOP3_RANK_COLOR[rank] ?? colors.cream[200]
    const avatarBgColor = isTop3 ? "#F59E0B" : colors.brand[500]

    return (
        <View style={[styles.row, isMe && styles.rowMe]}>
            <View style={[styles.rankBadge, { backgroundColor: rankBgColor }]}>
                <Text style={[styles.rankText, rank === 1 && styles.rankTextFirst]}>
                    {rank}
                </Text>
            </View>

            <View style={[styles.avatar, { backgroundColor: avatarBgColor }]}>
                <Text style={styles.initials}>{initials}</Text>
            </View>

            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
                    {isMe && (
                        <View style={styles.meBadge}>
                            <Text style={styles.meText}>Kamu</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
            </View>

            <Text style={[styles.points, rank === 1 && styles.pointsFirst]}>
                {(user.points ?? 0).toLocaleString("id-ID")}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius.lg,
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 10,
    },
    rowMe: {
        borderColor: colors.brand[200],
        backgroundColor: colors.brand[50] + "40",
    },
    rankBadge: {
        width: 28,
        height: 28,
        borderRadius: radius.sm,
        justifyContent: "center",
        alignItems: "center",
    },
    rankText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.sm,
        color: colors.text.muted,
    },
    rankTextFirst: { color: "#fff" },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: "center",
        alignItems: "center",
    },
    initials: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xs,
        color: "#fff",
    },
    info: { flex: 1, minWidth: 0 },
    nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    name: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.base,
        color: colors.text.primary,
        flexShrink: 1,
    },
    email: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 1,
    },
    meBadge: {
        backgroundColor: colors.brand[50],
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: radius.full,
    },
    meText: {
        fontFamily: fontFamily.bold,
        fontSize: 8,
        color: colors.brand[500],
    },
    points: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.md,
        color: colors.brand[500],
    },
    pointsFirst: { color: "#F59E0B" },
})