import { View, Text, StyleSheet } from "react-native"
import { Trophy } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"

type Props = { points: number }

function getLevel(points: number) {
    if (points >= 500) return { label: "Warga Aktif", stars: 3, next: 1000 }
    if (points >= 200) return { label: "Kontributor", stars: 2, next: 500 }
    if (points >= 50) return { label: "Pemula", stars: 1, next: 200 }
    return { label: "Baru", stars: 0, next: 50 }
}

export default function HomeLevelCard({ points }: Props) {
    const level = getLevel(points)
    const pct = Math.min(Math.round((points / level.next) * 100), 100)

    return (
        <View style={[styles.card, shadows.sm]}>
            <View style={styles.row}>
                {/* Left — level info */}
                <View style={[styles.iconWrap, shadows.amber]}>
                    <Trophy size={16} color="#fff" />
                </View>
                <View style={styles.levelInfo}>
                    <Text style={styles.levelLabel}>{level.label}</Text>
                    <Text style={styles.stars}>
                        {"★".repeat(level.stars)}
                        {"☆".repeat(3 - level.stars)}
                    </Text>
                </View>

                {/* Right — points */}
                <View style={styles.pointsWrap}>
                    <Text style={styles.pointsValue}>
                        {points.toLocaleString("id-ID")}
                    </Text>
                    <Text style={styles.pointsLabel}>poin</Text>
                </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressSection}>
                <View style={styles.progressMeta}>
                    <Text style={styles.progressLabel}>
                        Level berikutnya
                    </Text>
                    <Text style={styles.progressPct}>{pct}%</Text>
                </View>
                <View style={styles.progressBg}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${pct}%` },
                        ]}
                    />
                </View>
                <Text style={styles.progressCount}>
                    {points} / {level.next} poin
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius.xl,
        marginHorizontal: 20,
        padding: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: radius.md,
        backgroundColor: colors.accent.amber,
        justifyContent: "center",
        alignItems: "center",
    },
    levelInfo: {
        flex: 1,
    },
    levelLabel: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.md,
        color: colors.text.primary,
    },
    stars: {
        fontSize: fontSize.sm,
        color: colors.accent.amber,
        marginTop: 1,
    },
    pointsWrap: {
        alignItems: "flex-end",
    },
    pointsValue: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize.lg,
        color: colors.accent.amber,
    },
    pointsLabel: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
    },
    progressSection: {
        marginTop: 14,
    },
    progressMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    progressLabel: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.xs,
        color: colors.text.muted,
    },
    progressPct: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xs,
        color: colors.brand[500],
    },
    progressBg: {
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.cream[300],
    },
    progressFill: {
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.accent.amber,
    },
    progressCount: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 4,
    },
})