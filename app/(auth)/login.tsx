import { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from "react-native"
import { useRouter } from "expo-router"
import { TextInput } from "react-native-paper"
import { MapPin, LogIn } from "lucide-react-native"
import { useAuthStore } from "@/stores/auth.store"
import { colors, fontFamily, fontSize, radius, shadows } from "@/lib/theme"

export default function LoginScreen() {
    const router = useRouter()
    const login = useAuthStore((s) => s.login)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Email dan password harus diisi")
            return
        }

        setLoading(true)
        const result = await login(email.trim(), password)
        setLoading(false)

        if (result.success) {
            router.replace("/(main)/(home)")
            return
        }

        switch (result.error) {
            case "invalid_credentials":
                Alert.alert("Login Gagal", "Email atau password salah")
                break
            case "role_forbidden":
                Alert.alert(
                    "Akses Ditolak",
                    "Akun admin hanya bisa diakses melalui web"
                )
                break
            case "network_error":
                Alert.alert(
                    "Koneksi Bermasalah",
                    "Tidak bisa terhubung ke server. Periksa koneksi internetmu."
                )
                break
            default:
                Alert.alert("Login Gagal", "Terjadi kesalahan, coba lagi")
        }
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
                {/* Logo section */}
                <View style={styles.logoSection}>
                    <View style={[styles.logoIcon, shadows.brand]}>
                        <MapPin size={24} color="#fff" />
                    </View>
                    <Text style={styles.logoText}>LaporAja</Text>
                    <Text style={styles.logoSub}>Masuk ke akunmu</Text>
                </View>

                {/* Form card */}
                <View style={[styles.card, shadows.md]}>
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
                        theme={{
                            fonts: {
                                bodyLarge: { fontFamily: fontFamily.regular },
                            },
                        }}
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
                        theme={{
                            fonts: {
                                bodyLarge: { fontFamily: fontFamily.regular },
                            },
                        }}
                    />

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        style={[
                            styles.submitBtn,
                            shadows.brand,
                            loading && { opacity: 0.7 },
                        ]}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <Text style={styles.submitText}>Masuk...</Text>
                        ) : (
                            <>
                                <LogIn size={18} color="#fff" />
                                <Text style={styles.submitText}>Masuk</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Register link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Belum punya akun? </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(auth)/register")}
                    >
                        <Text style={styles.footerLink}>Daftar</Text>
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
        marginBottom: 36,
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
        gap: 16,
    },
    input: {
        backgroundColor: colors.cream[50],
        fontSize: fontSize.md,
    },
    inputOutline: {
        borderRadius: radius.md,
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