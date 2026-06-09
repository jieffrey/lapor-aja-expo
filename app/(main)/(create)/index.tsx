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
    Modal,
    Pressable,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TextInput } from "react-native-paper"
import {
    Send,
    Loader2,
    PlusCircle,
    ChevronDown,
    Check,
    X,
} from "lucide-react-native"
import type { ImagePickerAsset } from "expo-image-picker"
import api from "@/lib/api"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import ImagePickerGrid from "@/components/report/ImagePickerGrid"
import AISuggestion from "@/components/report/AISugesstion"
// import MobileLocationPicker from "@/components/report/MobileLocationPicker"
import LocationSearchPicker from "@/components/report/LocationSearchPicker"

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? ""

const CATEGORIES = [
    { label: "Infrastruktur", icon: "🏗️" },
    { label: "Lingkungan", icon: "🌿" },
    { label: "Kebersihan", icon: "🧹" },
    { label: "Keamanan", icon: "🔒" },
    { label: "Fasilitas Umum", icon: "🏛️" },
    { label: "Lainnya", icon: "📋" },
]

const PRIORITIES: {
    label: "Low" | "Medium" | "High"
    color: string
    bg: string
    desc: string
}[] = [
        {
            label: "Low",
            color: colors.brand[500],
            bg: colors.brand[50],
            desc: "Tidak mendesak",
        },
        {
            label: "Medium",
            color: "#92400E",
            bg: "#FEF3C7",
            desc: "Perlu ditangani",
        },
        {
            label: "High",
            color: "#991B1B",
            bg: "#FEE2E2",
            desc: "Segera ditangani",
        },
    ]

type PickerModalProps = {
    visible: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

function PickerModal({ visible, onClose, title, children }: PickerModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalSheet} onPress={() => { }}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={8}>
                            <X size={18} color={colors.text.muted} />
                        </TouchableOpacity>
                    </View>
                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default function CreateReportScreen() {
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [images, setImages] = useState<ImagePickerAsset[]>([])
    const [imageError, setImageError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const [showCatModal, setShowCatModal] = useState(false)
    const [showPriModal, setShowPriModal] = useState(false)

    const selectedPri = PRIORITIES.find((p) => p.label === priority)!

    const handleSubmit = async () => {
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
        if (pri === "Low" || pri === "Medium" || pri === "High") {
            setPriority(pri)
        }
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
                        <Text style={styles.headerTitle}>Buat Laporan Baru</Text>
                        <Text style={styles.headerSub}>
                            Foto, tandai lokasi, dan laporkan
                        </Text>
                    </View>
                </View>

                {/* Form */}
                <View style={[styles.card, shadows.sm]}>
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

                    <ImagePickerGrid
                        images={images}
                        onChange={(imgs) => {
                            setImages(imgs)
                            if (imgs.length > 0) setImageError("")
                        }}
                        max={5}
                        error={imageError}
                    />

                    <AISuggestion
                        title={title}
                        description={description}
                        onApply={handleAIApply}
                    />

                    {/* Category + Priority */}
                    <View style={styles.pickerRow}>
                        {/* Category button */}
                        <TouchableOpacity
                            onPress={() => setShowCatModal(true)}
                            style={[
                                styles.picker,
                                styles.pickerFlex,
                                category && styles.pickerSelected,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.pickerLabel,
                                    !category && {
                                        color: colors.text.placeholder,
                                    },
                                ]}
                                numberOfLines={1}
                            >
                                {category
                                    ? `${CATEGORIES.find((c) => c.label === category)?.icon ?? ""} ${category}`
                                    : "Kategori"}
                            </Text>
                            <ChevronDown
                                size={14}
                                color={
                                    category
                                        ? colors.brand[500]
                                        : colors.text.placeholder
                                }
                            />
                        </TouchableOpacity>

                        {/* Priority button */}
                        <TouchableOpacity
                            onPress={() => setShowPriModal(true)}
                            style={[
                                styles.picker,
                                { backgroundColor: selectedPri.bg },
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.pickerLabel,
                                    { color: selectedPri.color },
                                ]}
                            >
                                {priority}
                            </Text>
                            <ChevronDown
                                size={14}
                                color={selectedPri.color}
                            />
                        </TouchableOpacity>
                    </View>

                    <LocationSearchPicker
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

            {/* Category Modal */}
            <PickerModal
                visible={showCatModal}
                onClose={() => setShowCatModal(false)}
                title="Pilih Kategori"
            >
                {CATEGORIES.map((c) => (
                    <TouchableOpacity
                        key={c.label}
                        onPress={() => {
                            setCategory(c.label)
                            setShowCatModal(false)
                        }}
                        style={[
                            styles.optionRow,
                            category === c.label && styles.optionRowSelected,
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.optionIcon}>{c.icon}</Text>
                        <Text
                            style={[
                                styles.optionLabel,
                                category === c.label && {
                                    color: colors.brand[500],
                                    fontFamily: fontFamily.bold,
                                },
                            ]}
                        >
                            {c.label}
                        </Text>
                        {category === c.label && (
                            <Check
                                size={16}
                                color={colors.brand[500]}
                                style={{ marginLeft: "auto" }}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </PickerModal>

            {/* Priority Modal */}
            <PickerModal
                visible={showPriModal}
                onClose={() => setShowPriModal(false)}
                title="Pilih Prioritas"
            >
                {PRIORITIES.map((p) => (
                    <TouchableOpacity
                        key={p.label}
                        onPress={() => {
                            setPriority(p.label)
                            setShowPriModal(false)
                        }}
                        style={[
                            styles.optionRow,
                            priority === p.label && {
                                backgroundColor: p.bg,
                                borderColor: p.color + "40",
                            },
                        ]}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.priorityDot,
                                { backgroundColor: p.color },
                            ]}
                        />
                        <View>
                            <Text
                                style={[
                                    styles.optionLabel,
                                    { color: p.color },
                                    priority === p.label && {
                                        fontFamily: fontFamily.bold,
                                    },
                                ]}
                            >
                                {p.label}
                            </Text>
                            <Text style={styles.optionDesc}>{p.desc}</Text>
                        </View>
                        {priority === p.label && (
                            <Check
                                size={16}
                                color={p.color}
                                style={{ marginLeft: "auto" }}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </PickerModal>
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
        gap: 6,
    },
    pickerFlex: {
        flex: 1,
    },
    pickerSelected: {
        borderColor: colors.brand[300],
        backgroundColor: colors.brand[50],
    },
    pickerLabel: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.md,
        color: colors.text.primary,
        flexShrink: 1,
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
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    modalSheet: {
        backgroundColor: colors.cream[50],
        borderTopLeftRadius: radius["2xl"],
        borderTopRightRadius: radius["2xl"],
        paddingHorizontal: 20,
        paddingBottom: 32,
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    modalTitle: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: colors.text.primary,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 12,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: "transparent",
        marginBottom: 6,
    },
    optionRowSelected: {
        backgroundColor: colors.brand[50],
        borderColor: colors.brand[200],
    },
    optionIcon: {
        fontSize: 20,
    },
    optionLabel: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.base,
        color: colors.text.primary,
    },
    optionDesc: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.muted,
        marginTop: 1,
    },
    priorityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
})