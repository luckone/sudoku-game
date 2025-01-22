import { GameDifficulty, type LeaderboardEntry } from '@/types/game';

export const mockLeaderboard: Record<GameDifficulty, LeaderboardEntry[]> = {
	[GameDifficulty.BEGINNER]: [
		{
			player: 'Alice',
			points: 1001,
			time: 1200,
			date: new Date(),
			difficulty: GameDifficulty.BEGINNER,
		},
		{
			player: 'Bob',
			points: 987,
			time: 1350,
			date: new Date(),
			difficulty: GameDifficulty.BEGINNER,
		},
		{
			player: 'Charlie',
			points: 954,
			time: 1400,
			date: new Date(),
			difficulty: GameDifficulty.BEGINNER,
		},
	],
	[GameDifficulty.INTERMEDIATE]: [
		{
			player: 'Frank',
			points: 549,
			time: 2400,
			date: new Date(),
			difficulty: GameDifficulty.INTERMEDIATE,
		},
		{
			player: 'Alice',
			points: 543,
			time: 2500,
			date: new Date(),
			difficulty: GameDifficulty.INTERMEDIATE,
		},
		{
			player: 'Rob',
			points: 523,
			time: 2600,
			date: new Date(),
			difficulty: GameDifficulty.INTERMEDIATE,
		},
	],
	[GameDifficulty.HARD]: [
		{
			player: 'David',
			points: 432,
			time: 3000,
			date: new Date(),
			difficulty: GameDifficulty.HARD,
		},
		{
			player: 'Eve',
			points: 421,
			time: 3100,
			date: new Date(),
			difficulty: GameDifficulty.HARD,
		},
	],
	[GameDifficulty.EXPERT]: [
		{
			player: 'Grace',
			points: 321,
			time: 3600,
			date: new Date(),
			difficulty: GameDifficulty.EXPERT,
		},
	],
};
