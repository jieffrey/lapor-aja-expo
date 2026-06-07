import { useEffect, useState, useMemo, useCallback } from "react"
import { ScrollView, StyleSheet, RefreshControl } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import api from "@/lib/api"
import { useAuthStore } from "@/stores/auth.store"
import { colors } from "@/lib/theme"
import type { Report } from "@/lib/types"
import HomeHeader from "@/components/home/HomeHeader"
import HomeStats from "@/components/home/HomeStats"
import HomeLevelCard from "@/components/home/HomeLevelCard"
import HomeNearby from "@/components/home/HomeNearby"
import HomeRecent from "@/components/home/HomeRecent"
import * as Location from "expo-location"

type Coords = { lat: number; lng: number }
type NearbyReport = Report & { distance: number }

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

export default function HomeScreen() {
    const insets = useSafeAreaInsets()
    const { user, refreshPoints } = useAuthStore()

    const [allReports, setAllReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    // Location
    const [coords, setCoords] = useState<Coords | null>(null)
    const [locating, setLocating] = useState(false)
    const [locError, setLocError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            const [reportsRes, notifRes] = await Promise.all([
                api.get("/reports"),
                api.get("/notifications/unread-count"),
            ])
            setAllReports(reportsRes.data.data ?? [])
            setUnreadCount(notifRes.data.data?.count ?? 0)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    const requestLocation = useCallback(async () => {
        setLocating(true)
        setLocError(null)
        try {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                setLocError("Izin lokasi ditolak")
                setLocating(false)
                return
            }
            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            })
            setCoords({
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
            })
        } catch {
            setLocError("Gagal mendapatkan lokasi")
        } finally {
            setLocating(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
        requestLocation()
        refreshPoints()
    }, [fetchData, requestLocation, refreshPoints])

    const onRefresh = async () => {
        setRefreshing(true)
        await Promise.all([fetchData(), refreshPoints()])
        setRefreshing(false)
    }

    // Derived data
    const userId = user?.id
    const myReports = useMemo(
        () => allReports.filter((r) => r.user_id === userId),
        [allReports, userId]
    )
    const myRecent = useMemo(
        () =>
            [...myReports]
                .sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                )
                .slice(0, 5),
        [myReports]
    )
    const stats = useMemo(
        () => ({
            total: myReports.length,
            resolved: myReports.filter((r) => r.status === "Resolved").length,
            inProgress: myReports.filter((r) => r.status === "In Progress")
                .length,
            pending: myReports.filter((r) => r.status === "Pending").length,
        }),
        [myReports]
    )
    const nearbyReports: NearbyReport[] = useMemo(() => {
        if (!coords) return []
        return allReports
            .filter((r) => r.latitude && r.longitude)
            .map((r) => ({
                ...r,
                distance: haversine(coords, {
                    lat: parseFloat(String(r.latitude)),
                    lng: parseFloat(String(r.longitude)),
                }),
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 6)
    }, [allReports, coords])

    if (!user) return null

    return (
        <ScrollView
            style={[styles.container, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colors.brand[500]}
                    colors={[colors.brand[500]]}
                />
            }
        >
            <HomeHeader user={user} unreadCount={unreadCount} />

            <HomeStats {...stats} />

            <HomeLevelCard points={user.points} />

            <HomeNearby
                reports={nearbyReports}
                loading={locating}
                error={locError}
                onRetry={requestLocation}
            />

            <HomeRecent reports={myRecent} loading={loading} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cream[100],
    },
    content: {
        gap: 16,
        paddingBottom: 100,
    },
})