import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, Path, Circle } from "react-native-svg";

const { height, width } = Dimensions.get("window");

interface Props {
    isVisible: boolean;
    onExitComplete?: () => void;
}

export default function SplashScreen({ isVisible, onExitComplete }: Props) {
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const logoY = useRef(new Animated.Value(20)).current;
    const borderRadius = useRef(new Animated.Value(0)).current;
    const animRef = useRef<Animated.CompositeAnimation | null>(null);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        animRef.current?.stop();
        if (isVisible) {
            animRef.current = Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(logoY, { toValue: 0, duration: 700, useNativeDriver: true }),
            ]);
            animRef.current.start();
        } else {
            animRef.current = Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -height,
                    duration: 1100,
                    useNativeDriver: false,
                }),
                Animated.timing(borderRadius, {
                    toValue: width * 0.6,
                    duration: 1100,
                    useNativeDriver: false,
                }),
            ]);
            animRef.current.start(() => { if (mounted.current) onExitComplete?.(); });
        }
        return () => animRef.current?.stop();
    }, [isVisible]);

    return (
        <Animated.View style={[
            styles.root,
            {
                transform: [{ translateY }],
                borderBottomLeftRadius: borderRadius,
                borderBottomRightRadius: borderRadius,
            }
        ]}>
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <Animated.View style={[styles.content, { opacity, transform: [{ translateY: logoY }] }]}>
                {/* Ikon laporan / pengaduan */}
                <Svg width={72} height={72} viewBox="0 0 24 24">
                    <Rect width="24" height="24" rx="6" fill="rgba(255,255,255,0.15)" />
                    <Path
                        d="M7 8h10M7 12h6M7 16h8"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <Circle cx="18" cy="16" r="3.5" fill="white" />
                    <Path
                        d="M18 14.8v1.2h1.2"
                        stroke="#0F766E"
                        strokeWidth="1"
                        strokeLinecap="round"
                    />
                </Svg>

                <View style={styles.textWrap}>
                    <Text style={styles.title}>
                        Lapor<Text style={styles.titleFade}>Aja</Text>
                    </Text>
                    <Text style={styles.sub}>Platform Pengaduan Publik</Text>
                </View>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    root: {
        position: "absolute",
        top: 0, left: 0,
        width, height,
        backgroundColor: "#0F766E",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        overflow: "hidden",
    },
    circle1: {
        position: "absolute",
        width: 380, height: 380, borderRadius: 999,
        borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
        top: "50%", left: "50%",
        marginTop: -190, marginLeft: -190,
    },
    circle2: {
        position: "absolute",
        width: 560, height: 560, borderRadius: 999,
        borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
        top: "50%", left: "50%",
        marginTop: -280, marginLeft: -280,
    },
    content: { alignItems: "center", gap: 24 },
    textWrap: { alignItems: "center", gap: 10 },
    title: {
        fontSize: 42, fontWeight: "800", color: "#fff",
        letterSpacing: -1, lineHeight: 48,
    },
    titleFade: { color: "rgba(255,255,255,0.4)" },
    sub: {
        fontSize: 11, color: "rgba(255,255,255,0.45)",
        letterSpacing: 3, fontWeight: "600",
        textTransform: "uppercase",
    },
});