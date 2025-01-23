import { describe, expect, it } from '@jest/globals';
import { useGameStore } from '@/stores/game';
import { createPinia, setActivePinia } from 'pinia';

describe('Game Validations', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	describe('validateMove', () => {
		it('detects row conflicts', () => {
			const store = useGameStore();
			const grid = Array(9)
				.fill(0)
				.map(() => Array(9).fill({ value: 0, isPrefilled: false }));
			grid[0][0] = { value: 1, isPrefilled: false };

			store.grid = grid;
			store.makeMove(0, 1, 1);

			expect(store.grid[0][1].hasError).toBe(true);
		});

		it('detects column conflicts', () => {
			const store = useGameStore();
			const grid = Array(9)
				.fill(0)
				.map(() => Array(9).fill({ value: 0, isPrefilled: false }));
			grid[0][0] = { value: 1, isPrefilled: false };

			store.grid = grid;
			store.makeMove(1, 0, 1);

			expect(store.grid[1][0].hasError).toBe(true);
		});

		it('detects box conflicts', () => {
			const store = useGameStore();
			const grid = Array(9)
				.fill(0)
				.map(() => Array(9).fill({ value: 0, isPrefilled: false }));
			grid[0][0] = { value: 1, isPrefilled: false };

			store.grid = grid;
			store.makeMove(1, 1, 1);

			expect(store.grid[1][1].hasError).toBe(true);
		});
	});
});
