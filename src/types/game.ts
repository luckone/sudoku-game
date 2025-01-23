export interface User {
	id?: string;
	name: {
		name: string; // TODO: fix on BE
	};
	scores?: GameScore[];
	isGuest: boolean;
}

export interface CompletedSection {
	type: 'row' | 'column' | 'box';
	index: number;
}

export interface GameScore {
	id?: string;
	points: number;
	difficulty: GameDifficulty;
	date: Date;
	time: number;
}

export interface Cell {
	value: number;
	isPrefilled: boolean;
	hasError: boolean;
	notes: number[];
}

export interface GameState {
	grid: Cell[][];
	selectedCell: [number, number] | null;
	difficulty: GameDifficulty;
	baseScore: number;
	timeBonus: number;
	hintPenalty: number;
	hintsRemaining: number;
	gameTime: number;
	gameStatus: GameStatus;
	movesHistory: Move[];
	solution: number[][];
	completedSections: CompletedSection[];
	leaderboard: Record<GameDifficulty, LeaderboardEntry[]>;
}

export enum GameDifficulty {
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	HARD = 'HARD',
	EXPERT = 'EXPERT',
}

export enum GameStatus {
	IDLE = 'IDLE',
	PLAYING = 'PLAYING',
	COMPLETED = 'COMPLETED',
}

export interface LeaderboardEntry {
	player: string;
	points: number;
	time: number;
	difficulty: GameDifficulty;
	date: Date;
}

export interface Move {
	row: number;
	col: number;
	previousValue: number;
	newValue: number;
	scoreChange: number;
	isHint: boolean;
}
