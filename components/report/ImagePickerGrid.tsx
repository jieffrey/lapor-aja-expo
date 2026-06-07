import { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Camera, ImagePlus, X, Plus } from "lucide-react-native"
import { colors, fontFamily, fontSize, radius } from "@/lib/theme"

type Props = {
    images: ImagePicker.ImagePickerAsset[]
    onChange: (images: ImagePicker.ImagePickerAsset[]) => void
    max?: number
    error?: string
}

export default function ImagePickerGrid({
    images,
    onChange,
    max = 5,
    error,
}: Props) {
    const canAdd = images.length < max

    const pickFromGallery = async () => {
        const remaining = max - images.length
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            selectionLimit: remaining,
            quality: 0.8,
        })
        if (!result.canceled) {
            onChange([...images, ...result.assets].slice(0, max))
        }
    }

    const pickFromCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== "granted") {
            Alert.alert("Izin Kamera", "Izinkan akses kamera untuk foto laporan")
            return
        }
        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
        })
        if (!result.canceled) {
            onChange([...images, ...result.assets].slice(0, max))
        }
    }

    const removeImage = (index: number) => {
        onChange(images.filter((_, i) => i !== index))
    }

    const showOptions = () => {
        Alert.alert("Tambah Foto", "Pilih sumber foto", [
            { text: "Kamera", onPress: pickFromCamera },
            { text: "Galeri", onPress: pickFromGallery },
            { text: "Batal", style: "cancel" },
        ])
    }

    return (
        <View>
            {/* Label */}
            <View style={styles.labelRow}>
                <View style={styles.labelIcon}>
                    <Camera size={12} color={colors.brand[500]} />
                </View>
                <Text style={styles.label}>Foto Bukti</Text>
                <Text style={styles.counter}>
                    ({images.length}/{max})
                </Text>
            </View>

            {/* Grid */}
            <View style={styles.grid}>
                {images.map((img, i) => (
                    <View key={i} style={styles.previewWrap}>
                        <Image
                            source={{ uri: img.uri }}
                            style={styles.preview}
                        />
                        <TouchableOpacity
                            onPress={() => removeImage(i)}
                            style={styles.removeBtn}
                        >
                            <X size={12} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.sizeLabel}>
                            <Text style={styles.sizeText}>
                                {((img.fileSize ?? 0) / 1024 / 1024).toFixed(1)}MB
                            </Text>
                        </View>
                    </View>
                ))}

                {canAdd && (
                    <TouchableOpacity
                        onPress={showOptions}
                        style={styles.addBtn}
                        activeOpacity={0.7}
                    >
                        <Plus size={22} color={colors.text.placeholder} />
                        <Text style={styles.addText}>
                            {images.length === 0 ? "Tambah" : "Lagi"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Error */}
            {error && <Text style={styles.error}>{error}</Text>}

            {/* Hint */}
            <Text style={styles.hint}>
                JPG, PNG, atau WebP. Maksimal {max} foto.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
    },
    labelIcon: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: colors.brand[50],
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.base,
        color: colors.text.secondary,
    },
    counter: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    previewWrap: {
        width: "30%",
        aspectRatio: 1,
        borderRadius: radius.md,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.cream[300],
        position: "relative",
    },
    preview: {
        width: "100%",
        height: "100%",
    },
    removeBtn: {
        position: "absolute",
        top: 4,
        right: 4,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "rgba(153,27,27,0.85)",
        justifyContent: "center",
        alignItems: "center",
    },
    sizeLabel: {
        position: "absolute",
        bottom: 4,
        left: 4,
        backgroundColor: "rgba(252,251,248,0.90)",
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 4,
    },
    sizeText: {
        fontFamily: fontFamily.medium,
        fontSize: 8,
        color: colors.text.muted,
    },
    addBtn: {
        width: "30%",
        aspectRatio: 1,
        borderRadius: radius.md,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: colors.cream[300],
        backgroundColor: colors.cream[100],
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
    },
    addText: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
    },
    error: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.xs,
        color: colors.danger,
        marginTop: 6,
    },
    hint: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 6,
    },
})