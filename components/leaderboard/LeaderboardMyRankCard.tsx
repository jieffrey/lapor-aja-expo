import { StyleSheet, Text, View } from "react-native"
import { TrendingUp, Trophy } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { User } from "@/lib/types"

function getLevel(points: number) {
    if (points >= 500) return { label: "Warga Aktif", stars: 3 }
    if (points >= 200) return { label: "Kontributor", stars: 2 }
    if (points >= 50) return { label: "Pemula", stars: 1 }
    return { label: "Baru", stars: 0 }
}

interface Props {
    user: User
    rank: number
    totalUsers: number
    topPct: number
}

export default function LeaderboardMyRankCard({ user, rank, totalUsers, topPct }: Props) {
    const level = getLevel(user.points ?? 0)

    return (
        <View style={[styles.card, shadows.lg]}>
            <View style={styles.left}>
                <Text style={styles.rankNum}>#{rank}</Text>
                <Text style={styles.rankSub}>dari {totalUsers}</Text>
            </View>

            <View style={styles.center}>
                <Text style={styles.name}>{user.name.split(" ")[0]}</Text>
                <View style={styles.badges}>
                    <Text style={styles.level}>
                        {level.label} {"★".repeat(level.stars)}
                    </Text>
                    <View style={styles.pctWrap}>
                        <TrendingUp size={10} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.pct}>Top {topPct}%</Text>
                    </View>
                </View>
            </View>

            <View style={styles.right}>
                <Trophy size={16} color="#FCD34D" />
                <Text style={styles.points}>
                    {(user.points ?? 0).toLocaleString("id-ID")}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.brand[500],
        borderRadius: radius.xl,
        padding: 16,
        marginBottom: 12,
        gap: 14,
    },
    left: { alignItems: "center" },
    rankNum: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize["2xl"],
        color: "#FCD34D",
    },
    rankSub: {
        fontFamily: fontFamily.regular,
        fontSize: 9,
        color: "rgba(255,255,255,0.6)",
    },
    center: { flex: 1 },
    name: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: "#fff",
    },
    badges: { flexDirection: "row", gap: 8, marginTop: 4 },
    level: {
        fontFamily: fontFamily.semibold,
        fontSize: 10,
        color: "#FCD34D",
    },
    pctWrap: { flexDirection: "row", alignItems: "center", gap: 3 },
    pct: {
        fontFamily: fontFamily.medium,
        fontSize: 10,
        color: "rgba(255,255,255,0.8)",
    },
    right: { alignItems: "center", gap: 2 },
    points: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: "#fff",
    },
})