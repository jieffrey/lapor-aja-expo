import { useEffect, useMemo, useState } from "react"
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArrowLeft } from "lucide-react-native"
import api from "@/lib/api"
import { useAuthStore } from "@/stores/auth.store"
import { colors, fontFamily, fontSize } from "@/lib/theme"
import type { User } from "@/lib/types"
import LeaderboardMyRankCard from "@/components/leaderboard/LeaderboardMyRankCard"
import LeaderboardRow from "@/components/leaderboard/LeaderboardRow"

export default function LeaderboardScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const currentUser = useAuthStore((s) => s.user)

    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/user/leaderboard")
            .then((res) => setUsers(res.data.data ?? []))
            .finally(() => setLoading(false))
    }, [])

    const sorted = useMemo(
        () => [...users].sort((a, b) => (b.points ?? 0) - (a.points ?? 0)),
        [users]
    )

    const myRank = sorted.findIndex((u) => u.id === currentUser?.id) + 1
    const topPct = sorted.length > 0 ? Math.round((myRank / sorted.length) * 100) : 100

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
                    <ArrowLeft size={20} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Leaderboard</Text>
                <View style={{ width: 20 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.brand[500]} />
                </View>
            ) : (
                <FlatList
                    data={sorted}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        currentUser && myRank > 0 ? (
                            <LeaderboardMyRankCard
                                user={currentUser}
                                rank={myRank}
                                totalUsers={sorted.length}
                                topPct={topPct}
                            />
                        ) : null
                    }
                    renderItem={({ item, index }) => (
                        <LeaderboardRow
                            user={item}
                            rank={index + 1}
                            isMe={item.id === currentUser?.id}
                        />
                    )}
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
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerTitle: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: colors.text.primary,
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    listContent: { paddingHorizontal: 20, paddingBottom: 100, gap: 8 },
})