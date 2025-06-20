import type { Position } from "./priority-algorithm";
import { gaussianPriority } from "./priority-algorithm";

type SudokuGrid = number[][];
type SudokuComplete = { puzzle: SudokuGrid; solution: SudokuGrid };

const _commonDifficultyLevelsByMissingCells = {
  WayTooEasy: [0, 40],
  Easy: [41, 45],
  Medium: [46, 49],
  Advanced: [50, 53],
  Hard: [54, 56],
  VeryHard: [57, 59],
  DiabolicExpert: [60, 64],
};

const logDisplayBoard = (board: number[][]) => {
  process.stdout.write("\x1b[0;0H\x1b[2J");
  console.log("=====================");

  board.forEach((row, i) => {
    console.log(
      row
        .map((col, i) => {
          const cell = col === 0 ? "•" : col;
          if ((i + 1) % 3 === 0 && i !== 8) return `${cell} |`;
          return cell;
        })
        .join(" "),
    );
    if ((i + 1) % 3 === 0 && i !== 8) console.log("---------------------");
  });
};

const logProgress = (
  startTime: number,
  posIndex?: number,
  emptyCells?: number,
  attempts?: number,
  resets?: number,
) => {
  process.stdout.write("\x1b[1A\x1b[2K");

  const elapsedMs = Date.now() - startTime;
  const date = new Date(elapsedMs);

  const formatted = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);

  console.info(
    `Elapsed time: ${formatted} - Backtrack index: ${posIndex} - Empty cells: ${emptyCells} - Attempts: ${attempts} - Resets: ${resets}`,
  );
  return formatted;
};

export class Sudoku {
  private board: SudokuGrid;
  private completeBoard: SudokuGrid;

  private attemptTimeoutMs = 0;

  private readonly config = {
    maxBacktrackTimeoutMs: 2000, // Default, overridden in constructor
    maxDifficultyLevel: 64,
    generatorTimeoutSeconds: 900,
    resetThreshold: 10, // Default, overridden in constructor
    difficultyLevel: 0,
  };

  private stats = {
    generatorCreatedAt: 0,
    generatorFinishedAt: 0,
    generatorTimeTaken: "",
    success: false,
    counter: {
      removeNumAttempt: 0,
      backtrackTimeout: 0,
      hardReset: 0,
      possibleSolution: 0,
    },
    execution: {
      solver: 0,
      backtrack: 0,
    },
  };

  private validNumbers: Set<number>[][] = Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])),
    );

  private priorityAlgorithm: () => Position[];

  constructor(difficulty: number, priorityAlgorithm: () => Position[]) {
    this.stats.generatorCreatedAt = Date.now();
    this.config.difficultyLevel = difficulty;
    this.priorityAlgorithm = priorityAlgorithm;

    // Scale with difficulty, longer time for harder puzzles
    this.config.resetThreshold = Math.max(
      5,
      Math.floor(60 - this.config.difficultyLevel),
    );

    this.config.maxBacktrackTimeoutMs = this.calculateBacktrackTimeout(
      this.config.difficultyLevel,
    );

    this.board = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));

    this.solver(0, 0);
    this.completeBoard = JSON.parse(JSON.stringify(this.board));

    this.removeNumbers(this.config.difficultyLevel);
  }

  getPuzzleAndSolution(): { data: SudokuComplete } {
    return { data: { puzzle: this.board, solution: this.completeBoard } };
  }

  getSolution(): SudokuGrid {
    return this.completeBoard;
  }

  getStats() {
    return this.stats;
  }

  getConfig() {
    return this.config;
  }

  private logProgress = (
    startTime: number,
    posIndex?: number,
    emptyCells?: number,
    attempts?: number,
    resets?: number,
  ) => {
    process.stdout.write("\x1b[1A\x1b[2K");

    const elapsedMs = Date.now() - startTime;
    const date = new Date(elapsedMs);

    const formatted = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(date);

    console.info(
      `Elapsed time: ${formatted} - Backtrack index: ${posIndex} - Empty cells: ${emptyCells} - Attempts: ${attempts} - Resets: ${resets}`,
    );
    return formatted;
  };

  private setFinishTime() {
    this.stats.generatorFinishedAt = Date.now();
    this.stats.generatorTimeTaken = logProgress(this.stats.generatorCreatedAt);
  }

  private resetBoard() {
    this.stats.counter.hardReset++;
    this.board = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));

    this.solver(0, 0);
    this.completeBoard = JSON.parse(JSON.stringify(this.board));
  }

  private calculateBacktrackTimeout = (difficulty: number): number => {
    const minTimeout = 2000;
    const timePerDifficulty = (5000 - minTimeout) / 64;

    return Math.floor(minTimeout + timePerDifficulty * difficulty);
  };

  private getValidRandomRow() {
    const row = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = row.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * i);
      [row[i], row[j]] = [row[j], row[i]];
    }
    return row;
  }

  private solver(row: number, col: number): boolean {
    this.stats.execution.solver += 1;

    let currentRow = row;
    let currentCol = col;

    if (currentCol === 9) {
      currentRow++;
      currentCol = 0;
    }

    // End call
    if (currentRow === 9) {
      return true;
    }

    const numbers = this.getValidRandomRow();

    for (const num of numbers) {
      if (this.isValidCell(currentRow, currentCol, num, this.board)) {
        this.board[currentRow][currentCol] = num;

        // Next call
        if (this.solver(currentRow, currentCol + 1)) {
          return true;
        }

        // If next call isn't valid, reset initial number
        this.board[currentRow][currentCol] = 0;
      }
    }
    return false;
  }

  /**
   * Removes numbers from the board to create a puzzle.
   *
   * Strategy:
   * - If number of attempts of current board is too high, reset the board anyway
   *
   * @param targetEmpty Target number of empty cells
   * @returns Void
   */
  private removeNumbers(targetEmpty: number): void {
    let cellCountToRemove = targetEmpty;

    if (cellCountToRemove > 81)
      cellCountToRemove = this.config.maxDifficultyLevel;
    if (cellCountToRemove < 0) cellCountToRemove = 0;

    while (
      Date.now() - this.stats.generatorCreatedAt <
      this.config.generatorTimeoutSeconds * 1000
    ) {
      // Reset timer for each attempt
      this.attemptTimeoutMs = Date.now();

      // Prioritize cells based on position
      const positions = this.priorityAlgorithm();

      if (this.backtrack(positions, 0, 0, cellCountToRemove)) {
        this.setFinishTime();

        return;
      }

      this.stats.counter.removeNumAttempt++;

      // Strategy: if number of attempts of current board is too high, reset the board anyway
      const currAttempt = this.stats.counter.removeNumAttempt;
      // Reducing the Hz of resetBoard for accelerating easy calculations
      if (currAttempt && currAttempt % this.config.resetThreshold === 0) {
        this.resetBoard();
      }
    }

    this.setFinishTime();
  }

  /**
   * Recursively iterates over **positions** and sets cell value to 0 while checking if the board
   *  maintains a unique solution.
   *
   * @param positions Array of coordinates of cell to attempt to remove
   * @param posIndex Starting index of positions array
   * @param emptyCells Starting count of empty cells, needed for recursive call
   * @param targetEmpty Target number of cells to remove
   * @returns Boolean
   */
  private backtrack(
    positions: { row: number; col: number }[],
    posIndex: number,
    emptyCells: number,
    targetEmpty: number,
  ): boolean {
    // Check timeout
    if (
      Date.now() - this.attemptTimeoutMs >
      this.config.maxBacktrackTimeoutMs
    ) {
      this.stats.counter.backtrackTimeout++;
      return false;
    }

    this.logProgress(
      this.stats.generatorCreatedAt,
      posIndex,
      emptyCells,
      this.stats.counter.removeNumAttempt,
      this.stats.counter.hardReset,
    );

    // Success stop case
    if (emptyCells === targetEmpty) {
      this.stats.success = true;
      return true;
    }

    // No more positions to try
    if (posIndex >= positions.length) {
      return false;
    }

    const { row, col } = positions[posIndex];
    this.stats.execution.backtrack++;

    // Skip if cell is already empty
    if (this.board[row][col] === 0) {
      return this.backtrack(positions, posIndex + 1, emptyCells, targetEmpty);
    }

    // Try removing the number
    const temp = this.board[row][col];
    this.board[row][col] = 0;

    if (this.hasUniqueSolution()) {
      // Successful removal, continue with next position
      if (
        this.backtrack(positions, posIndex + 1, emptyCells + 1, targetEmpty)
      ) {
        return true;
      }
    }

    // Backtrack: put the number back
    this.board[row][col] = temp;
    // this.solutionCache.set(cacheKey, false);

    // Try next position
    return this.backtrack(positions, posIndex + 1, emptyCells, targetEmpty);
  }

  /**
   * Check if **input** at position **row**\/**col** is a valid entry.
   *
   * @param row Index of row position
   * @param col Index of column position
   * @param input Value of cell to to check whether it is a valid value
   * @param board Board reference to verify against
   * @returns Boolean
   */
  private isValidCell(
    row: number,
    col: number,
    input: number,
    board: number[][],
  ): boolean {
    // Use row/column/block lookup arrays instead of loops
    const rowNums = new Set(board[row]);
    const colNums = new Set(board.map((r) => r[col]));

    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    const blockNums = new Set();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        blockNums.add(board[blockRow + i][blockCol + j]);
      }
    }

    return !rowNums.has(input) && !colNums.has(input) && !blockNums.has(input);
  }

  /**
   * Recursively checks if **board** can be completed and has at least 1 solution.
   *
   * @param row Starting index of row
   * @param col Starting index of column
   * @param board The board to complete
   * @returns Void
   */
  private findAllSolutions(row: number, col: number, board: number[][]): void {
    // At least solvable
    if (this.stats.counter.possibleSolution > 1) return;

    if (row === 9) {
      this.stats.counter.possibleSolution++;
      return;
    }

    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;

    if (board[row][col] !== 0) {
      this.findAllSolutions(nextRow, nextCol, board);

      return;
    }

    // Try only valid numbers for this cell
    for (const num of this.validNumbers[row][col]) {
      if (this.isValidCell(row, col, num, board)) {
        board[row][col] = num;
        this.findAllSolutions(nextRow, nextCol, board);

        // Early exit
        if (this.stats.counter.possibleSolution > 1) return;

        board[row][col] = 0;
      }
    }
    return;
  }

  /**
   * Returns a boolean only when 1 solution exists
   *
   * @returns Boolean
   */
  private hasUniqueSolution(): boolean {
    this.stats.counter.possibleSolution = 0;

    const boardCopy = this.board.map((row) => [...row]);
    this.findAllSolutions(0, 0, boardCopy);

    return this.stats.counter.possibleSolution === 1;
  }
}

const generator = new Sudoku(58, gaussianPriority);
const { data } = generator.getPuzzleAndSolution();
const stats = generator.getStats();
const config = generator.getConfig();

logDisplayBoard(data.puzzle);
console.log(stats, config);
