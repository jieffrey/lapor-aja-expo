import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"
import { useAuthStore } from "@/stores/auth.store"
import { useRouter } from "expo-router"
import { MapPin, UserPlus } from "lucide-react-native"
import { useState } from "react"
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { TextInput } from "react-native-paper"

export default function RegisterScreen() {
    const router = useRouter()
    const registerUser = useAuthStore((s) => s.register)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Error", "Semua field harus diisi")
            return
        }
        if (password !== confirmPass) {
            Alert.alert("Error", "Password tidak cocok")
            return
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password minimal 6 karakter")
            return
        }

        setLoading(true)
        const result = await registerUser(name.trim(), email.trim(), password)
        setLoading(false)

        if (result.success) {
            router.replace("/(main)/(home)")
            return
        }

        switch (result.error) {
            case "email_taken":
                Alert.alert(
                    "Pendaftaran Gagal",
                    result.message || "Email sudah terdaftar"
                )
                break
            case "network_error":
                Alert.alert(
                    "Koneksi Bermasalah",
                    "Tidak bisa terhubung ke server. Periksa koneksi internetmu."
                )
                break
            case "invalid_credentials":
                // register berhasil tapi auto-login gagal
                Alert.alert(
                    "Akun Dibuat",
                    "Akun berhasil dibuat, silakan login"
                )
                router.replace("/(auth)/login")
                break
            default:
                Alert.alert(
                    "Pendaftaran Gagal",
                    result.message || "Terjadi kesalahan, coba lagi"
                )
        }
    }

    const inputTheme = {
        fonts: {
            bodyLarge: { fontFamily: fontFamily.regular },
        },
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Logo */}
                <View style={styles.logoSection}>
                    <View style={[styles.logoIcon, shadows.brand]}>
                        <MapPin size={24} color="#fff" />
                    </View>
                    <Text style={styles.logoText}>LaporAja</Text>
                    <Text style={styles.logoSub}>Buat akun baru</Text>
                </View>

                {/* Form */}
                <View style={[styles.card, shadows.md]}>
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

                    <TextInput
                        label="Password"
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

                    <TextInput
                        label="Konfirmasi Password"
                        value={confirmPass}
                        onChangeText={setConfirmPass}
                        secureTextEntry={!showPass}
                        mode="outlined"
                        style={styles.input}
                        outlineStyle={styles.inputOutline}
                        outlineColor={colors.cream[300]}
                        activeOutlineColor={colors.brand[500]}
                        textColor={colors.text.primary}
                        theme={inputTheme}
                    />

                    {password.length > 0 && password.length < 6 && (
                        <Text style={styles.hint}>
                            Password minimal 6 karakter
                        </Text>
                    )}

                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        style={[
                            styles.submitBtn,
                            shadows.brand,
                            loading && { opacity: 0.7 },
                        ]}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <Text style={styles.submitText}>Mendaftar...</Text>
                        ) : (
                            <>
                                <UserPlus size={18} color="#fff" />
                                <Text style={styles.submitText}>Daftar</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Login link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Sudah punya akun? </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(auth)/login")}
                    >
                        <Text style={styles.footerLink}>Masuk</Text>
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
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    logoSection: {
        alignItems: "center",
        marginBottom: 32,
    },
    logoIcon: {
        width: 56,
        height: 56,
        borderRadius: radius.xl,
        backgroundColor: colors.brand[500],
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    logoText: {
        fontFamily: fontFamily.extrabold,
        fontSize: fontSize["3xl"],
        color: colors.text.primary,
        letterSpacing: -0.5,
    },
    logoSub: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.md,
        color: colors.text.muted,
        marginTop: 4,
    },
    card: {
        backgroundColor: colors.cream[50],
        borderRadius: radius["2xl"],
        borderWidth: 1,
        borderColor: colors.cream[300],
        padding: 24,
        gap: 14,
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
    submitBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: colors.brand[500],
        paddingVertical: 15,
        borderRadius: radius.lg,
        marginTop: 4,
    },
    submitText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.lg,
        color: "#fff",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    footerText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.base,
        color: colors.text.muted,
    },
    footerLink: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.base,
        color: colors.brand[500],
    },
})