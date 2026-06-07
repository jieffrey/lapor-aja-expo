import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import api from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
      const res = await api.post("/auth/login", { email, password });
      const { data, token } = res.data;

      await SecureStore.setItemAsync("token", token);

      set({
        user: data,
        token,
        isAuthenticated: true,
      });

      return true;
    } catch {
      return false;
    }
  },

  register: async (name, email, password) => {
    try {
      await api.post("/auth/register", { name, email, password });
      // Auto-login after register
      return await get().login(email, password);
    } catch {
      return false;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  loadSession: async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const seen = await SecureStore.getItemAsync("onboarding_seen");

      if (!token) {
        set({ loading: false, hasSeenOnboarding: seen === "true" });
        return;
      }

      // Verify token by fetching user profile
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
      const res = await api.get(`/user/${user.id}`);
      if (res.data.success) {
        set({ user: { ...user, points: res.data.data.points } });
      }
    } catch {}
  },

  setOnboardingSeen: async () => {
    await SecureStore.setItemAsync("onboarding_seen", "true");
    set({ hasSeenOnboarding: true });
  },
}));
