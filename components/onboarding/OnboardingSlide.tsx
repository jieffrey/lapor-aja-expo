import { View, Text, StyleSheet, Dimensions } from "react-native"
import { colors, fontFamily, fontSize, radius } from "@/lib/theme"

const { width, height } = Dimensions.get("window")

type Props = {
    icon: React.ReactNode
    title: string
    description: string
    gradient: [string, string]
}

export default function OnboardingSlide({ icon, title, description, gradient }: Props) {
    return (
        <View style={styles.container}>
            {/* Illustration area */}
            <View style={styles.illustrationWrap}>
                {/* Background blob besar */}
                <View
                    style={[
                        styles.blobOuter,
                        { backgroundColor: gradient[0] + "12" },
                    ]}
                />
                <View
                    style={[
                        styles.blobMid,
                        { backgroundColor: gradient[0] + "20" },
                    ]}
                />

                {/* Icon circle dengan glow */}
                <View
                    style={[
                        styles.glowRing,
                        { backgroundColor: gradient[0] + "25" },
                    ]}
                >
                    <View
                        style={[
                            styles.iconCircle,
                            { backgroundColor: gradient[0] },
                            {
                                shadowColor: gradient[0],
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 20,
                                elevation: 12,
                            },
                        ]}
                    >
                        {icon}
                    </View>
                </View>

                {/* Decorative dots */}
                <View style={[styles.decoDot, {
                    backgroundColor: gradient[1],
                    width: 14, height: 14,
                    top: "18%", right: "18%",
                    opacity: 0.35,
                }]} />
                <View style={[styles.decoDot, {
                    backgroundColor: gradient[0],
                    width: 9, height: 9,
                    bottom: "22%", left: "14%",
                    opacity: 0.25,
                }]} />
                <View style={[styles.decoDot, {
                    backgroundColor: gradient[1],
                    width: 6, height: 6,
                    top: "38%", left: "18%",
                    opacity: 0.2,
                }]} />
                <View style={[styles.decoDot, {
                    backgroundColor: gradient[0],
                    width: 10, height: 10,
                    bottom: "30%", right: "12%",
                    opacity: 0.2,
                }]} />

                {/* Decorative ring */}
                <View style={[styles.decoRing, {
                    borderColor: gradient[0] + "20",
                    width: width * 0.55,
                    height: width * 0.55,
                }]} />
            </View>

            {/* Text content */}
            <View style={styles.textWrap}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width,
        alignItems: "center",
        paddingHorizontal: 28,
    },
    illustrationWrap: {
        width: width * 0.72,
        height: width * 0.72,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 36,
        position: "relative",
    },
    blobOuter: {
        position: "absolute",
        width: width * 0.72,
        height: width * 0.72,
        borderRadius: width * 0.36,
    },
    blobMid: {
        position: "absolute",
        width: width * 0.54,
        height: width * 0.54,
        borderRadius: width * 0.27,
    },
    glowRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: radius.xl,
        justifyContent: "center",
        alignItems: "center",
    },
    decoDot: {
        position: "absolute",
        borderRadius: 999,
    },
    decoRing: {
        position: "absolute",
        borderWidth: 1.5,
        borderRadius: 999,
    },
    textWrap: {
        alignItems: "center",
        gap: 10,
    },
    title: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize["2xl"],
        color: colors.text.primary,
        textAlign: "center",
        letterSpacing: -0.5,
    },
    description: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.md,
        color: colors.text.muted,
        textAlign: "center",
        lineHeight: 24,
        maxWidth: 280,
    },
})