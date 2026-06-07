import { View, Text, StyleSheet, Dimensions } from "react-native"
import { colors, fontFamily, fontSize, radius } from "@/lib/theme"

const { width } = Dimensions.get("window")

type Props = {
    icon: React.ReactNode
    title: string
    description: string
    gradient: [string, string]
}

export default function OnboardingSlide({
    icon,
    title,
    description,
    gradient,
}: Props) {
    return (
        <View style={styles.container}>
            {/* Illustration area */}
            <View
                style={[
                    styles.illustrationWrap,
                    { backgroundColor: gradient[0] + "15" },
                ]}
            >
                <View
                    style={[
                        styles.iconCircle,
                        { backgroundColor: gradient[0] },
                    ]}
                >
                    {icon}
                </View>

                {/* Decorative dots */}
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor: gradient[1],
                            top: "20%",
                            right: "15%",
                            width: 12,
                            height: 12,
                            opacity: 0.3,
                        },
                    ]}
                />
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor: gradient[0],
                            bottom: "25%",
                            left: "12%",
                            width: 8,
                            height: 8,
                            opacity: 0.25,
                        },
                    ]}
                />
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor: gradient[1],
                            top: "40%",
                            left: "20%",
                            width: 6,
                            height: 6,
                            opacity: 0.2,
                        },
                    ]}
                />
            </View>

            {/* Text */}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width,
        alignItems: "center",
        paddingHorizontal: 32,
    },
    illustrationWrap: {
        width: width * 0.65,
        height: width * 0.65,
        borderRadius: radius["2xl"],
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40,
        position: "relative",
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: radius.xl,
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        position: "absolute",
        borderRadius: 999,
    },
    title: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize["2xl"],
        color: colors.text.primary,
        textAlign: "center",
        marginBottom: 12,
    },
    description: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.md,
        color: colors.text.muted,
        textAlign: "center",
        lineHeight: 22,
        maxWidth: 280,
    },
})