import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { MapPin, ArrowRight, Locate } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { Report } from "@/lib/types"

type NearbyReport = Report & { distance: number }

type Props = {
    reports: NearbyReport[]
    loading: boolean
    error: string | null
    onRetry: () => void
}

const STATUS_COLOR: Record<string, string> = {
    Resolved: "#065F46",
    "In Progress": "#F59E0B",
    Rejected: "#991B1B",
    Pending: "#D1D5DB",
}

function formatDist(km: number) {
    return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
}

export default function HomeNearby({
    reports,
    loading,
    error,
    onRetry,
}: Props) {
    const router = useRouter()

    return (
        <View style={[styles.card, shadows.sm]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconWrap}>
                        <MapPin size={12} color={colors.brand[500]} />
                    </View>
                    <Text style={styles.title}>Laporan Sekitar</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push("/(main)/(map)" as any)}
                    style={styles.seeAll}
                >
                    <Text style={styles.seeAllText}>Buka peta</Text>
                    <ArrowRight size={11} color={colors.brand[500]} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.center}>
                    <Text style={styles.mutedText}>Mencari lokasimu...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Locate
                        size={24}
                        color={colors.accent.amber}
                        style={{ marginBottom: 8 }}
                    />
                    <Text style={styles.mutedText}>{error}</Text>
                    <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
                        <Text style={styles.retryText}>Coba lagi</Text>
                    </TouchableOpacity>
                </View>
            ) : reports.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.mutedText}>
                        Belum ada laporan di sekitarmu
                    </Text>
                </View>
            ) : (
                reports.slice(0, 5).map((r, idx) => (
                    <TouchableOpacity
                        key={r.id}
                        activeOpacity={0.6}
                        onPress={() =>
                            router.push(
                                `/(main)/(explore)/report/${r.id}` as any
                            )
                        }
                        style={[
                            styles.row,
                            idx < Math.min(reports.length, 5) - 1 &&
                            styles.rowBorder,
                        ]}
                    >
                        <View
                            style={[
                                styles.strip,
                                {
                                    backgroundColor:
                                        STATUS_COLOR[r.status] ?? "#D1D5DB",
                                },
                            ]}
                        />
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle} numberOfLines={1}>
                                {r.title}
                            </Text>
                            <View style={styles.rowMeta}>
                                <MapPin
                                    size={10}
                                    color={colors.text.placeholder}
                                />
                                <Text style={styles.rowMetaText}>
                                    {formatDist(r.distance)} · {r.category}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            )}
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
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.cream[200],
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    iconWrap: {
        width: 26,
        height: 26,
        borderRadius: radius.sm,
        backgroundColor: colors.brand[50],
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.md,
        color: colors.text.primary,
    },
    seeAll: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    seeAllText: {
        fontFamily: fontFamily.semibold,
        fontSize: fontSize.sm,
        color: colors.brand[500],
    },
    center: {
        paddingVertical: 32,
        alignItems: "center",
    },
    mutedText: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.base,
        color: colors.text.placeholder,
    },
    retryBtn: {
        marginTop: 10,
        backgroundColor: colors.brand[500],
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: radius.full,
    },
    retryText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.sm,
        color: "#fff",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.cream[200],
    },
    strip: {
        width: 3,
        height: 30,
        borderRadius: 2,
    },
    rowContent: {
        flex: 1,
    },
    rowTitle: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.base,
        color: colors.text.primary,
    },
    rowMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 3,
    },
    rowMetaText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
    },
})