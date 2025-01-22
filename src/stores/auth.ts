import { defineStore } from 'pinia';
import type { User } from '@/types/game';

export interface AuthState {
  user: User;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: {
      name: 'Guest',
      isGuest: true,
    },
  }),

  actions: {
    signIn(name: string) {
      this.user = {
        name,
        isGuest: false,
        scores: [],
      };
    },
  },
});
