import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Image } from "expo-image"
import { ArrowLeft, Clock, MapPin } from "lucide-react-native"

import api from "@/lib/api"
import { colors, fontFamily, fontSize, radius } from "@/lib/theme"
import type { Report } from "@/lib/types"
import CommentSection from "@/components/report/CommentSection"

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
    Pending: { bg: colors.cream[200], text: "#5F5E5A" },
    "In Progress": { bg: "#FEF3C7", text: "#92400E" },
    Resolved: { bg: "#D1FAE5", text: "#065F46" },
    Rejected: { bg: "#FEE2E2", text: "#991B1B" },
}

export default function ReportDetailScreen() {
    const router = useRouter()
    const { id } = useLocalSearchParams()
    const [report, setReport] = useState<Report | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await api.get(`/reports/${id}`)
                setReport(res.data.data)
            } catch (e) {
                console.error(e)
                router.back()
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchReport()
    }, [id])

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.brand[500]} />
            </View>
        )
    }

    if (!report) {
        return (
            <View style={styles.error}>
                <Text style={styles.errorText}>Laporan tidak ditemukan</Text>
            </View>
        )
    }

    const status = STATUS_STYLE[report.status] ?? STATUS_STYLE.Pending

    return (
        <View style={styles.container}>
            {/* Header dengan tombol back */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backBtn}
                >
                    <ArrowLeft size={20} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Laporan</Text>
            </View>

            {/* Semua konten dalam ScrollView termasuk comment */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                {/* Foto laporan */}
                <View style={styles.imageContainer}>
                    {report.image_before ? (
                        <Image
                            source={{ uri: report.image_before }}
                            style={styles.image}
                            contentFit="cover"
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>
                                Tidak ada gambar
                            </Text>
                        </View>
                    )}
                </View>

                {/* Badge status & kategori */}
                <View style={styles.badges}>
                    <View style={[styles.badge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.badgeText, { color: status.text }]}>
                            {report.status}
                        </Text>
                    </View>
                    <View style={styles.catBadge}>
                        <Text style={styles.catText}>{report.category}</Text>
                    </View>
                </View>

                {/* Judul & deskripsi */}
                <Text style={styles.title}>{report.title}</Text>
                <Text style={styles.description}>{report.description}</Text>

                {/* Meta info: lokasi & tanggal */}
                <View style={styles.meta}>
                    <View style={styles.metaRow}>
                        <MapPin size={14} color={colors.text.placeholder} />
                        <Text style={styles.metaText}>{report.name}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Clock size={14} color={colors.text.placeholder} />
                        <Text style={styles.metaText}>
                            {new Date(report.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </Text>
                    </View>
                </View>

                {/* Divider sebelum comment */}
                <View style={styles.divider} />

                {/* Section komentar — pass reportId sebagai string */}
                <CommentSection reportId={id} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cream[50],
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.cream[100],
    },
    error: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.cream[100],
    },
    errorText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.md,
        color: colors.text.muted,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: colors.cream[50],
        borderBottomWidth: 1,
        borderBottomColor: colors.cream[300],
    },
    backBtn: {
        position: "absolute",
        left: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.cream[200],
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: colors.text.primary,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    imageContainer: {
        height: 200,
        borderRadius: radius.lg,
        overflow: "hidden",
        backgroundColor: colors.cream[200],
        marginBottom: 16,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.placeholder,
    },
    badges: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: radius.full,
    },
    badgeText: {
        fontFamily: fontFamily.bold,
        fontSize: 12,
    },
    catBadge: {
        backgroundColor: colors.brand[50],
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: radius.full,
    },
    catText: {
        fontFamily: fontFamily.semibold,
        fontSize: 12,
        color: colors.brand[500],
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xl,
        color: colors.text.primary,
        lineHeight: 26,
        marginBottom: 8,
    },
    description: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.md,
        color: colors.text.muted,
        lineHeight: 22,
        marginBottom: 16,
    },
    meta: {
        gap: 12,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    metaText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.placeholder,
        flexShrink: 1,
    },
    divider: {
        height: 1,
        backgroundColor: colors.cream[300],
        marginVertical: 20,
    },
})