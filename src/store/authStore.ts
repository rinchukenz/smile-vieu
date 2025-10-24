// src/store/authStore.ts
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface AuthData {
  userId: string;
  accessToken: string;
  refreshToken: string | null;
}

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (data: AuthData) => Promise<void>;
  loadAuthFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  accessToken: null,
  refreshToken: null,

  setAuth: async (data: AuthData) => {
    // Update Zustand state immediately
    set({
      userId: data.userId,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? null,
    });

    // Save to SecureStore asynchronously
    try {
      await SecureStore.setItemAsync("userId", data.userId);
      await SecureStore.setItemAsync("accessToken", data.accessToken);
      if (data.refreshToken) {
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
      } else {
        await SecureStore.deleteItemAsync("refreshToken");
      }
    } catch (err) {
      console.error("Failed to save auth data to SecureStore:", err);
    }
  },

  loadAuthFromStorage: async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (userId && accessToken) {
        set({
          userId,
          accessToken,
          refreshToken,
        });
      }
    } catch (err) {
      console.error("Failed to load auth data from SecureStore:", err);
    }
  },
}));
