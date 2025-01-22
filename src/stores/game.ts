import { defineStore } from 'pinia';
import { GameDifficulty, type GameState, GameStatus } from '@/types/game';
import { sudokuGenerator } from '@/utils/sudokuGenerator.ts';
import { mockLeaderboard } from '@/mock/leaderboard.ts';

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    grid: Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => ({
            value: 0,
            isPrefilled: false,
            hasError: false,
            notes: [],
          })),
      ),
    selectedCell: null,
    difficulty: GameDifficulty.BEGINNER,
    baseScore: 0,
    timeBonus: 0,
    hintPenalty: 3,
    hintsRemaining: 10,
    gameTime: 0,
    gameStatus: GameStatus.IDLE,
    movesHistory: [],
    solution: Array(9)
      .fill(null)
      .map(() => Array(9).fill(0)),
    completedSections: [],
    leaderboard: mockLeaderboard,
  }),

  actions: {
    createPuzzleFromSolution(solution: number[][], difficulty: GameDifficulty) {
      const puzzle = solution.map((row) =>
        row.map((value) => ({
          value,
          isPrefilled: true,
          hasError: false,
          notes: [],
        })),
      );

      const totalCells = 81;
      const visibleCellsRange = {
        [GameDifficulty.BEGINNER]: { min: 36, max: 40 },
        [GameDifficulty.INTERMEDIATE]: { min: 32, max: 36 },
        [GameDifficulty.HARD]: { min: 28, max: 32 },
        [GameDifficulty.EXPERT]: { min: 24, max: 28 },
      };

      const range = visibleCellsRange[difficulty];
      const visibleCells = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const cellsToHide = totalCells - visibleCells;

      let hiddenCells = 0;
      while (hiddenCells < cellsToHide) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

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

      let visibleCount = 0;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (puzzle[i][j].isPrefilled) {
            visibleCount++;
          }
        }
      }

      return puzzle;
    },

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

    checkCompletedSections(row: number, col: number) {
      const isRowComplete = this.grid[row].every((cell) => cell.value !== 0 && !cell.hasError);
      if (isRowComplete) {
        this.addCompletedSection('row', row);
      }

      const isColumnComplete = this.grid.every((row) => row[col].value !== 0 && !row[col].hasError);
      if (isColumnComplete) {
        this.addCompletedSection('column', col);
      }

      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      let isBoxComplete = true;
      for (let i = 0; i < 3 && isBoxComplete; i++) {
        for (let j = 0; j < 3; j++) {
          const cell = this.grid[boxRow + i][boxCol + j];
          if (cell.value === 0 || cell.hasError) {
            isBoxComplete = false;
            break;
          }
        }
      }
      if (isBoxComplete) {
        const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        this.addCompletedSection('box', boxIndex);
      }
    },

    addCompletedSection(type: 'row' | 'column' | 'box', index: number) {
      const existing = this.completedSections.find(
        (section) => section.type === type && section.index === index,
      );
      if (!existing) {
        this.completedSections.push({
          type,
          index,
        });
      }
    },

    updateScore(isError: boolean) {
      this.baseScore += isError ? -1 : 5;
    },

    useHint(row: number, col: number) {
      if (this.hintsRemaining > 0 && !this.grid[row][col].isPrefilled) {
        const correctValue = this.solution[row][col];
        const previousValue = this.grid[row][col].value;
        const previousScore = this.baseScore;

        this.grid[row][col].value = correctValue;
        this.grid[row][col].hasError = false;

        this.baseScore -= this.hintPenalty;
        this.hintsRemaining--;
        this.hintPenalty++;

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

    undoMove() {
      const lastMove = this.movesHistory.pop();
      if (lastMove) {
        const { row, col, previousValue } = lastMove;

        this.grid[row][col].value = previousValue;
        this.grid[row][col].hasError = false;

        this.revalidateCompletedSections();
      }
    },

    revalidateCompletedSections() {
      this.completedSections = [];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (this.grid[i][j].value !== 0) {
            this.checkCompletedSections(i, j);
          }
        }
      }
    },

    calculateFinalScore() {
      this.timeBonus = Math.max(0, 500 - this.gameTime);
      this.gameStatus = GameStatus.COMPLETED;
    },

    initializeGame(difficulty: GameDifficulty) {
      const solution = sudokuGenerator.generateSolution();
      this.solution = JSON.parse(JSON.stringify(solution));
      this.grid = this.createPuzzleFromSolution(solution, difficulty);
      this.difficulty = difficulty;
      this.gameStatus = GameStatus.PLAYING;
      this.baseScore = 0;
      this.timeBonus = 0;
      this.hintPenalty = 3;
      this.hintsRemaining = 10;
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
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
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
      const digitCounts = new Array(10).fill(0);

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const value = state.grid[row][col].value;
          if (value > 0) {
            digitCounts[value]++;
          }
        }
      }

      return digitCounts
        .map((count, digit) => ({ digit, count }))
        .filter(({ digit, count }) => digit !== 0 && count >= 9)
        .map(({ digit }) => digit);
    },
  },
});
