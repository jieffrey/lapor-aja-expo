import { useState, useCallback } from "react"
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from "react-native"
import { MapPin, Search, Check, X, Locate } from "lucide-react-native"
import * as Location from "expo-location"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"

type Props = {
    latitude: string
    longitude: string
    onChange: (lat: string, lng: string) => void
}

type SearchResult = {
    place_id: number
    display_name: string
    lat: string
    lon: string
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null

export default function LocationSearchPicker({
    latitude,
    longitude,
    onChange,
}: Props) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [searching, setSearching] = useState(false)
    const [locating, setLocating] = useState(false)
    const [selectedName, setSelectedName] = useState("")

    const hasCoords = !!latitude && !!longitude

    // Debounced search via Nominatim
    const handleSearch = useCallback(
        (text: string) => {
            setQuery(text)

            if (searchTimeout) clearTimeout(searchTimeout)

            if (text.trim().length < 3) {
                setResults([])
                return
            }

            searchTimeout = setTimeout(async () => {
                setSearching(true)
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            text
                        )}&countrycodes=id&limit=5&addressdetails=1`,
                        {
                            headers: {
                                "User-Agent": "LaporAja-Mobile/1.0",
                            },
                        }
                    )
                    const data = await res.json()
                    setResults(data)
                } catch (e) {
                    console.error("Geocoding failed:", e)
                } finally {
                    setSearching(false)
                }
            }, 500)
        },
        []
    )

    const handleSelectResult = (item: SearchResult) => {
        onChange(
            parseFloat(item.lat).toFixed(6),
            parseFloat(item.lon).toFixed(6)
        )
        setSelectedName(item.display_name.split(",").slice(0, 3).join(", "))
        setQuery("")
        setResults([])
    }

    const handleGPS = async () => {
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
            onChange(
                loc.coords.latitude.toFixed(6),
                loc.coords.longitude.toFixed(6)
            )
            setSelectedName("Lokasi GPS saat ini")
        } catch {
        } finally {
            setLocating(false)
        }
    }

    const handleClear = () => {
        onChange("", "")
        setSelectedName("")
        setQuery("")
        setResults([])
    }

    return (
        <View>
            {/* Label */}
            <View style={styles.labelRow}>
                <View style={styles.labelIcon}>
                    <MapPin size={12} color={colors.brand[500]} />
                </View>
                <Text style={styles.label}>Lokasi Laporan</Text>
            </View>

            {/* Search input */}
            <View style={styles.searchRow}>
                <View style={styles.searchWrap}>
                    <Search size={14} color={colors.text.placeholder} />
                    <TextInput
                        value={query}
                        onChangeText={handleSearch}
                        placeholder="Cari nama jalan, kelurahan..."
                        placeholderTextColor={colors.text.placeholder}
                        style={styles.searchInput}
                    />
                    {searching && (
                        <ActivityIndicator
                            size="small"
                            color={colors.brand[500]}
                        />
                    )}
                </View>

                {/* GPS button */}
                <TouchableOpacity
                    onPress={handleGPS}
                    disabled={locating}
                    style={[styles.gpsBtn, shadows.sm]}
                    activeOpacity={0.7}
                >
                    {locating ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.brand[500]}
                        />
                    ) : (
                        <Locate size={18} color={colors.brand[500]} />
                    )}
                </TouchableOpacity>
            </View>

            {/* Search results dropdown */}
            {results.length > 0 && (
                <View style={[styles.dropdown, shadows.md]}>
                    {results.map((item) => (
                        <TouchableOpacity
                            key={item.place_id}
                            onPress={() => handleSelectResult(item)}
                            style={styles.dropdownItem}
                            activeOpacity={0.6}
                        >
                            <MapPin
                                size={12}
                                color={colors.brand[500]}
                            />
                            <Text
                                style={styles.dropdownText}
                                numberOfLines={2}
                            >
                                {item.display_name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Selected location display */}
            {hasCoords && (
                <View style={styles.selectedWrap}>
                    <View style={styles.selectedContent}>
                        <Check size={12} color={colors.brand[500]} />
                        <View style={styles.selectedText}>
                            <Text style={styles.selectedName} numberOfLines={1}>
                                {selectedName || "Lokasi dipilih"}
                            </Text>
                            <Text style={styles.selectedCoords}>
                                {parseFloat(latitude).toFixed(5)},{" "}
                                {parseFloat(longitude).toFixed(5)}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleClear}>
                        <X size={14} color={colors.text.placeholder} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Hint */}
            {!hasCoords && (
                <Text style={styles.hint}>
                    Cari alamat atau gunakan GPS untuk lokasi saat ini
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
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
    searchRow: {
        flexDirection: "row",
        gap: 8,
    },
    searchWrap: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    searchInput: {
        flex: 1,
        fontFamily: fontFamily.regular,
        fontSize: fontSize.base,
        color: colors.text.primary,
        padding: 0,
    },
    gpsBtn: {
        width: 44,
        height: 44,
        borderRadius: radius.md,
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        justifyContent: "center",
        alignItems: "center",
    },
    dropdown: {
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius.md,
        marginTop: 4,
        overflow: "hidden",
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.cream[200],
    },
    dropdownText: {
        flex: 1,
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.secondary,
        lineHeight: 18,
    },
    selectedWrap: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.brand[50] + "50",
        borderWidth: 1,
        borderColor: colors.brand[200],
        borderRadius: radius.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 8,
    },
    selectedContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
        marginRight: 8,
    },
    selectedText: {
        flex: 1,
    },
    selectedName: {
        fontFamily: fontFamily.semibold,
        fontSize: fontSize.sm,
        color: colors.brand[500],
    },
    selectedCoords: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 1,
    },
    hint: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 8,
    },
})