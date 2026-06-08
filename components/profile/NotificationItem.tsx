import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { FileText, MessageSquare, RefreshCw, Trophy } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius } from "@/lib/theme"
import type { Notification } from "@/lib/types"

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; bg: string }> = {
    new_report: {
        icon: <FileText size={14} color={colors.brand[500]} />,
        bg: colors.brand[50],
    },
    status_update: {
        icon: <RefreshCw size={14} color="#92400E" />,
        bg: "#FEF3C7",
    },
    comment: {
        icon: <MessageSquare size={14} color="#1E40AF" />,
        bg: "#DBEAFE",
    },
    points_earned: {
        icon: <Trophy size={14} color="#F59E0B" />,
        bg: "#FEF3C7",
    },
}

export function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60_000)
    if (mins < 1) return "Baru saja"
    if (mins < 60) return `${mins} menit lalu`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} jam lalu`
    return `${Math.floor(hours / 24)} hari lalu`
}

interface Props {
    notification: Notification
    onPress: () => void
}

export default function NotificationItem({ notification: n, onPress }: Props) {
    const config = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.new_report

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.item, !n.read && styles.itemUnread]}
            activeOpacity={0.6}
        >
            <View style={[styles.iconWrap, { backgroundColor: config.bg }]}>
                {config.icon}
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.message} numberOfLines={2}>{n.message}</Text>
                <Text style={styles.time}>{timeAgo(n.created_at)}</Text>
            </View>

            {!n.read && <View style={styles.dot} />}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.cream[200],
    },
    itemUnread: {
        backgroundColor: colors.brand[50] + "30",
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: radius.md,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 2,
    },
    content: { flex: 1, minWidth: 0 },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.base,
        color: colors.text.primary,
    },
    message: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.muted,
        marginTop: 2,
        lineHeight: 16,
    },
    time: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#F59E0B",
        marginTop: 6,
    },
})