import type { LeaderboardEntry } from '@/types/game';
import { GameDifficulty } from '@/types/game';

export function isValidLeaderboardEntry(
	entry: unknown
): entry is LeaderboardEntry {
	return (
		typeof entry === 'object' &&
		entry !== null &&
		'player' in entry &&
		'points' in entry &&
		'time' in entry &&
		'difficulty' in entry &&
		'date' in entry
	);
}

export function sanitizeLeaderboardEntry(
	entry: LeaderboardEntry
): LeaderboardEntry {
	return {
		player: String(entry.player).trim(),
		points: Math.max(0, Number(entry.points)),
		time: Math.max(0, Number(entry.time)),
		difficulty: entry.difficulty,
		date: new Date(entry.date),
	};
}

export function createEmptyLeaderboard(): Record<
	GameDifficulty,
	LeaderboardEntry[]
> {
	return {
		[GameDifficulty.BEGINNER]: [],
		[GameDifficulty.INTERMEDIATE]: [],
		[GameDifficulty.HARD]: [],
		[GameDifficulty.EXPERT]: [],
	};
}
