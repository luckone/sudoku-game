import axios from 'axios';
import { GameDifficulty, type User, type LeaderboardEntry } from '@/types/game';
import {
	isValidLeaderboardEntry,
	sanitizeLeaderboardEntry,
	createEmptyLeaderboard,
} from '@/utils/validators';

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
		return sanitizeLeaderboardEntry(response.data);
	},

	getLeaderboard: async (): Promise<
		Record<GameDifficulty, LeaderboardEntry[]>
	> => {
		const response = await api.get<{
			leaderboard: Record<GameDifficulty, unknown>;
		}>('/scores/leaderboard');
		const data = response.data.leaderboard;
		const validLeaderboard = createEmptyLeaderboard();

		Object.values(GameDifficulty).forEach((difficulty) => {
			const entries = Array.isArray(data[difficulty]) ? data[difficulty] : [];
			validLeaderboard[difficulty] = entries
				.filter(isValidLeaderboardEntry)
				.map(sanitizeLeaderboardEntry);
		});

		return validLeaderboard;
	},
};
