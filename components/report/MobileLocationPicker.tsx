import { useState, useEffect, useRef } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import { MapPin, Locate, Check } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"

type Props = {
    latitude: string
    longitude: string
    onChange: (lat: string, lng: string) => void
}

const DEFAULT_REGION = {
    latitude: -6.4,
    longitude: 106.816666,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
}

export default function MobileLocationPicker({
    latitude,
    longitude,
    onChange,
}: Props) {
    const mapRef = useRef<MapView>(null)
    const [locating, setLocating] = useState(false)

    const lat = latitude ? parseFloat(latitude) : NaN
    const lng = longitude ? parseFloat(longitude) : NaN
    const hasCoords = !isNaN(lat) && !isNaN(lng)

    const handleLocate = async () => {
        setLocating(true)
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                setLocating(false)
                return
            }
            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            })
            const newLat = loc.coords.latitude.toFixed(6)
            const newLng = loc.coords.longitude.toFixed(6)
            onChange(newLat, newLng)

            mapRef.current?.animateToRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            })
        } catch {
        } finally {
            setLocating(false)
        }
    }

    const handleMapPress = (e: any) => {
        const { latitude: newLat, longitude: newLng } =
            e.nativeEvent.coordinate
        onChange(newLat.toFixed(6), newLng.toFixed(6))
    }

    // Auto-detect on mount
    useEffect(() => {
        if (!hasCoords) handleLocate()
    }, [])

    return (
        <View>
            {/* Label */}
            <View style={styles.labelRow}>
                <View style={styles.labelIcon}>
                    <MapPin size={12} color={colors.brand[500]} />
                </View>
                <Text style={styles.label}>Lokasi Laporan</Text>
            </View>

            <Text style={styles.hint}>
                Ketuk peta untuk menandai lokasi, atau gunakan GPS
            </Text>

            {/* Map */}
            <View style={[styles.mapWrap, shadows.sm]}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={
                        hasCoords
                            ? {
                                  latitude: lat,
                                  longitude: lng,
                                  latitudeDelta: 0.005,
                                  longitudeDelta: 0.005,
                              }
                            : DEFAULT_REGION
                    }
                    onPress={handleMapPress}
                >
                    {hasCoords && (
                        <Marker
                            coordinate={{ latitude: lat, longitude: lng }}
                            pinColor={colors.brand[500]}
                        />
                    )}
                </MapView>

                {/* Locate button overlay */}
                <TouchableOpacity
                    onPress={handleLocate}
                    disabled={locating}
                    style={[styles.locateBtn, shadows.md]}
                    activeOpacity={0.85}
                >
                    {locating ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.brand[500]}
                        />
                    ) : (
                        <Locate size={16} color={colors.brand[500]} />
                    )}
                </TouchableOpacity>
            </View>

            {/* Coordinates display */}
            {hasCoords && (
                <View style={styles.coordsRow}>
                    <Check size={12} color={colors.brand[500]} />
                    <Text style={styles.coordsText}>
                        {lat.toFixed(5)}, {lng.toFixed(5)}
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
    },
    labelIcon: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: colors.brand[50],
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.base,
        color: colors.text.secondary,
    },
    hint: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginBottom: 8,
    },
    mapWrap: {
        height: 200,
        borderRadius: radius.lg,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.cream[300],
        position: "relative",
    },
    map: {
        flex: 1,
    },
    locateBtn: {
        position: "absolute",
        bottom: 10,
        right: 10,
        width: 38,
        height: 38,
        borderRadius: radius.md,
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        justifyContent: "center",
        alignItems: "center",
    },
    coordsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 8,
    },
    coordsText: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.sm,
        color: colors.brand[500],
    },
})