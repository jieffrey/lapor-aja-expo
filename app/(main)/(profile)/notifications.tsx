import { useCallback, useEffect, useState } from "react"
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArrowLeft, CheckCheck, Inbox } from "lucide-react-native"
import api from "@/lib/api"
import { colors, fontFamily, fontSize } from "@/lib/theme"
import type { Notification } from "@/lib/types"
import NotificationItem from "@/components/profile/NotificationItem"

export default function NotificationsScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchNotifs = useCallback(async () => {
        try {
            const res = await api.get("/notifications")
            setNotifications(res.data.data ?? [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchNotifs() }, [fetchNotifs])

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchNotifs()
        setRefreshing(false)
    }

    const handleMarkAllRead = async () => {
        try {
            await api.patch("/notifications/read-all")
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        } catch { }
    }

    const handlePress = async (notif: Notification) => {
        if (!notif.read) {
            try {
                await api.patch(`/notifications/${notif.id}/read`)
                setNotifications((prev) =>
                    prev.map((n) => n.id === notif.id ? { ...n, read: true } : n)
                )
            } catch { }
        }
        if (notif.report_id) {
            router.push(`/(main)/(profile)/report/${notif.report_id}` as any)
        }
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
                    <ArrowLeft size={20} color={colors.text.primary} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Notifikasi</Text>
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={handleMarkAllRead} hitSlop={8}>
                        <CheckCheck size={18} color={colors.brand[500]} />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.brand[500]} />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <NotificationItem
                            notification={item}
                            onPress={() => handlePress(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.brand[500]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Inbox size={32} color={colors.brand[500]} />
                            <Text style={styles.emptyText}>Belum ada notifikasi</Text>
                        </View>
                    }
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.cream[100] },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 14,
        gap: 12,
    },
    headerCenter: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    headerTitle: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: colors.text.primary,
    },
    unreadBadge: {
        backgroundColor: "#F59E0B",
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
    },
    unreadBadgeText: {
        fontFamily: fontFamily.bold,
        fontSize: 10,
        color: "#fff",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingVertical: 60,
    },
    emptyText: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.base,
        color: colors.text.placeholder,
    },
    listContent: { paddingBottom: 100 },
})