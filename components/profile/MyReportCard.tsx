import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ChevronRight, Clock } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { Report, ReportStatus } from "@/lib/types"

const STATUS_STYLE: Record<ReportStatus, { bg: string; text: string }> = {
    Pending: { bg: colors.cream[200], text: "#5F5E5A" },
    "In Progress": { bg: "#FEF3C7", text: "#92400E" },
    Resolved: { bg: "#D1FAE5", text: "#065F46" },
    Rejected: { bg: "#FEE2E2", text: "#991B1B" },
}

const STATUS_STRIP: Record<ReportStatus, string> = {
    Resolved: "#065F46",
    "In Progress": "#F59E0B",
    Rejected: "#991B1B",
    Pending: "#D1D5DB",
}

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })

interface Props {
    report: Report
    onPress: () => void
}

export default function MyReportCard({ report: r, onPress }: Props) {
    const status = STATUS_STYLE[r.status]

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.card, shadows.sm]}
            activeOpacity={0.7}
        >
            <View style={[styles.strip, { backgroundColor: STATUS_STRIP[r.status] ?? "#D1D5DB" }]} />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{r.title}</Text>
                <View style={styles.meta}>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.statusText, { color: status.text }]}>
                            {r.status}
                        </Text>
                    </View>
                    <Clock size={10} color={colors.text.placeholder} />
                    <Text style={styles.metaText}>{formatDate(r.created_at)}</Text>
                </View>
            </View>
            <ChevronRight size={16} color={colors.text.placeholder} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius.lg,
        paddingRight: 12,
        overflow: "hidden",
        gap: 10,
    },
    strip: {
        width: 4,
        alignSelf: "stretch",
        borderRadius: 2,
    },
    content: {
        flex: 1,
        paddingVertical: 14,
        paddingLeft: 8,
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.md,
        color: colors.text.primary,
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 6,
    },
    statusBadge: {
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: radius.full,
    },
    statusText: {
        fontFamily: fontFamily.bold,
        fontSize: 9,
    },
    metaText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
    },
})