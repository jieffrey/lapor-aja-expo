import { useEffect, useState, useMemo, useCallback } from "react"
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Compass } from "lucide-react-native"
import * as Location from "expo-location"
import api from "@/lib/api"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { Report } from "@/lib/types"
import ExploreFilters, {
    type SortTab,
} from "@/components/explore/ExploreFilters"
import ExploreCard from "@/components/explore/ExploreCard"

type Coords = { lat: number; lng: number }

function haversine(a: Coords, b: Coords): number {
    const R = 6371
    const dLat = ((b.lat - a.lat) * Math.PI) / 180
    const dLng = ((b.lng - a.lng) * Math.PI) / 180
    const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

export default function ExploreScreen() {
    const insets = useSafeAreaInsets()
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [activeTab, setActiveTab] = useState<SortTab>("terbaru")
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("Semua")
    const [coords, setCoords] = useState<Coords | null>(null)

    const fetchReports = useCallback(async () => {
        try {
            const res = await api.get("/reports")
            setReports(res.data.data ?? [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    // Request GPS when switching to terdekat
    useEffect(() => {
        if (activeTab !== "terdekat" || coords) return
            ; (async () => {
                const { status } =
                    await Location.requestForegroundPermissionsAsync()
                if (status !== "granted") return
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                })
                setCoords({
                    lat: loc.coords.latitude,
                    lng: loc.coords.longitude,
                })
            })()
    }, [activeTab, coords])

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchReports()
        setRefreshing(false)
    }

    // Enrich with distance
    const enriched = useMemo(
        () =>
            reports.map((r) => ({
                ...r,
                distance:
                    coords && r.latitude && r.longitude
                        ? haversine(coords, {
                            lat: parseFloat(String(r.latitude)),
                            lng: parseFloat(String(r.longitude)),
                        })
                        : undefined,
            })),
        [reports, coords]
    )

    // Filter
    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return enriched.filter(
            (r) =>
                (category === "Semua" || r.category === category) &&
                (r.title.toLowerCase().includes(q) ||
                    r.description.toLowerCase().includes(q) ||
                    r.name.toLowerCase().includes(q))
        )
    }, [enriched, search, category])

    // Sort
    const sorted = useMemo(() => {
        const arr = [...filtered]
        switch (activeTab) {
            case "terbaru":
                return arr.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                )
            case "populer":
                return arr.sort(
                    (a, b) =>
                        ((b as any).comment_count ?? 0) - ((a as any).comment_count ?? 0)
                )
            case "terdekat":
                return arr
                    .filter((r) => r.distance !== undefined)
                    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
            default:
                return arr
        }
    }, [filtered, activeTab])

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={[styles.headerIcon, shadows.md]}>
                    <Compass size={20} color="#fff" />
                </View>
                <View>
                    <Text style={styles.headerTitle}>Jelajahi</Text>
                    <Text style={styles.headerSub}>
                        {reports.length} laporan dari seluruh warga
                    </Text>
                </View>
            </View>

            {/* Filters */}
            <ExploreFilters
                activeTab={activeTab}
                onTabChange={setActiveTab}
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
            />

            {/* List */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator
                        size="large"
                        color={colors.brand[500]}
                    />
                </View>
            ) : (
                <FlatList
                    data={sorted}
                    keyExtractor={(item) => String(item.id)}
                    numColumns={2}
                    columnWrapperStyle={styles.gridRow}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.gridItem}>
                            <ExploreCard report={item} />
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>
                                {search || category !== "Semua"
                                    ? "Tidak ada hasil"
                                    : "Belum ada laporan"}
                            </Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.brand[500]}
                            colors={[colors.brand[500]]}
                        />
                    }
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cream[100],
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: radius.lg,
        backgroundColor: colors.brand[300],
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize.xl,
        color: colors.text.primary,
        letterSpacing: -0.3,
    },
    headerSub: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.muted,
        marginTop: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 100,
    },
    gridRow: {
        gap: 10,
        marginBottom: 10,
    },
    gridItem: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.base,
        color: colors.text.placeholder,
    },
})