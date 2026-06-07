import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors, fontFamily, fontSize, radius } from "@/lib/theme"

export const CATEGORIES = [
    "Semua",
    "Infrastruktur",
    "Lingkungan",
    "Kebersihan",
    "Keamanan",
    "Fasilitas Umum",
    "Lainnya",
]

export const CAT_PIN: Record<string, string> = {
    Infrastruktur: "#EA580C",
    Lingkungan: "#0F766E",
    Kebersihan: "#F59E0B",
    Keamanan: "#991B1B",
    "Fasilitas Umum": "#14B8A6",
    Lainnya: "#6B7280",
}

interface Props {
    active: string
    onChange: (category: string) => void
}

export default function MapCategoryFilter({ active, onChange }: Props) {
    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {CATEGORIES.map((c) => {
                    const isActive = active === c
                    const dotColor = CAT_PIN[c]
                    return (
                        <TouchableOpacity
                            key={c}
                            onPress={() => onChange(c)}
                            style={[styles.chip, isActive && styles.chipActive]}
                            activeOpacity={0.7}
                        >
                            {!isActive && dotColor && (
                                <View style={[styles.dot, { backgroundColor: dotColor }]} />
                            )}
                            <Text style={[styles.label, isActive && styles.labelActive]}>
                                {c}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        top: 56,
        left: 0,
        right: 0,
    },
    scroll: {
        paddingHorizontal: 16,
        gap: 6,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "rgba(252,251,248,0.95)",
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius.sm,
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    chipActive: {
        backgroundColor: colors.brand[500],
        borderColor: colors.brand[500],
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    label: {
        fontFamily: fontFamily.semibold,
        fontSize: fontSize.xs,
        color: colors.text.secondary,
    },
    labelActive: {
        color: colors.white,
    },
})