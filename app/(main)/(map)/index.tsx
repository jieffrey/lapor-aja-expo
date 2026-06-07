import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useRouter } from "expo-router"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import { Locate } from "lucide-react-native"

import MapCategoryFilter, { CAT_PIN } from "@/components/map/MapCategoryFilter"
import MapDetailSheet from "@/components/map/MapDetailSheet"
import api from "@/lib/api"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { Report } from "@/lib/types"

export default function MapScreen() {
    const router = useRouter()
    const mapRef = useRef<MapView>(null)

    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState("Semua")
    const [selected, setSelected] = useState<Report | null>(null)

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

    useEffect(() => { fetchReports() }, [fetchReports])

    const geoReports = useMemo(
        () =>
            reports
                .filter((r) => r.latitude && r.longitude)
                .filter((r) => category === "Semua" || r.category === category),
        [reports, category]
    )

    const handleLocate = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") return
        const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        })
        mapRef.current?.animateToRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        })
    }

    const handleMarkerPress = (report: Report) => {
        setSelected(report)
        mapRef.current?.animateToRegion({
            latitude: parseFloat(String(report.latitude)),
            longitude: parseFloat(String(report.longitude)),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        })
    }

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.brand[500]} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: -6.4,
                    longitude: 106.816666,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                }}
                onPress={() => setSelected(null)}
            >
                {geoReports.map((r) => (
                    <Marker
                        key={r.id}
                        coordinate={{
                            latitude: parseFloat(String(r.latitude)),
                            longitude: parseFloat(String(r.longitude)),
                        }}
                        pinColor={CAT_PIN[r.category] ?? "#6B7280"}
                        onPress={() => handleMarkerPress(r)}
                    />
                ))}
            </MapView>

            <MapCategoryFilter active={category} onChange={setCategory} />

            <View style={[styles.countBadge, shadows.sm]}>
                <Text style={styles.countText}>{geoReports.length} laporan</Text>
            </View>

            <TouchableOpacity
                onPress={handleLocate}
                style={[styles.locateBtn, shadows.md]}
                activeOpacity={0.85}
            >
                <Locate size={18} color={colors.brand[500]} />
            </TouchableOpacity>

            {selected && (
                <MapDetailSheet
                    report={selected}
                    onClose={() => setSelected(null)}
                    onDetail={() =>
                        router.push(`/(main)/(explore)/report/${selected.id}` as any)
                    }
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.cream[100],
    },
    map: { flex: 1 },
    countBadge: {
        position: "absolute",
        top: 100,
        left: 16,
        backgroundColor: "rgba(252,251,248,0.95)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.cream[300],
    },
    countText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xs,
        color: colors.brand[500],
    },
    locateBtn: {
        position: "absolute",
        bottom: 24,
        right: 16,
        width: 44,
        height: 44,
        borderRadius: radius.md,
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        justifyContent: "center",
        alignItems: "center",
    },
})