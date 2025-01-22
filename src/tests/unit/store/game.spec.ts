import { describe, expect, it } from '@jest/globals';
import { createPinia, setActivePinia } from 'pinia';
import { useGameStore } from '@/stores/game';
import { GameDifficulty } from '@/types/game';

describe('Game Store', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	describe('scoring system', () => {
		it('adds 5 points for correct move', () => {
			const store = useGameStore();
			store.initializeGame(GameDifficulty.BEGINNER);
			const initialScore = store.baseScore;

			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					if (!store.grid[row][col].isPrefilled) {
						store.makeMove(row, col, store.solution[row][col]);
						expect(store.baseScore).toBe(initialScore + 5);
						return;
					}
				}
			}
		});

		it('subtracts 1 point for error', () => {
			const store = useGameStore();
			store.initializeGame(GameDifficulty.BEGINNER);
			const initialScore = store.baseScore;

			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					if (!store.grid[row][col].isPrefilled) {
						const wrongValue = (store.solution[row][col] % 9) + 1;
						store.makeMove(row, col, wrongValue);
						expect(store.baseScore).toBe(initialScore - 1);
						return;
					}
				}
			}
		});

		it('handles increasing hint penalties', () => {
			const store = useGameStore();
			store.initializeGame(GameDifficulty.BEGINNER);
			const initialScore = store.baseScore;

			for (let i = 0; i < 3; i++) {
				const expectedPenalty = -(3 + i);
				for (let row = 0; row < 9; row++) {
					for (let col = 0; col < 9; col++) {
						if (
							!store.grid[row][col].isPrefilled &&
							store.grid[row][col].value === 0
						) {
							store.useHint(row, col);
							expect(store.baseScore).toBe(initialScore + expectedPenalty);
							return;
						}
					}
				}
			}
		});

		it('calculates final score correctly with time bonus', () => {
			const store = useGameStore();
			store.initializeGame(GameDifficulty.BEGINNER);
			store.gameTime = 120;

			store.calculateFinalScore();
			expect(store.timeBonus).toBe(500 - 120);
			expect(store.totalScore).toBe(store.baseScore + store.timeBonus);
		});
	});
});
