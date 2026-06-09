import { getUserById, loginApi, registerApi } from "@/lib/auth";
import api from "@/lib/api";
import type { User } from "@/lib/types";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type AuthError =
    | "invalid_credentials"
    | "role_forbidden"
    | "network_error"
    | "email_taken"
    | "unknown";

export type AuthResult =
    | { success: true }
    | { success: false; error: AuthError };

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    hasSeenOnboarding: boolean;

    login: (email: string, password: string) => Promise<AuthResult>;
    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<AuthResult>;
    logout: () => Promise<void>;
    loadSession: () => Promise<void>;
    refreshPoints: () => Promise<void>;
    setOnboardingSeen: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    loading: true,
    isAuthenticated: false,
    hasSeenOnboarding: false,

    login: async (email, password) => {
        try {
            const res = await loginApi(email, password);

            if (!res.success) {
                return { success: false, error: "invalid_credentials" };
            }

            // Block admin/superadmin dari mobile
            if (res.data.role !== "user") {
                return { success: false, error: "role_forbidden" };
            }

            await SecureStore.setItemAsync("token", res.token);
            set({
                user: res.data,
                token: res.token,
                isAuthenticated: true,
            });

            return { success: true };
        } catch (e: any) {
            const msg = e?.message ?? "";
            if (
                e?.code === "ECONNABORTED" ||
                msg.includes("Network") ||
                msg.includes("timeout")
            ) {
                return { success: false, error: "network_error" };
            }
            // Axios 4xx dari server (email/password salah)
            if (e?.response?.status === 401 || e?.response?.status === 400) {
                return { success: false, error: "invalid_credentials" };
            }
            return { success: false, error: "unknown" };
        }
    },

    register: async (name, email, password) => {
        try {
            await registerApi(name, email, password);
            return await get().login(email, password);
        } catch (e: any) {
            const status = e?.response?.status;
            if (status === 409 || status === 400) {
                return { success: false, error: "email_taken" };
            }
            const msg = e?.message ?? "";
            if (msg.includes("Network") || msg.includes("timeout")) {
                return { success: false, error: "network_error" };
            }
            return { success: false, error: "unknown" };
        }
    },

    logout: async () => {
        await SecureStore.deleteItemAsync("token");
        set({ user: null, token: null, isAuthenticated: false });
    },

    loadSession: async () => {
        try {
            const token = await SecureStore.getItemAsync("token");
            const seen = await SecureStore.getItemAsync("onboarding_seen");

            if (!token) {
                set({ loading: false, hasSeenOnboarding: seen === "true" });
                return;
            }

            const res = await api.get("/auth/me");

            if (res.data.success) {
                set({
                    user: res.data.data,
                    token,
                    isAuthenticated: true,
                    loading: false,
                    hasSeenOnboarding: seen === "true",
                });
            } else {
                await SecureStore.deleteItemAsync("token");
                set({ loading: false, hasSeenOnboarding: seen === "true" });
            }
        } catch {
            await SecureStore.deleteItemAsync("token");
            set({ loading: false });
        }
    },

    refreshPoints: async () => {
        const { user } = get();
        if (!user) return;
        try {
            const fresh = await getUserById(user.id);
            set({ user: { ...user, points: fresh.points } });
        } catch {}
    },

    setOnboardingSeen: async () => {
        await SecureStore.setItemAsync("onboarding_seen", "true");
        set({ hasSeenOnboarding: true });
    },
}));