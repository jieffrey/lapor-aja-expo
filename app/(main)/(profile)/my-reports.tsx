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
import { ArrowLeft, Inbox } from "lucide-react-native"
import api from "@/lib/api"
import { useAuthStore } from "@/stores/auth.store"
import { colors, fontFamily, fontSize, radius } from "@/lib/theme"
import type { Report } from "@/lib/types"
import MyReportCard from "@/components/profile/MyReportCard"

export default function MyReportsScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const user = useAuthStore((s) => s.user)

    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchReports = useCallback(async () => {
        try {
            const res = await api.get("/reports")
            const mine = (res.data.data ?? []).filter(
                (r: Report) => r.user_id === user?.id
            )
            setReports(
                mine.sort(
                    (a: Report, b: Report) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
            )
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [user?.id])

    useEffect(() => { fetchReports() }, [fetchReports])

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchReports()
        setRefreshing(false)
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
                    <ArrowLeft size={20} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Laporan Saya</Text>
                <Text style={styles.headerCount}>{reports.length}</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.brand[500]} />
                </View>
            ) : (
                <FlatList
                    data={reports}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <MyReportCard
                            report={item}
                            onPress={() => router.push(`/(main)/(profile)/report/${item.id}` as any)}
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
                            <Text style={styles.emptyTitle}>Belum ada laporan</Text>
                            <Text style={styles.emptyText}>Mulai buat laporan pertamamu</Text>
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
    headerTitle: {
        flex: 1,
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: colors.text.primary,
    },
    headerCount: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.sm,
        color: colors.brand[500],
        backgroundColor: colors.brand[50],
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: radius.full,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingVertical: 60,
    },
    emptyTitle: {
        fontFamily: fontFamily.semibold,
        fontSize: fontSize.base,
        color: colors.text.secondary,
    },
    emptyText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.placeholder,
    },
    listContent: { paddingHorizontal: 20, paddingBottom: 100, gap: 8 },
})