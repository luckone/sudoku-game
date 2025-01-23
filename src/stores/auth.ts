import { defineStore } from 'pinia';
import { userApi } from '@/api';
import type { User } from '@/types/game';

interface AuthState {
	user: User;
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		user: {
			name: {
				name: 'Guest',
			},
			isGuest: true,
			scores: [],
		},
	}),

	actions: {
		async signIn(name: string) {
			try {
				const user = await userApi.create(name);
				this.user = {
					...user,
					isGuest: false,
				};
				return user;
			} catch (error) {
				console.error('Sign in error:', error);
				throw error;
			}
		},
	},
	persist: true,
});
