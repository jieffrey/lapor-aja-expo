import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native"
import { Search } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius } from "@/lib/theme"

export type SortTab = "terbaru" | "populer" | "terdekat"

const TABS: { key: SortTab; label: string }[] = [
    { key: "terbaru", label: "Terbaru" },
    { key: "populer", label: "Populer" },
    { key: "terdekat", label: "Terdekat" },
]

const CATEGORIES = [
    "Semua",
    "Infrastruktur",
    "Lingkungan",
    "Kebersihan",
    "Keamanan",
    "Fasilitas Umum",
    "Lainnya",
]

type Props = {
    activeTab: SortTab
    onTabChange: (tab: SortTab) => void
    search: string
    onSearchChange: (v: string) => void
    category: string
    onCategoryChange: (v: string) => void
}

export default function ExploreFilters({
    activeTab,
    onTabChange,
    search,
    onSearchChange,
    category,
    onCategoryChange,
}: Props) {
    return (
        <View style={styles.container}>
            {/* Search bar */}
            <View style={styles.searchWrap}>
                <Search size={14} color={colors.text.placeholder} />
                <TextInput
                    value={search}
                    onChangeText={onSearchChange}
                    placeholder="Cari laporan..."
                    placeholderTextColor={colors.text.placeholder}
                    style={styles.searchInput}
                />
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => onTabChange(tab.key)}
                        style={[
                            styles.tab,
                            activeTab === tab.key && styles.tabActive,
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab.key && styles.tabTextActive,
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Category chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipScroll}
            >
                {CATEGORIES.map((c) => (
                    <TouchableOpacity
                        key={c}
                        onPress={() => onCategoryChange(c)}
                        style={[
                            styles.chip,
                            category === c && styles.chipActive,
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                category === c && styles.chipTextActive,
                            ]}
                        >
                            {c}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
        paddingHorizontal: 20,
    },
    searchWrap: {
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
    tabRow: {
        flexDirection: "row",
        backgroundColor: colors.cream[200],
        borderRadius: radius.md,
        padding: 3,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: radius.sm,
        alignItems: "center",
    },
    tabActive: {
        backgroundColor: "#fff",
        shadowColor: colors.brand[500],
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 1,
    },
    tabText: {
        fontFamily: fontFamily.semibold,
        fontSize: fontSize.sm,
        color: colors.text.muted,
    },
    tabTextActive: {
        color: colors.brand[500],
    },
    chipScroll: {
        gap: 6,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: radius.full,
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
    },
    chipActive: {
        backgroundColor: colors.brand[500],
        borderColor: colors.brand[500],
    },
    chipText: {
        fontFamily: fontFamily.semibold,
        fontSize: fontSize.xs,
        color: colors.text.muted,
    },
    chipTextActive: {
        color: "#fff",
    },
})