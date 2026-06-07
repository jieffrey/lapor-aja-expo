import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ArrowRight, Clock, ImageIcon, MapPin, X } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { Report } from "@/lib/types"

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
    Pending: { bg: colors.cream[200], text: "#5F5E5A" },
    "In Progress": { bg: "#FEF3C7", text: "#92400E" },
    Resolved: { bg: "#D1FAE5", text: "#065F46" },
    Rejected: { bg: "#FEE2E2", text: "#991B1B" },
}

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })

interface Props {
    report: Report
    onClose: () => void
    onDetail: () => void
}

export default function MapDetailSheet({ report: r, onClose, onDetail }: Props) {
    const status = STATUS_STYLE[r.status] ?? STATUS_STYLE.Pending
    const thumb = r.image_before ?? r.images?.[0] ?? null

    return (
        <View style={[styles.sheet, shadows.lg]}>
            <View style={styles.handle} />

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                <X size={16} color={colors.text.muted} />
            </TouchableOpacity>

            <View style={styles.thumb}>
                {thumb ? (
                    <Image source={{ uri: thumb }} style={styles.thumbImg} />
                ) : (
                    <View style={styles.thumbPlaceholder}>
                        <ImageIcon size={20} color={colors.text.placeholder} />
                    </View>
                )}
            </View>

            <View style={styles.badges}>
                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.badgeText, { color: status.text }]}>{r.status}</Text>
                </View>
                <View style={styles.catBadge}>
                    <Text style={styles.catText}>{r.category}</Text>
                </View>
            </View>

            <Text style={styles.title} numberOfLines={2}>{r.title}</Text>
            <Text style={styles.desc} numberOfLines={2}>{r.description}</Text>

            <View style={styles.meta}>
                <MapPin size={11} color={colors.text.placeholder} />
                <Text style={styles.metaText} numberOfLines={1}>{r.name}</Text>
                <Text style={styles.dot}>·</Text>
                <Clock size={11} color={colors.text.placeholder} />
                <Text style={styles.metaText}>{formatDate(r.created_at)}</Text>
            </View>

            <TouchableOpacity
                onPress={onDetail}
                style={[styles.detailBtn, shadows.brand]}
                activeOpacity={0.85}
            >
                <Text style={styles.detailBtnText}>Lihat Detail</Text>
                <ArrowRight size={14} color={colors.white} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    sheet: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.cream[50],
        borderTopLeftRadius: radius["2xl"],
        borderTopRightRadius: radius["2xl"],
        padding: 20,
        paddingBottom: 36,
    },
    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.cream[300],
        alignSelf: "center",
        marginBottom: 12,
    },
    closeBtn: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.cream[200],
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    thumb: {
        height: 120,
        borderRadius: radius.lg,
        overflow: "hidden",
        backgroundColor: colors.cream[200],
        marginBottom: 12,
    },
    thumbImg: { width: "100%", height: "100%" },
    thumbPlaceholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    badges: {
        flexDirection: "row",
        gap: 6,
        marginBottom: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.full,
    },
    badgeText: {
        fontFamily: fontFamily.bold,
        fontSize: 10,
    },
    catBadge: {
        backgroundColor: colors.brand[50],
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.full,
    },
    catText: {
        fontFamily: fontFamily.semibold,
        fontSize: 10,
        color: colors.brand[500],
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: colors.text.primary,
        lineHeight: 22,
    },
    desc: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.muted,
        marginTop: 4,
        lineHeight: 18,
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 10,
    },
    metaText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        flexShrink: 1,
    },
    dot: {
        color: colors.cream[300],
        fontSize: 10,
    },
    detailBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: colors.brand[500],
        paddingVertical: 13,
        borderRadius: radius.lg,
        marginTop: 14,
    },
    detailBtnText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.md,
        color: colors.white,
    },
})