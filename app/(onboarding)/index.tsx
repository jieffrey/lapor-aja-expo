import { useState, useRef } from "react"
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ViewToken,
} from "react-native"
import { useRouter } from "expo-router"
import {
    MapPin,
    BarChart3,
    Trophy,
    ArrowRight,
    ChevronRight,
} from "lucide-react-native"
import { useAuthStore } from "@/stores/auth.store"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import OnboardingSlide from "@/components/onboarding/OnboardingSlide"

const { width } = Dimensions.get("window")

const SLIDES = [
    {
        id: "1",
        icon: <MapPin size={36} color="#fff" />,
        title: "Laporkan Masalah",
        description:
            "Foto, tandai lokasi, dan laporkan masalah lingkungan di sekitarmu dengan mudah",
        gradient: [colors.brand[500], colors.brand[300]] as [string, string],
    },
    {
        id: "2",
        icon: <BarChart3 size={36} color="#fff" />,
        title: "Pantau Progress",
        description:
            "Ikuti perkembangan laporanmu dari pending hingga selesai ditangani",
        gradient: [colors.accent.amber, colors.accent.orange] as [
            string,
            string,
        ],
    },
    {
        id: "3",
        icon: <Trophy size={36} color="#fff" />,
        title: "Raih Poin",
        description:
            "Kumpulkan poin dari setiap laporan dan naik peringkat di leaderboard warga aktif",
        gradient: [colors.brand[600], colors.brand[400]] as [string, string],
    },
]

export default function OnboardingScreen() {
    const router = useRouter()
    const setOnboardingSeen = useAuthStore((s) => s.setOnboardingSeen)
    const flatListRef = useRef<FlatList>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const isLast = activeIndex === SLIDES.length - 1

    const handleNext = () => {
        if (isLast) {
            handleDone()
        } else {
            flatListRef.current?.scrollToIndex({ index: activeIndex + 1 })
        }
    }

    const handleSkip = () => handleDone()

    const handleDone = async () => {
        await setOnboardingSeen()
        router.replace("/(auth)/login")
    }

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems[0]?.index != null) {
                setActiveIndex(viewableItems[0].index)
            }
        }
    ).current

    return (
        <View style={styles.container}>
            {/* Skip button */}
            {!isLast && (
                <TouchableOpacity
                    onPress={handleSkip}
                    style={styles.skipBtn}
                    activeOpacity={0.7}
                >
                    <Text style={styles.skipText}>Lewati</Text>
                </TouchableOpacity>
            )}

            {/* Slides */}
            <View style={styles.slidesWrap}>
                <FlatList
                    ref={flatListRef}
                    data={SLIDES}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <OnboardingSlide
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            gradient={item.gradient}
                        />
                    )}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                />
            </View>

            {/* Bottom section */}
            <View style={styles.bottomSection}>
                {/* Dots */}
                <View style={styles.dots}>
                    {SLIDES.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === activeIndex
                                    ? styles.dotActive
                                    : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    style={[styles.ctaBtn, shadows.brand]}
                    activeOpacity={0.85}
                >
                    <Text style={styles.ctaText}>
                        {isLast ? "Mulai Sekarang" : "Lanjut"}
                    </Text>
                    {isLast ? (
                        <ArrowRight size={18} color="#fff" />
                    ) : (
                        <ChevronRight size={18} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cream[100],
    },
    skipBtn: {
        position: "absolute",
        top: 60,
        right: 24,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: radius.full,
        backgroundColor: colors.cream[200],
    },
    skipText: {
        fontFamily: fontFamily.semibold,
        fontSize: fontSize.base,
        color: colors.text.muted,
    },
    slidesWrap: {
        flex: 1,
        justifyContent: "center",
        paddingTop: 60,
    },
    bottomSection: {
        paddingHorizontal: 32,
        paddingBottom: 50,
        alignItems: "center",
        gap: 28,
    },
    dots: {
        flexDirection: "row",
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 28,
        backgroundColor: colors.brand[500],
    },
    dotInactive: {
        width: 8,
        backgroundColor: colors.cream[300],
    },
    ctaBtn: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 16,
        borderRadius: radius.lg,
        backgroundColor: colors.brand[500],
    },
    ctaText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: "#fff",
    },
})