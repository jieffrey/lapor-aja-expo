import { View, Text, ScrollView, StyleSheet } from "react-native"
import { FileText, CheckCircle2, Loader, Clock } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"

type StatItem = {
    label: string
    value: number
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    valueColor: string
}

type Props = {
    total: number
    resolved: number
    inProgress: number
    pending: number
}

export default function HomeStats({
    total,
    resolved,
    inProgress,
    pending,
}: Props) {
    const stats: StatItem[] = [
        {
            label: "Total",
            value: total,
            icon: <FileText size={16} color={colors.brand[500]} />,
            iconBg: colors.brand[50],
            iconColor: colors.brand[500],
            valueColor: colors.brand[500],
        },
        {
            label: "Selesai",
            value: resolved,
            icon: <CheckCircle2 size={16} color="#065F46" />,
            iconBg: "#D1FAE5",
            iconColor: "#065F46",
            valueColor: "#065F46",
        },
        {
            label: "Diproses",
            value: inProgress,
            icon: <Loader size={16} color="#92400E" />,
            iconBg: "#FEF3C7",
            iconColor: "#92400E",
            valueColor: "#92400E",
        },
        {
            label: "Pending",
            value: pending,
            icon: <Clock size={16} color="#5F5E5A" />,
            iconBg: colors.cream[200],
            iconColor: "#5F5E5A",
            valueColor: "#5F5E5A",
        },
    ]

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {stats.map((s) => (
                <View key={s.label} style={[styles.card, shadows.sm]}>
                    <View
                        style={[
                            styles.iconWrap,
                            { backgroundColor: s.iconBg },
                        ]}
                    >
                        {s.icon}
                    </View>
                    <Text style={[styles.value, { color: s.valueColor }]}>
                        {s.value}
                    </Text>
                    <Text style={styles.label}>{s.label}</Text>
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        gap: 10,
        paddingBottom: 4,
    },
    card: {
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius.xl,
        paddingHorizontal: 18,
        paddingVertical: 14,
        width: 110,
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: radius.md,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    value: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize["2xl"],
        letterSpacing: -0.5,
    },
    label: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 2,
    },
})