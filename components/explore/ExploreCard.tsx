import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useRouter } from "expo-router"
import { Clock, MessageSquare, MapPin, ImageIcon } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { Report } from "@/lib/types"

type Props = {
    report: Report & { distance?: number; comment_count?: number }
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
    Pending: { bg: colors.cream[200], text: "#5F5E5A" },
    "In Progress": { bg: "#FEF3C7", text: "#92400E" },
    Resolved: { bg: "#D1FAE5", text: "#065F46" },
    Rejected: { bg: "#FEE2E2", text: "#991B1B" },
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60_000)
    if (mins < 1) return "Baru saja"
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}j`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}h`
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    })
}

function formatDist(km: number) {
    return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
}

export default function ExploreCard({ report: r }: Props) {
    const router = useRouter()
    const status = STATUS_STYLE[r.status] ?? STATUS_STYLE.Pending
    const thumb = r.image_before ?? (r.images?.[0] ?? null)

    return (
        <TouchableOpacity
            onPress={() => router.push(`/(main)/(explore)/report/${r.id}` as any)}
            style={[styles.card, shadows.sm]}
            activeOpacity={0.85}
        >
            {/* Thumbnail */}
            <View style={styles.thumbWrap}>
                {thumb ? (
                    <Image source={{ uri: thumb }} style={styles.thumb} />
                ) : (
                    <View style={styles.thumbPlaceholder}>
                        <ImageIcon size={24} color={colors.text.placeholder} />
                    </View>
                )}

                {/* Status badge overlay */}
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: status.bg },
                    ]}
                >
                    <Text style={[styles.statusText, { color: status.text }]}>
                        {r.status}
                    </Text>
                </View>

                {/* Distance chip */}
                {r.distance !== undefined && (
                    <View style={styles.distChip}>
                        <MapPin size={8} color={colors.brand[500]} />
                        <Text style={styles.distText}>
                            {formatDist(r.distance)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {r.title}
                </Text>
                <Text style={styles.desc} numberOfLines={2}>
                    {r.description}
                </Text>

                {/* Meta */}
                <View style={styles.meta}>
                    <View style={styles.catBadge}>
                        <Text style={styles.catText}>{r.category}</Text>
                    </View>
                    <View style={styles.metaRight}>
                        <Clock size={10} color={colors.text.placeholder} />
                        <Text style={styles.metaText}>
                            {timeAgo(r.created_at)}
                        </Text>
                        {(r.comment_count ?? 0) > 0 && (
                            <>
                                <MessageSquare
                                    size={10}
                                    color={colors.text.placeholder}
                                />
                                <Text style={styles.metaText}>
                                    {r.comment_count}
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            </View>

            {/* Reporter footer */}
            <View style={styles.footer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {r.name?.charAt(0).toUpperCase() ?? "?"}
                    </Text>
                </View>
                <Text style={styles.reporterName} numberOfLines={1}>
                    {r.name}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius.xl,
        overflow: "hidden",
    },
    thumbWrap: {
        height: 140,
        backgroundColor: colors.cream[200],
        position: "relative",
    },
    thumb: {
        width: "100%",
        height: "100%",
    },
    thumbPlaceholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    statusBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.full,
    },
    statusText: {
        fontFamily: fontFamily.bold,
        fontSize: 9,
    },
    distChip: {
        position: "absolute",
        bottom: 8,
        right: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: "rgba(252,251,248,0.92)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: radius.full,
    },
    distText: {
        fontFamily: fontFamily.bold,
        fontSize: 9,
        color: colors.brand[500],
    },
    content: {
        padding: 12,
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.md,
        color: colors.text.primary,
        lineHeight: 18,
    },
    desc: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.placeholder,
        marginTop: 4,
        lineHeight: 16,
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
    },
    catBadge: {
        backgroundColor: colors.brand[50],
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: radius.full,
    },
    catText: {
        fontFamily: fontFamily.semibold,
        fontSize: 9,
        color: colors.brand[500],
    },
    metaRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontFamily: fontFamily.regular,
        fontSize: 10,
        color: colors.text.placeholder,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: colors.cream[200],
        backgroundColor: colors.cream[100],
    },
    avatar: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.brand[500],
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        fontFamily: fontFamily.bold,
        fontSize: 9,
        color: "#fff",
    },
    reporterName: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.xs,
        color: colors.text.secondary,
        flex: 1,
    },
})