import { useState, useRef } from "react"
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ViewToken,
    StatusBar,
} from "react-native"
import { useRouter } from "expo-router"
import { MapPin, BarChart3, Trophy, ArrowRight, ChevronRight } from "lucide-react-native"
import { useAuthStore } from "@/stores/auth.store"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import OnboardingSlide from "@/components/onboarding/OnboardingSlide"

const { width } = Dimensions.get("window")

const SLIDES = [
    {
        id: "1",
        icon: <MapPin size={38} color="#fff" strokeWidth={2} />,
        title: "Laporkan Masalah",
        description: "Foto, tandai lokasi, dan laporkan masalah lingkungan di sekitarmu dengan mudah",
        gradient: [colors.brand[500], colors.brand[300]] as [string, string],
    },
    {
        id: "2",
        icon: <BarChart3 size={38} color="#fff" strokeWidth={2} />,
        title: "Pantau Progress",
        description: "Ikuti perkembangan laporanmu dari pending hingga selesai ditangani",
        gradient: [colors.accent.amber, colors.accent.orange] as [string, string],
    },
    {
        id: "3",
        icon: <Trophy size={38} color="#fff" strokeWidth={2} />,
        title: "Raih Poin",
        description: "Kumpulkan poin dari setiap laporan dan naik peringkat di leaderboard warga aktif",
        gradient: [colors.brand[600], colors.brand[400]] as [string, string],
    },
]

export default function OnboardingScreen() {
    const router = useRouter()
    const setOnboardingSeen = useAuthStore((s) => s.setOnboardingSeen)
    const flatListRef = useRef<FlatList>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const isLast = activeIndex === SLIDES.length - 1
    const activeSlide = SLIDES[activeIndex]

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
            <StatusBar barStyle="dark-content" backgroundColor={colors.cream[100]} />

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

            {/* Slide counter misal "1 / 3" */}
            <View style={styles.counter}>
                <Text style={styles.counterText}>
                    {activeIndex + 1}
                    <Text style={styles.counterTotal}> / {SLIDES.length}</Text>
                </Text>
            </View>

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
                {/* Dots indicator */}
                <View style={styles.dots}>
                    {SLIDES.map((_, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() =>
                                flatListRef.current?.scrollToIndex({ index: i })
                            }
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.dot,
                                    i === activeIndex
                                        ? [
                                              styles.dotActive,
                                              {
                                                  backgroundColor:
                                                      activeSlide.gradient[0],
                                              },
                                          ]
                                        : styles.dotInactive,
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* CTA button — warna ikut slide aktif */}
                <TouchableOpacity
                    onPress={handleNext}
                    style={[
                        styles.ctaBtn,
                        { backgroundColor: activeSlide.gradient[0] },
                        {
                            shadowColor: activeSlide.gradient[0],
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.35,
                            shadowRadius: 16,
                            elevation: 8,
                        },
                    ]}
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

                {/* Login shortcut di slide terakhir */}
                {isLast && (
                    <TouchableOpacity
                        onPress={() => router.replace("/(auth)/login")}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.loginHint}>
                            Sudah punya akun?{" "}
                            <Text style={[styles.loginLink, { color: activeSlide.gradient[0] }]}>
                                Masuk
                            </Text>
                        </Text>
                    </TouchableOpacity>
                )}
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
        top: 56,
        right: 24,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: radius.full,
        backgroundColor: colors.cream[200],
    },
    skipText: {
        fontFamily: fontFamily.semibold,
        fontSize: fontSize.sm,
        color: colors.text.muted,
    },
    counter: {
        position: "absolute",
        top: 60,
        left: 28,
        zIndex: 10,
    },
    counterText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.sm,
        color: colors.text.primary,
    },
    counterTotal: {
        fontFamily: fontFamily.regular,
        color: colors.text.placeholder,
    },
    slidesWrap: {
        flex: 1,
        justifyContent: "center",
        paddingTop: 80,
    },
    bottomSection: {
        paddingHorizontal: 28,
        paddingBottom: 48,
        alignItems: "center",
        gap: 24,
    },
    dots: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 28,
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
    },
    ctaText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: "#fff",
    },
    loginHint: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.muted,
    },
    loginLink: {
        fontFamily: fontFamily.bold,
    },
})