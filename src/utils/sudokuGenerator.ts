export class SudokuGenerator {
  private generateBaseSolution(): number[][] {
    const base = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));

    base[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let row = 1; row < 9; row++) {
      const shift = row % 3 === 0 ? 1 : 3;
      for (let col = 0; col < 9; col++) {
        base[row][col] = base[row - 1][(col + shift) % 9];
      }
    }

    return base;
  }

  generateSolution(): number[][] {
    const puzzle = this.generateBaseSolution();

    for (let i = 0; i < 100; i++) {
      const operation = Math.floor(Math.random() * 5);

      switch (operation) {
        case 0:
          this.swapRows(puzzle);
          break;
        case 1:
          this.swapColumns(puzzle);
          break;
        case 2:
          this.swapRowBlocks(puzzle);
          break;
        case 3:
          this.swapColumnBlocks(puzzle);
          break;
        case 4:
          this.rotateGrid(puzzle);
          break;
      }
    }

    return puzzle;
  }

  private swapRows(puzzle: number[][]) {
    const block = Math.floor(Math.random() * 3);
    const row1 = block * 3 + Math.floor(Math.random() * 3);
    let row2 = block * 3 + Math.floor(Math.random() * 3);

    while (row2 === row1) {
      row2 = block * 3 + Math.floor(Math.random() * 3);
    }

    [puzzle[row1], puzzle[row2]] = [puzzle[row2], puzzle[row1]];
  }

  private swapColumns(puzzle: number[][]) {
    const block = Math.floor(Math.random() * 3);
    const col1 = block * 3 + Math.floor(Math.random() * 3);
    let col2 = block * 3 + Math.floor(Math.random() * 3);

    while (col2 === col1) {
      col2 = block * 3 + Math.floor(Math.random() * 3);
    }

    for (let row = 0; row < 9; row++) {
      [puzzle[row][col1], puzzle[row][col2]] = [puzzle[row][col2], puzzle[row][col1]];
    }
  }

  private swapRowBlocks(puzzle: number[][]) {
    const block1 = Math.floor(Math.random() * 3);
    let block2 = Math.floor(Math.random() * 3);

    while (block2 === block1) {
      block2 = Math.floor(Math.random() * 3);
    }

    for (let i = 0; i < 3; i++) {
      const row1 = block1 * 3 + i;
      const row2 = block2 * 3 + i;
      [puzzle[row1], puzzle[row2]] = [puzzle[row2], puzzle[row1]];
    }
  }

  private swapColumnBlocks(puzzle: number[][]) {
    const block1 = Math.floor(Math.random() * 3);
    let block2 = Math.floor(Math.random() * 3);

    while (block2 === block1) {
      block2 = Math.floor(Math.random() * 3);
    }

    for (let i = 0; i < 3; i++) {
      const col1 = block1 * 3 + i;
      const col2 = block2 * 3 + i;

      for (let row = 0; row < 9; row++) {
        [puzzle[row][col1], puzzle[row][col2]] = [puzzle[row][col2], puzzle[row][col1]];
      }
    }
  }

  private rotateGrid(puzzle: number[][]) {
    const n = puzzle.length;

    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        [puzzle[i][j], puzzle[j][i]] = [puzzle[j][i], puzzle[i][j]];
      }
    }

    for (let i = 0; i < n; i++) {
      puzzle[i].reverse();
    }
  }
}

export const sudokuGenerator = new SudokuGenerator();
