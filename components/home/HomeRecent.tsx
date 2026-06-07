import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { ArrowRight, Inbox } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { Report, ReportStatus } from "@/lib/types"

type Props = {
    reports: Report[]
    loading: boolean
}

const STATUS_BG: Record<ReportStatus, { bg: string; text: string }> = {
    Pending: { bg: colors.cream[200], text: "#5F5E5A" },
    "In Progress": { bg: "#FEF3C7", text: "#92400E" },
    Resolved: { bg: "#D1FAE5", text: "#065F46" },
    Rejected: { bg: "#FEE2E2", text: "#991B1B" },
}

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    })

export default function HomeRecent({ reports, loading }: Props) {
    const router = useRouter()

    return (
        <View style={[styles.card, shadows.sm]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Laporan Saya</Text>
                <TouchableOpacity
                    onPress={() =>
                        router.push("/(main)/(profile)/my-reports" as any)
                    }
                    style={styles.seeAll}
                >
                    <Text style={styles.seeAllText}>Semua</Text>
                    <ArrowRight size={11} color={colors.brand[500]} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <Text style={styles.mutedText}>Memuat...</Text>
                </View>
            ) : reports.length === 0 ? (
                <View style={styles.center}>
                    <Inbox
                        size={28}
                        color={colors.brand[500]}
                        style={{ marginBottom: 8 }}
                    />
                    <Text style={styles.emptyTitle}>Belum ada laporan</Text>
                    <Text style={styles.mutedText}>
                        Mulai buat laporan pertamamu
                    </Text>
                </View>
            ) : (
                reports.map((r, idx) => {
                    const statusStyle = STATUS_BG[r.status]
                    return (
                        <TouchableOpacity
                            key={r.id}
                            activeOpacity={0.6}
                            onPress={() =>
                                router.push(
                                    `/(main)/(profile)/report/${r.id}` as any
                                )
                            }
                            style={[
                                styles.row,
                                idx < reports.length - 1 && styles.rowBorder,
                                { backgroundColor: idx % 2 !== 0 ? colors.cream[100] : colors.cream[50] },
                            ]}
                        >
                            <View style={styles.rowContent}>
                                <Text
                                    style={styles.rowTitle}
                                    numberOfLines={1}
                                >
                                    {r.title}
                                </Text>
                                <Text style={styles.rowMeta}>
                                    {r.category} · {formatDate(r.created_at)}
                                </Text>
                            </View>

                            {/* Status badge */}
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: statusStyle.bg },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        { color: statusStyle.text },
                                    ]}
                                >
                                    {r.status}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
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
        paddingVertical: 36,
        alignItems: "center",
    },
    emptyTitle: {
        fontFamily: fontFamily.semibold,
        fontSize: fontSize.base,
        color: colors.text.secondary,
    },
    mutedText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.placeholder,
        marginTop: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 13,
        gap: 10,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.cream[200],
    },
    rowContent: {
        flex: 1,
        minWidth: 0,
    },
    rowTitle: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.base,
        color: colors.text.primary,
    },
    rowMeta: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 3,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.full,
    },
    statusText: {
        fontFamily: fontFamily.bold,
        fontSize: 10,
    },
})