import { defineStore } from 'pinia';
import { userApi } from '@/api';
import type { User } from '@/types/game';

interface AuthState {
	user: User;
}

/**
 * @store AuthStore
 * @description Manages user authentication state and interactions
 * Handles guest vs authenticated users, persists data
 * Integrates with user API for account management
 */

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
