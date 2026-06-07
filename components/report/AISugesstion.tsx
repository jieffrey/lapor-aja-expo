import { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native"
import { Sparkles, Camera, Check } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import type { ImagePickerAsset } from "expo-image-picker"

type Suggestion = {
    category: string
    priority: "Low" | "Medium" | "High"
    confidence: number
    source: "text" | "photo"
}

type Props = {
    title: string
    description: string
    images: ImagePickerAsset[]
    apiUrl: string
    onApply: (category: string, priority: string) => void
}

const PRIORITY_STYLE: Record<string, { bg: string; text: string }> = {
    High: { bg: "#FEE2E2", text: "#991B1B" },
    Medium: { bg: "#FEF3C7", text: "#92400E" },
    Low: { bg: colors.brand[50], text: colors.brand[500] },
}

export default function AISuggestion({
    title,
    description,
    images,
    apiUrl,
    onApply,
}: Props) {
    const [loading, setLoading] = useState(false)
    const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
    const [applied, setApplied] = useState(false)

    const canText = (title?.length ?? 0) > 5 || (description?.length ?? 0) > 10
    const canPhoto = images.length > 0
    const canDetect = canText || canPhoto

    const handleDetect = async () => {
        setLoading(true)
        setSuggestion(null)
        setApplied(false)

        try {
            let res: Response

            if (canPhoto) {
                // Photo detection
                const formData = new FormData()
                const img = images[0]
                formData.append("image", {
                    uri: img.uri,
                    name: img.fileName ?? "photo.jpg",
                    type: img.mimeType ?? "image/jpeg",
                } as any)

                res = await fetch(`${apiUrl}/api/ai/categorize`, {
                    method: "POST",
                    body: formData,
                })
            } else {
                // Text detection
                res = await fetch(`${apiUrl}/api/ai/categorize`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description }),
                })
            }

            const json = await res.json()
            if (json.success && json.data) {
                setSuggestion({
                    ...json.data,
                    source: canPhoto ? "photo" : "text",
                })
            }
        } catch (e) {
            console.error("AI detect failed:", e)
        } finally {
            setLoading(false)
        }
    }

    const handleApply = () => {
        if (!suggestion) return
        onApply(suggestion.category, suggestion.priority)
        setApplied(true)
    }

    return (
        <View
            style={[
                styles.card,
                suggestion && styles.cardActive,
            ]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={[styles.iconWrap, shadows.brand]}>
                    <Sparkles size={13} color="#fff" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.title}>AI Auto-Kategorisasi</Text>
                    <Text style={styles.subtitle}>
                        {canPhoto ? "Deteksi dari foto" : "Deteksi dari teks"}
                    </Text>
                </View>
            </View>

            {/* Detect button */}
            <TouchableOpacity
                onPress={handleDetect}
                disabled={loading || !canDetect}
                style={[
                    styles.detectBtn,
                    canPhoto ? styles.detectBtnPhoto : styles.detectBtnText,
                    !canDetect && { opacity: 0.4 },
                ]}
                activeOpacity={0.85}
            >
                {loading ? (
                    <>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={styles.detectText}>Menganalisis...</Text>
                    </>
                ) : canPhoto ? (
                    <>
                        <Camera size={14} color="#fff" />
                        <Text style={styles.detectText}>Deteksi (Foto)</Text>
                    </>
                ) : (
                    <>
                        <Sparkles size={14} color="#fff" />
                        <Text style={styles.detectText}>Deteksi (Teks)</Text>
                    </>
                )}
            </TouchableOpacity>

            {!canDetect && (
                <Text style={styles.hint}>
                    Isi judul/deskripsi atau upload foto dulu
                </Text>
            )}

            {/* Result */}
            {suggestion && (
                <View style={styles.result}>
                    {/* Source */}
                    <View
                        style={[
                            styles.sourceBadge,
                            {
                                backgroundColor:
                                    suggestion.source === "photo"
                                        ? "#FEF3C7"
                                        : colors.brand[50],
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.sourceText,
                                {
                                    color:
                                        suggestion.source === "photo"
                                            ? "#92400E"
                                            : colors.brand[500],
                                },
                            ]}
                        >
                            {suggestion.source === "photo" ? "FOTO" : "TEKS"}
                        </Text>
                    </View>

                    {/* Category */}
                    <View style={styles.catBadge}>
                        <Text style={styles.catText}>
                            {suggestion.category}
                        </Text>
                    </View>

                    {/* Priority */}
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

                    {/* Confidence */}
                    <Text style={styles.confidence}>
                        {Math.round(suggestion.confidence * 100)}%
                    </Text>

                    {/* Apply */}
                    {!applied ? (
                        <TouchableOpacity
                            onPress={handleApply}
                            style={[styles.applyBtn, shadows.amber]}
                            activeOpacity={0.85}
                        >
                            <Check size={12} color="#fff" />
                            <Text style={styles.applyText}>Terapkan</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.appliedWrap}>
                            <Check size={12} color="#065F46" />
                            <Text style={styles.appliedText}>Diterapkan</Text>
                        </View>
                    )}
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
        marginBottom: 12,
    },
    iconWrap: {
        width: 30,
        height: 30,
        borderRadius: radius.sm,
        backgroundColor: colors.brand[500],
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {},
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
    detectBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        borderRadius: radius.md,
    },
    detectBtnText: {
        backgroundColor: colors.brand[500],
    },
    detectBtnPhoto: {
        backgroundColor: colors.accent.amber,
    },
    detectText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.sm,
        color: "#fff",
    },
    hint: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 8,
        textAlign: "center",
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
    sourceBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: radius.full,
    },
    sourceText: {
        fontFamily: fontFamily.bold,
        fontSize: 8,
        letterSpacing: 0.5,
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
    applyBtn: {
        marginLeft: "auto",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: colors.accent.amber,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: radius.md,
    },
    applyText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xs,
        color: "#fff",
    },
    appliedWrap: {
        marginLeft: "auto",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    appliedText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xs,
        color: "#065F46",
    },
})