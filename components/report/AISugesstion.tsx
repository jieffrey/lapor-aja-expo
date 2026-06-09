import { useEffect, useRef, useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native"
import { Sparkles, CheckCircle2 } from "lucide-react-native"
import api from "@/lib/api"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"

type Suggestion = {
    category: string
    priority: "Low" | "Medium" | "High"
    confidence: number
}

type Props = {
    title: string
    description: string
    onApply: (category: string, priority: string) => void
}

const PRIORITY_STYLE: Record<string, { bg: string; text: string }> = {
    High: { bg: "#FEE2E2", text: "#991B1B" },
    Medium: { bg: "#FEF3C7", text: "#92400E" },
    Low: { bg: colors.brand[50], text: colors.brand[500] },
}

export default function AISuggestion({ title, description, onApply }: Props) {
    const [loading, setLoading] = useState(false)
    const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const canDetect =
        (title?.length ?? 0) > 5 || (description?.length ?? 0) > 10

    // Auto-detect dengan debounce 800ms
    useEffect(() => {
        if (!canDetect) return

        if (debounceRef.current) clearTimeout(debounceRef.current)

        debounceRef.current = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await api.post("/ai/categorize", {
                    title,
                    description,
                })
                if (res.data.success && res.data.data) {
                    const s: Suggestion = res.data.data
                    setSuggestion(s)
                    // Langsung apply ke form
                    onApply(s.category, s.priority)
                }
            } catch (e) {
                console.error("AI detect failed:", e)
            } finally {
                setLoading(false)
            }
        }, 800)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [title, description])

    return (
        <View style={[styles.card, suggestion && styles.cardActive]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={[styles.iconWrap, shadows.brand]}>
                    <Sparkles size={13} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>AI Auto-Kategorisasi</Text>
                    <Text style={styles.subtitle}>
                        {loading
                            ? "Menganalisis judul & deskripsi..."
                            : suggestion
                                ? "Kategori & prioritas otomatis diterapkan"
                                : "Isi judul atau deskripsi untuk memulai"}
                    </Text>
                </View>

                {/* Status icon di kanan */}
                {loading && (
                    <ActivityIndicator
                        size="small"
                        color={colors.brand[500]}
                    />
                )}
                {!loading && suggestion && (
                    <CheckCircle2
                        size={18}
                        color={colors.brand[500]}
                    />
                )}
            </View>

            {/* Result badges */}
            {suggestion && !loading && (
                <View style={styles.result}>
                    <View style={styles.catBadge}>
                        <Text style={styles.catText}>
                            {suggestion.category}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.priBadge,
                            {
                                backgroundColor:
                                    PRIORITY_STYLE[suggestion.priority]?.bg,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.priText,
                                {
                                    color: PRIORITY_STYLE[suggestion.priority]
                                        ?.text,
                                },
                            ]}
                        >
                            {suggestion.priority}
                        </Text>
                    </View>

                    <Text style={styles.confidence}>
                        {Math.round(suggestion.confidence * 100)}% confidence
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cream[100],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius.lg,
        padding: 16,
    },
    cardActive: {
        borderColor: colors.brand[200],
        backgroundColor: colors.brand[50] + "30",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    iconWrap: {
        width: 30,
        height: 30,
        borderRadius: radius.sm,
        backgroundColor: colors.brand[500],
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.base,
        color: colors.text.primary,
    },
    subtitle: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 1,
    },
    result: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        marginTop: 12,
        backgroundColor: colors.cream[50] + "CC",
        borderRadius: radius.md,
        padding: 10,
    },
    catBadge: {
        backgroundColor: colors.brand[50],
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.full,
    },
    catText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xs,
        color: colors.brand[500],
    },
    priBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.full,
    },
    priText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xs,
    },
    confidence: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
    },
})