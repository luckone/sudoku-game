import { defineStore } from 'pinia';
import { GameDifficulty, type GameState, GameStatus } from '@/types/game';
import { sudokuGenerator } from '@/utils/sudokuGenerator.ts';
import { scoreApi } from '@/api';
import { useAuthStore } from './auth';
import { GAME_CONSTANTS } from '@/constants';

/**
 * @store GameStore
 * @description Central store managing Sudoku game state and logic
 * Handles game initialization, move validation, scoring, and game progression
 * Integrates with authentication and leaderboard systems
 */

export const useGameStore = defineStore('game', {
	state: (): GameState => ({
		grid: Array(GAME_CONSTANTS.GRID_SIZE)
			.fill(null)
			.map(() =>
				Array(GAME_CONSTANTS.GRID_SIZE)
					.fill(null)
					.map(() => ({
						value: 0,
						isPrefilled: false,
						hasError: false,
						notes: [],
					}))
			),
		selectedCell: null,
		difficulty: GameDifficulty.BEGINNER,
		baseScore: 0,
		timeBonus: 0,
		hintPenalty: GAME_CONSTANTS.SCORING.INITIAL_HINT_PENALTY,
		hintsRemaining: GAME_CONSTANTS.SCORING.STARTING_HINTS,
		gameTime: 0,
		gameStatus: GameStatus.IDLE,
		movesHistory: [],
		solution: Array(GAME_CONSTANTS.GRID_SIZE)
			.fill(null)
			.map(() => Array(GAME_CONSTANTS.GRID_SIZE).fill(0)),
		completedSections: [],
		leaderboard: {
			[GameDifficulty.BEGINNER]: [],
			[GameDifficulty.INTERMEDIATE]: [],
			[GameDifficulty.HARD]: [],
			[GameDifficulty.EXPERT]: [],
		},
	}),

	actions: {
		// Saves your score to the leaderboard if you're logged in
		async saveScore() {
			const authStore = useAuthStore();
			if (this.isGameComplete && !authStore.user.isGuest && authStore.user.id) {
				try {
					await scoreApi.submit({
						userId: authStore.user.id,
						points: this.totalScore,
						time: this.gameTime,
						difficulty: this.difficulty,
					});
					await this.fetchLeaderboard();
				} catch (error) {
					console.error('Error saving score:', error);
					throw error;
				}
			}
		},

		// Gets the latest high scores from the server
		async fetchLeaderboard() {
			try {
				const response = await scoreApi.getLeaderboard();
				this.leaderboard = response;
			} catch (error) {
				console.error('Error fetching leaderboard:', error);
				throw error;
			}
		},

		// Takes a solved puzzle and hides numbers based on difficulty
		// More numbers are hidden for harder difficulties
		createPuzzleFromSolution(solution: number[][], difficulty: GameDifficulty) {
			const puzzle = solution.map((row) =>
				row.map((value) => ({
					value,
					isPrefilled: true,
					hasError: false,
					notes: [],
				}))
			);

			// Different difficulties have different ranges of visible numbers
			const visibleCells =
				Math.floor(
					Math.random() *
						(GAME_CONSTANTS.VISIBLE_CELLS[difficulty].MAX -
							GAME_CONSTANTS.VISIBLE_CELLS[difficulty].MIN +
							1)
				) + GAME_CONSTANTS.VISIBLE_CELLS[difficulty].MIN;

			const cellsToHide = GAME_CONSTANTS.TOTAL_CELLS - visibleCells;

			// Randomly hide cells until we reach target number
			let hiddenCells = 0;
			while (hiddenCells < cellsToHide) {
				const row = Math.floor(Math.random() * GAME_CONSTANTS.GRID_SIZE);
				const col = Math.floor(Math.random() * GAME_CONSTANTS.GRID_SIZE);

				if (puzzle[row][col].isPrefilled) {
					puzzle[row][col] = {
						value: 0,
						isPrefilled: false,
						hasError: false,
						notes: [],
					};
					hiddenCells++;
				}
			}

			return puzzle;
		},

		// Handles when you put a number in a cell
		// Checks if it's correct and updates your score
		makeMove(row: number, col: number, value: number) {
			if (this.grid[row][col].isPrefilled) return;

			const previousValue = this.grid[row][col].value;
			const previousScore = this.baseScore;

			this.grid[row][col].value = value;
			this.validateMove(row, col);

			const scoreChange = this.baseScore - previousScore;

			this.movesHistory.push({
				row,
				col,
				previousValue,
				newValue: value,
				scoreChange,
				isHint: false,
			});
		},

		// Checks if a move follows Sudoku rules
		// Updates the cell's error state and score
		validateMove(row: number, col: number) {
			const value = this.grid[row][col].value;
			let hasError = false;

			if (value !== this.solution[row][col]) {
				hasError = true;
			}

			this.grid[row][col].hasError = hasError;
			this.updateScore(hasError);
			if (!hasError) {
				this.checkCompletedSections(row, col);
			}
		},

		// Checks if you've completed any rows, columns, or boxes
		// Called after each move
		checkCompletedSections(row: number, col: number) {
			const isRowComplete = this.grid[row].every(
				(cell) =>
					!cell.hasError && cell.value === this.solution[row][cell.value - 1]
			);
			if (isRowComplete) {
				this.addCompletedSection('row', row);
			}

			const isColumnComplete = this.grid.every(
				(rowArray) =>
					!rowArray[col].hasError &&
					rowArray[col].value === this.solution[rowArray[col].value - 1][col]
			);
			if (isColumnComplete) {
				this.addCompletedSection('column', col);
			}

			const boxRow =
				Math.floor(row / GAME_CONSTANTS.BOX_SIZE) * GAME_CONSTANTS.BOX_SIZE;
			const boxCol =
				Math.floor(col / GAME_CONSTANTS.BOX_SIZE) * GAME_CONSTANTS.BOX_SIZE;
			let isBoxComplete = true;

			// Check all cells in the 3x3 box
			for (let i = 0; i < GAME_CONSTANTS.BOX_SIZE && isBoxComplete; i++) {
				for (let j = 0; j < GAME_CONSTANTS.BOX_SIZE; j++) {
					const cell = this.grid[boxRow + i][boxCol + j];
					const solutionVal = this.solution[boxRow + i][boxCol + j];
					if (cell.value === 0 || cell.hasError || cell.value !== solutionVal) {
						isBoxComplete = false;
						break;
					}
				}
			}

			if (isBoxComplete) {
				const boxIndex =
					Math.floor(row / GAME_CONSTANTS.BOX_SIZE) * GAME_CONSTANTS.BOX_SIZE +
					Math.floor(col / GAME_CONSTANTS.BOX_SIZE);
				this.addCompletedSection('box', boxIndex);
			}
		},

		// Marks a section (row/column/box) as complete
		addCompletedSection(type: 'row' | 'column' | 'box', index: number) {
			const sectionExists = this.completedSections.some(
				(section) => section.type === type && section.index === index
			);

			if (!sectionExists) {
				this.completedSections.push({ type, index });
			}
		},

		updateScore(isError: boolean) {
			this.baseScore += isError
				? GAME_CONSTANTS.SCORING.ERROR_PENALTY
				: GAME_CONSTANTS.SCORING.CORRECT_MOVE;
		},

		// Gives you the correct number for a cell
		// Costs points and increases future hint penalties
		useHint(row: number, col: number) {
			if (this.hintsRemaining > 0 && !this.grid[row][col].isPrefilled) {
				const correctValue = this.solution[row][col];
				const previousValue = this.grid[row][col].value;
				const previousScore = this.baseScore;

				this.grid[row][col].value = correctValue;
				this.grid[row][col].hasError = false;

				this.baseScore -= this.hintPenalty;
				this.hintsRemaining--;
				this.hintPenalty++; // Each subsequent hint costs more

				const scoreChange = this.baseScore - previousScore;

				this.movesHistory.push({
					row,
					col,
					previousValue,
					newValue: correctValue,
					scoreChange,
					isHint: true,
				});

				this.checkCompletedSections(row, col);
			}
		},

		// Takes back your last move
		// Removes any errors and rechecks completed sections
		undoMove() {
			const lastMove = this.movesHistory.pop();
			if (lastMove) {
				const { row, col, previousValue } = lastMove;

				this.grid[row][col].value = previousValue;
				this.grid[row][col].hasError = false;

				this.revalidateCompletedSections();
			}
		},

		// Rechecks all completed sections after undoing
		revalidateCompletedSections() {
			this.completedSections = [];
			for (let i = 0; i < GAME_CONSTANTS.GRID_SIZE; i++) {
				for (let j = 0; j < GAME_CONSTANTS.GRID_SIZE; j++) {
					if (this.grid[i][j].value !== 0) {
						this.checkCompletedSections(i, j);
					}
				}
			}
		},

		// Adds time bonus and saves your final score
		async calculateFinalScore() {
			this.timeBonus = Math.max(
				0,
				GAME_CONSTANTS.SCORING.MAX_TIME_BONUS - this.gameTime
			);
			this.gameStatus = GameStatus.COMPLETED;
			await this.saveScore();
		},

		// Sets up a new game with chosen difficulty
		// Generates puzzle and resets all game stats
		async initializeGame(difficulty: GameDifficulty) {
			const solution = sudokuGenerator.generateSolution();
			this.solution = JSON.parse(JSON.stringify(solution));
			this.grid = this.createPuzzleFromSolution(solution, difficulty);
			this.difficulty = difficulty;
			this.gameStatus = GameStatus.PLAYING;
			this.baseScore = 0;
			this.timeBonus = 0;
			this.hintPenalty = GAME_CONSTANTS.SCORING.INITIAL_HINT_PENALTY;
			this.hintsRemaining = GAME_CONSTANTS.SCORING.STARTING_HINTS;
			this.gameTime = 0;
			this.movesHistory = [];
			this.completedSections = [];
		},

		incrementTime() {
			this.gameTime++;
		},
	},

	getters: {
		totalScore: (state): number => {
			return state.baseScore + state.timeBonus;
		},

		canUndo: (state) => state.movesHistory.length > 0,

		isGameComplete(): boolean {
			for (let row = 0; row < GAME_CONSTANTS.GRID_SIZE; row++) {
				for (let col = 0; col < GAME_CONSTANTS.GRID_SIZE; col++) {
					if (this.grid[row][col].value === 0 || this.grid[row][col].hasError) {
						return false;
					}
				}
			}
			return true;
		},

		isHighScore(): boolean {
			return this.totalScore > 0;
		},

		completedDigits: (state): number[] => {
			const digitCounts = new Array(GAME_CONSTANTS.GRID_SIZE + 1).fill(0);

			for (let row = 0; row < GAME_CONSTANTS.GRID_SIZE; row++) {
				for (let col = 0; col < GAME_CONSTANTS.GRID_SIZE; col++) {
					const value = state.grid[row][col].value;
					if (value > 0) {
						digitCounts[value]++;
					}
				}
			}

			return digitCounts
				.map((count, digit) => ({ digit, count }))
				.filter(
					({ digit, count }) => digit !== 0 && count >= GAME_CONSTANTS.GRID_SIZE
				)
				.map(({ digit }) => digit);
		},
	},
});
