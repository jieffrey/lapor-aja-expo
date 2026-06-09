import { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TextInput } from "react-native-paper"
import * as ImagePicker from "expo-image-picker"
import { ArrowLeft, Camera, Save } from "lucide-react-native"
import { useAuthStore } from "@/stores/auth.store"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"

export default function EditProfileScreen() {
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const { user, updateProfile } = useAuthStore()

    const [name, setName] = useState(user?.name ?? "")
    const [email, setEmail] = useState(user?.email ?? "")
    const [password, setPassword] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [avatarUri, setAvatarUri] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    if (!user) return null

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()

    const avatarSource = avatarUri
        ? { uri: avatarUri }
        : user.avatar_url
        ? { uri: user.avatar_url }
        : null

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
            Alert.alert("Izin Diperlukan", "Akses galeri diperlukan untuk mengganti foto profil.")
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })
        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri)
        }
    }

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Nama tidak boleh kosong")
            return
        }
        if (!email.trim()) {
            Alert.alert("Error", "Email tidak boleh kosong")
            return
        }
        if (password && password.length < 6) {
            Alert.alert("Error", "Password minimal 6 karakter")
            return
        }
        if (password && password !== confirmPass) {
            Alert.alert("Error", "Konfirmasi password tidak cocok")
            return
        }

        const payload: Record<string, string> = {}
        if (name.trim() !== user.name) payload.name = name.trim()
        if (email.trim() !== user.email) payload.email = email.trim()
        if (password) payload.password = password

        const hasChanges = Object.keys(payload).length > 0 || !!avatarUri
        if (!hasChanges) {
            router.back()
            return
        }

        setLoading(true)
        const result = await updateProfile({ ...payload, avatarUri: avatarUri ?? undefined })
        setLoading(false)

        if (result.success) {
            Alert.alert("Berhasil", "Profil berhasil diperbarui", [
                { text: "OK", onPress: () => router.back() },
            ])
            return
        }

        switch (result.error) {
            case "email_taken":
                Alert.alert("Gagal", "Email sudah digunakan akun lain")
                break
            case "network_error":
                Alert.alert("Koneksi Bermasalah", "Periksa koneksi internetmu dan coba lagi")
                break
            default:
                Alert.alert("Gagal", "Terjadi kesalahan, coba lagi")
        }
    }

    const inputTheme = {
        fonts: { bodyLarge: { fontFamily: fontFamily.regular } },
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingTop: insets.top }]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profil</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar picker */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
                        <View style={[styles.avatarWrap, shadows.brand]}>
                            {avatarSource ? (
                                <Image source={avatarSource} style={styles.avatarImg} />
                            ) : (
                                <Text style={styles.initials}>{initials}</Text>
                            )}
                        </View>
                        <View style={styles.cameraBtn}>
                            <Camera size={14} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarHint}>Ketuk untuk ganti foto</Text>
                </View>

                {/* Form */}
                <View style={[styles.card, shadows.md]}>
                    <Text style={styles.sectionLabel}>Informasi Akun</Text>

                    <TextInput
                        label="Nama Lengkap"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        mode="outlined"
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        outlineColor={colors.cream[300]}
                        activeOutlineColor={colors.brand[500]}
                        textColor={colors.text.primary}
                        theme={inputTheme}
                    />

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        mode="outlined"
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        outlineColor={colors.cream[300]}
                        activeOutlineColor={colors.brand[500]}
                        textColor={colors.text.primary}
                        theme={inputTheme}
                    />

                    <View style={styles.divider} />
                    <Text style={styles.sectionLabel}>Ganti Password</Text>
                    <Text style={styles.sectionHint}>Kosongkan jika tidak ingin mengganti password</Text>

                    <TextInput
                        label="Password Baru"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPass}
                        mode="outlined"
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        outlineColor={colors.cream[300]}
                        activeOutlineColor={colors.brand[500]}
                        textColor={colors.text.primary}
                        right={
                            <TextInput.Icon
                                icon={showPass ? "eye-off" : "eye"}
                                onPress={() => setShowPass((v) => !v)}
                                color={colors.text.placeholder}
                            />
                        }
                        theme={inputTheme}
                    />

                    {password.length > 0 && (
                        <TextInput
                            label="Konfirmasi Password Baru"
                            value={confirmPass}
                            onChangeText={setConfirmPass}
                            secureTextEntry={!showPass}
                            mode="outlined"
                            style={styles.input}
                            outlineStyle={styles.inputOutline}
                            outlineColor={colors.cream[300]}
                            activeOutlineColor={
                                confirmPass.length > 0 && confirmPass !== password
                                    ? colors.danger
                                    : colors.brand[500]
                            }
                            textColor={colors.text.primary}
                            theme={inputTheme}
                        />
                    )}

                    {password.length > 0 && password.length < 6 && (
                        <Text style={styles.hint}>Password minimal 6 karakter</Text>
                    )}
                    {confirmPass.length > 0 && confirmPass !== password && (
                        <Text style={styles.hint}>Password tidak cocok</Text>
                    )}

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        style={[styles.saveBtn, shadows.brand, loading && { opacity: 0.7 }]}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <Text style={styles.saveBtnText}>Menyimpan...</Text>
                        ) : (
                            <>
                                <Save size={17} color="#fff" />
                                <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cream[100],
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: radius.md,
        backgroundColor: colors.cream[50],
        borderWidth: 1,
        borderColor: colors.cream[300],
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize.xl,
        color: colors.text.primary,
    },
    scroll: {
        paddingHorizontal: 20,
        paddingBottom: 60,
        gap: 20,
    },
    avatarSection: {
        alignItems: "center",
        paddingVertical: 8,
    },
    avatarWrap: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: colors.brand[500],
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    avatarImg: {
        width: 88,
        height: 88,
        borderRadius: 44,
    },
    initials: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize["2xl"],
        color: "#fff",
    },
    cameraBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.brand[500],
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.cream[100],
    },
    avatarHint: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: 10,
    },
    card: {
        backgroundColor: colors.cream[50],
        borderRadius: radius["2xl"],
        borderWidth: 1,
        borderColor: colors.cream[300],
        padding: 24,
        gap: 14,
    },
    sectionLabel: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.md,
        color: colors.text.primary,
    },
    sectionHint: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.xs,
        color: colors.text.placeholder,
        marginTop: -8,
    },
    divider: {
        height: 1,
        backgroundColor: colors.cream[300],
        marginVertical: 4,
    },
    input: {
        backgroundColor: colors.cream[50],
        fontSize: fontSize.md,
    },
    inputOutline: {
        borderRadius: radius.md,
    },
    hint: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.xs,
        color: colors.accent.orange,
        marginTop: -6,
        paddingLeft: 4,
    },
    saveBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: colors.brand[500],
        paddingVertical: 15,
        borderRadius: radius.lg,
        marginTop: 4,
    },
    saveBtnText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: "#fff",
    },
})