import { describe, expect, it } from '@jest/globals';
import { sudokuGenerator } from '@/utils/sudokuGenerator';

describe('SudokuGenerator', () => {
	describe('generateSolution', () => {
		it('generates valid 9x9 grid', () => {
			const solution = sudokuGenerator.generateSolution();

			expect(solution.length).toBe(9);
			expect(solution[0].length).toBe(9);
		});

		it('contains numbers 1-9 in each row', () => {
			const solution = sudokuGenerator.generateSolution();

			solution.forEach((row) => {
				const numbers = new Set(row);
				expect(numbers.size).toBe(9);
				for (let i = 1; i <= 9; i++) {
					expect(row).toContain(i);
				}
			});
		});

		it('contains numbers 1-9 in each column', () => {
			const solution = sudokuGenerator.generateSolution();

			for (let col = 0; col < 9; col++) {
				const column = solution.map((row) => row[col]);
				const numbers = new Set(column);
				expect(numbers.size).toBe(9);
				for (let i = 1; i <= 9; i++) {
					expect(column).toContain(i);
				}
			}
		});

		it('contains numbers 1-9 in each 3x3 box', () => {
			const solution = sudokuGenerator.generateSolution();

			for (let boxRow = 0; boxRow < 9; boxRow += 3) {
				for (let boxCol = 0; boxCol < 9; boxCol += 3) {
					const numbers = new Set();
					for (let i = 0; i < 3; i++) {
						for (let j = 0; j < 3; j++) {
							numbers.add(solution[boxRow + i][boxCol + j]);
						}
					}
					expect(numbers.size).toBe(9);
				}
			}
		});
	});
});
