import { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TextInput } from "react-native-paper"
import { Send, Loader2, PlusCircle, ChevronDown } from "lucide-react-native"
import type { ImagePickerAsset } from "expo-image-picker"
import api from "@/lib/api"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import ImagePickerGrid from "@/components/report/ImagePickerGrid"
import AISuggestion from "@/components/report/AISugesstion"
import MobileLocationPicker from "@/components/report/MobileLocationPicker"

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? ""
const NEXT_URL = process.env.EXPO_PUBLIC_NEXT_URL ?? "http://192.168.1.x:3000"

const CATEGORIES = [
    "Infrastruktur",
    "Lingkungan",
    "Kebersihan",
    "Keamanan",
    "Fasilitas Umum",
    "Lainnya",
]

const PRIORITIES = ["Low", "Medium", "High"]

export default function CreateReportScreen() {
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [priority, setPriority] = useState("Medium")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [images, setImages] = useState<ImagePickerAsset[]>([])
    const [imageError, setImageError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        // Validate
        if (!title.trim()) {
            Alert.alert("Error", "Judul harus diisi")
            return
        }
        if (!description.trim()) {
            Alert.alert("Error", "Deskripsi harus diisi")
            return
        }
        if (!category) {
            Alert.alert("Error", "Pilih kategori")
            return
        }
        if (images.length === 0) {
            setImageError("Minimal 1 foto diperlukan")
            return
        }

        setImageError("")
        setSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("title", title.trim())
            formData.append("description", description.trim())
            formData.append("category", category)
            formData.append("priority", priority)
            if (latitude) formData.append("latitude", latitude)
            if (longitude) formData.append("longitude", longitude)

            images.forEach((img) => {
                formData.append("images", {
                    uri: img.uri,
                    name: img.fileName ?? `photo_${Date.now()}.jpg`,
                    type: img.mimeType ?? "image/jpeg",
                } as any)
            })

            await api.post("/reports", formData)

            Alert.alert("Berhasil", "Laporan berhasil dikirim", [
                {
                    text: "OK",
                    onPress: () => router.push("/(main)/(home)" as any),
                },
            ])
        } catch (err) {
            Alert.alert(
                "Gagal",
                err instanceof Error ? err.message : "Gagal mengirim laporan"
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleAIApply = (cat: string, pri: string) => {
        setCategory(cat)
        setPriority(pri)
    }

    const showCategoryPicker = () => {
        Alert.alert("Pilih Kategori", undefined, [
            ...CATEGORIES.map((c) => ({
                text: c,
                onPress: () => setCategory(c),
            })),
            { text: "Batal", style: "cancel" as const },
        ])
    }

    const showPriorityPicker = () => {
        Alert.alert("Pilih Prioritas", undefined, [
            ...PRIORITIES.map((p) => ({
                text: p,
                onPress: () => setPriority(p),
            })),
            { text: "Batal", style: "cancel" as const },
        ])
    }

    const inputTheme = {
        fonts: { bodyLarge: { fontFamily: fontFamily.regular } },
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scroll,
                    { paddingTop: insets.top + 16 },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={[styles.headerIcon, shadows.brand]}>
                        <PlusCircle size={22} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>
                            Buat Laporan Baru
                        </Text>
                        <Text style={styles.headerSub}>
                            Foto, tandai lokasi, dan laporkan
                        </Text>
                    </View>
                </View>

                {/* Form */}
                <View style={[styles.card, shadows.sm]}>
                    {/* Title */}
                    <TextInput
                        label="Judul Laporan"
                        value={title}
                        onChangeText={setTitle}
                        mode="outlined"
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        outlineColor={colors.cream[300]}
                        activeOutlineColor={colors.brand[500]}
                        textColor={colors.text.primary}
                        theme={inputTheme}
                        placeholder="Contoh: Jalan berlubang di RT 05"
                    />

                    {/* Description */}
                    <TextInput
                        label="Deskripsi"
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        style={[styles.input, { minHeight: 100 }]}
                        outlineStyle={styles.inputOutline}
                        outlineColor={colors.cream[300]}
                        activeOutlineColor={colors.brand[500]}
                        textColor={colors.text.primary}
                        theme={inputTheme}
                        placeholder="Jelaskan masalah secara detail..."
                    />

                    {/* Photos */}
                    <ImagePickerGrid
                        images={images}
                        onChange={(imgs) => {
                            setImages(imgs)
                            if (imgs.length > 0) setImageError("")
                        }}
                        max={5}
                        error={imageError}
                    />

                    {/* AI suggestion */}
                    <AISuggestion
                        title={title}
                        description={description}
                        images={images}
                        apiUrl={NEXT_URL}
                        onApply={handleAIApply}
                    />

                    {/* Category + Priority pickers */}
                    <View style={styles.pickerRow}>
                        <TouchableOpacity
                            onPress={showCategoryPicker}
                            style={[styles.picker, styles.pickerFlex]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.pickerLabel,
                                    !category && { color: colors.text.placeholder },
                                ]}
                            >
                                {category || "Kategori"}
                            </Text>
                            <ChevronDown
                                size={14}
                                color={colors.text.placeholder}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={showPriorityPicker}
                            style={styles.picker}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.pickerLabel}>{priority}</Text>
                            <ChevronDown
                                size={14}
                                color={colors.text.placeholder}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Location */}
                    <MobileLocationPicker
                        latitude={latitude}
                        longitude={longitude}
                        onChange={(lat, lng) => {
                            setLatitude(lat)
                            setLongitude(lng)
                        }}
                    />
                </View>

                {/* Submit */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={[
                        styles.submitBtn,
                        shadows.brand,
                        submitting && { opacity: 0.7 },
                    ]}
                    activeOpacity={0.85}
                >
                    {submitting ? (
                        <>
                            <Loader2 size={18} color="#fff" />
                            <Text style={styles.submitText}>Mengirim...</Text>
                        </>
                    ) : (
                        <>
                            <Send size={18} color="#fff" />
                            <Text style={styles.submitText}>Kirim Laporan</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cream[100],
    },
    scroll: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: radius.lg,
        backgroundColor: colors.brand[500],
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize.xl,
        color: colors.text.primary,
        letterSpacing: -0.3,
    },
    headerSub: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.muted,
        marginTop: 2,
    },
    card: {
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        borderRadius: radius["2xl"],
        padding: 20,
        gap: 18,
    },
    input: {
        backgroundColor: colors.cream[50],
        fontSize: fontSize.md,
    },
    inputOutline: {
        borderRadius: radius.md,
    },
    pickerRow: {
        flexDirection: "row",
        gap: 10,
    },
    picker: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: radius.md,
        borderWidth: 1.5,
        borderColor: colors.cream[300],
        backgroundColor: colors.cream[50],
    },
    pickerFlex: {
        flex: 1,
    },
    pickerLabel: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.md,
        color: colors.text.primary,
    },
    submitBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: colors.brand[500],
        paddingVertical: 16,
        borderRadius: radius.lg,
        marginTop: 20,
    },
    submitText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: "#fff",
    },
})