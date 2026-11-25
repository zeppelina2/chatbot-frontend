import axios from "axios";
import { defineStore } from "pinia";

import { apiUser, apiLogout } from "@/api/auth";

interface AuthUser {
  user_id: string;
  username: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthUser | null,
  }),

  actions: {
    async loadUser() {
      const { data } = await apiUser();
      this.user = data;
    },

    async logout() {
      try {
        await apiLogout();
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
      }
      this.user = null;
    },
  },
});
