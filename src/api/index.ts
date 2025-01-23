import axios from 'axios';
import type { User, GameDifficulty, LeaderboardEntry } from '@/types/game';

const api = axios.create({
	baseURL: 'https://sudoku-game-backend-production.up.railway.app/api',
});

export const userApi = {
	create: async (name: string): Promise<User> => {
		const response = await api.post<User>('/users', { name });
		return response.data;
	},
};

export const scoreApi = {
	submit: async (score: {
		userId: string;
		points: number;
		time: number;
		difficulty: GameDifficulty;
	}) => {
		const response = await api.post<LeaderboardEntry>('/scores', score);
		return response.data;
	},

	getLeaderboard: async (): Promise<
		Record<GameDifficulty, LeaderboardEntry[]>
	> => {
		const response = await api.get<{
			leaderboard: Record<GameDifficulty, LeaderboardEntry[]>;
		}>('/scores/leaderboard');
		return response.data.leaderboard;
	},
};
