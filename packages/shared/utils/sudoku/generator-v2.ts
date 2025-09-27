export type SudokuGrid = number[][];
export type SudokuComplete = { puzzle: SudokuGrid; solution: SudokuGrid };
type Position = { row: number; col: number };

/**
 * Sudoku puzzle generator that creates a complete, valid Sudoku board
 * and then removes cells to create a puzzle of a specified difficulty
 * with a guaranteed unique solution.
 */
export class SudokuV2 {
  private board: SudokuGrid;
  private completeBoard: SudokuGrid;

  private attemptTimeoutMs = 0;

  private readonly config = {
    maxBacktrackTimeoutMs: 2000, // Default, overridden in constructor
    maxDifficultyLevel: 64,
    generatorTimeoutSeconds: 300, // Default, overridden in constructor
    resetThreshold: 10, // Default, overridden in constructor
    difficultyLevel: 0,
    logging: false,
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
      priorityAttempt: 0,
      priorityRatio: 0,
      possibleSolution: 0,
      maxCellsRemoved: 0,
      maxCellsRemovedAt: 0,
    },
    execution: {
      solver: 0,
      backtrack: 0,
    },
  };

  private priorityAlgorithm: () => Position[];

  /**
   * Initializes a new Sudoku generator.
   * @param difficulty The target number of empty cells (0-64).
   * @param config Optional configuration for logging and timeout settings.
   */
  constructor(
    difficulty: number,
    priorityAlgorithm: () => Position[],
    config: {
      logging?: boolean;
      generatorTimeoutSeconds?: number;
      resetThreshold?: number;
    } = {
      logging: false,
      generatorTimeoutSeconds: 300,
      resetThreshold: 10,
    },
  ) {
    this.stats.generatorCreatedAt = Date.now();

    this.config.difficultyLevel = difficulty;
    this.priorityAlgorithm = priorityAlgorithm;

    this.config = { ...this.config, ...config };

    // Scale with difficulty, longer time for harder puzzles
    // this.config.resetThreshold = Math.max(
    //   5,
    //   Math.floor(60 - this.config.difficultyLevel),
    // );

    this.config.maxBacktrackTimeoutMs = this.calculateBacktrackTimeout(
      this.config.difficultyLevel,
    );

    // Initialize board
    this.board = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));

    this.solver(0, 0);
    this.completeBoard = JSON.parse(JSON.stringify(this.board));
  }

  generate() {
    // Starts removing cell process
    this.removeNumbers(this.config.difficultyLevel);
  }

  /**
   * Returns the generated puzzle and its complete solution.
   */
  getPuzzleAndSolution(): { data: SudokuComplete } {
    return { data: { puzzle: this.board, solution: this.completeBoard } };
  }

  getSolution(): SudokuGrid {
    return this.completeBoard;
  }

  getStats() {
    const readableStats = {
      ...this.stats,
      difficultyLevel: this.config.difficultyLevel,

      generatorCreatedAt: new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }).format(new Date(this.stats.generatorCreatedAt)),

      generatorFinishedAt: new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }).format(new Date(this.stats.generatorFinishedAt)),

      counter: {
        ...this.stats.counter,

        maxCellsRemovedAt: new Intl.DateTimeFormat("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "UTC",
        }).format(new Date(this.stats.counter.maxCellsRemovedAt)),
      },
    };

    return readableStats;
  }

  getConfig() {
    return this.config;
  }

  private logProgress = (
    startTime: number,
    attempts?: number,
    resets?: number,
  ) => {
    const elapsedMs = Date.now() - startTime;
    const date = new Date(elapsedMs);

    const formatted = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(date);

    const ms = (elapsedMs - startTime).toString().slice(-3);

    if (this.config.logging) {
      process.stdout.write("\x1b[1A\x1b[2K");
      process.stdout.write("\x1b[1A\x1b[2K");
      const hours = [
        "🕛",
        "🕐",
        "🕑",
        "🕒",
        "🕓",
        "🕔",
        "🕕",
        "🕖",
        "🕗",
        "🕘",
        "🕙",
        "🕚",
      ];
      console.info(
        `${
          hours[Number(formatted.split(":")[2]) % hours.length]
        } Elapsed time: ${formatted}.${ms}ms - Attempts: ${attempts} - Resets: ${resets}`,
      );
    }

    return `${formatted}.${ms}ms`;
  };

  private setFinalStats() {
    this.stats.generatorFinishedAt = Date.now();

    this.stats.counter.priorityRatio =
      this.stats.counter.priorityAttempt / (this.stats.counter.hardReset ?? 1);

    this.stats.generatorTimeTaken = `${this.logProgress(
      this.stats.generatorCreatedAt,
    )}`;
  }

  /**
   * Resets the board to a new valid Sudoku solution,
   * in prevision of new attempts of removing numbers
   */
  private resetBoard() {
    this.stats.counter.hardReset++;
    this.board = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));

    this.solver(0, 0);
    this.completeBoard = JSON.parse(JSON.stringify(this.board));
  }

  /**
   * Scale the backtrack timeout automatically ranging from 2000ms to 5000ms.
   * @param difficulty The difficulty level.
   * @returns The timeout in milliseconds.
   */
  private calculateBacktrackTimeout = (difficulty: number): number => {
    const minTimeout = 2000;
    const timePerDifficulty = (5000 - minTimeout) / 64;

    return Math.floor(minTimeout + timePerDifficulty * difficulty);
  };

  /**
   * Get a valid random row of numbers (1-9)
   */
  private getValidRandomRow() {
    const row = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = row.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * i);
      [row[i], row[j]] = [row[j], row[i]];
    }
    return row;
  }

  /**
   * Fills the board with a complete and valid Sudoku solution.
   * @param row The current row to process.
   * @param col The current column to process.
   * @returns True if the board is successfully filled, false otherwise.
   */
  private solver(row: number, col: number): boolean {
    this.stats.execution.solver += 1;

    let currentRow = row;
    let currentCol = col;

    if (currentCol === 9) {
      currentRow++;
      currentCol = 0;
    }

    if (currentRow === 9) {
      return true;
    }

    const numbers = this.getValidRandomRow();

    for (const num of numbers) {
      if (this.isValidCell(currentRow, currentCol, num, this.board)) {
        this.board[currentRow][currentCol] = num;

        if (this.solver(currentRow, currentCol + 1)) {
          return true;
        }
        this.board[currentRow][currentCol] = 0;
      }
    }
    return false;
  }

  /**
   * The main loop for removing numbers to generate a puzzle.
   * It continues until a puzzle is found or the global timeout is reached.
   * @param targetEmpty The target number of empty cells for the puzzle.
   */
  private removeNumbers(targetEmpty: number): boolean {
    let cellCountToRemove = targetEmpty;

    if (cellCountToRemove > 81)
      cellCountToRemove = this.config.maxDifficultyLevel;
    if (cellCountToRemove < 0) cellCountToRemove = 0;

    while (
      Date.now() - this.stats.generatorCreatedAt <
      this.config.generatorTimeoutSeconds * 1000
    ) {
      this.attemptTimeoutMs = Date.now();

      // Get a new list of positions, prioritized for removal.
      const positions = this.priorityAlgorithm();
      this.stats.counter.priorityAttempt++;

      if (this.backtrack(positions, 0, 0, cellCountToRemove)) {
        // Success case, puzzle found
        this.setFinalStats();
        return true;
      }

      this.stats.counter.removeNumAttempt++;

      // If too many attempts fail, reset the board to avoid getting stuck.
      const currAttempt = this.stats.counter.removeNumAttempt;
      if (currAttempt && currAttempt % this.config.resetThreshold === 0) {
        this.resetBoard();
      }
    }

    this.setFinalStats();
    return false;
  }

  /**
   * The core backtracking algorithm for removing cells.
   * It tries to remove the cell at the current position index and checks if
   * the resulting board still has a unique solution.
   * @param positions The prioritized list of positions to try.
   * @param posIndex The current index in the positions array.
   * @param emptyCells The current count of removed cells.
   * @param targetEmpty The target number of empty cells.
   * @returns True if a valid puzzle is found, false otherwise.
   */
  private backtrack(
    positions: Position[],
    posIndex: number,
    emptyCells: number,
    targetEmpty: number,
  ): boolean {
    // Early abort if the current attempt is taking too long.
    if (
      Date.now() - this.attemptTimeoutMs >
      this.config.maxBacktrackTimeoutMs
    ) {
      this.stats.counter.backtrackTimeout++;
      return false;
    }

    // Stats
    if (emptyCells > this.stats.counter.maxCellsRemoved) {
      this.stats.counter.maxCellsRemovedAt = Date.now();
    }
    this.stats.counter.maxCellsRemoved = Math.max(
      this.stats.counter.maxCellsRemoved,
      emptyCells,
    );

    if (this.config.logging) {
      posIndex % 10 === 0
        ? this.logProgress(
            this.stats.generatorCreatedAt,
            this.stats.counter.removeNumAttempt,
            this.stats.counter.hardReset,
          )
        : null;
    }

    if (emptyCells === targetEmpty) {
      this.stats.success = true;
      return true;
    }

    if (posIndex >= positions.length) {
      return false;
    }

    const { row, col } = positions[posIndex];
    this.stats.execution.backtrack++;

    if (this.board[row][col] === 0) {
      return this.backtrack(positions, posIndex + 1, emptyCells, targetEmpty);
    }

    // Temporarily remove the number from the cell.
    const temp = this.board[row][col];
    this.board[row][col] = 0;

    // Check if the board still has only one solution.
    if (this.hasUniqueSolution()) {
      // If successful, proceed to the next cell.
      if (
        this.backtrack(positions, posIndex + 1, emptyCells + 1, targetEmpty)
      ) {
        // Successfully removed all target empty cells, puzzle is complete.
        return true;
      }
    }

    // Backtrack: if the removal was unsuccessful, restore the cell.
    this.board[row][col] = temp;

    return this.backtrack(positions, posIndex + 1, emptyCells, targetEmpty);
  }

  /**
   * Checks if placing a number in a cell is valid according to Sudoku rules.
   * (This is a slower, non-bitwise version used only for the initial board fill).
   */
  private isValidCell(
    row: number,
    col: number,
    input: number,
    board: number[][],
  ): boolean {
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
   * A highly optimized function to check if the current board has exactly one solution.
   * It uses bitwise operations and a Minimum Remaining Values (MRV) heuristic.
   * @returns True if the solution is unique, false otherwise.
   */
  private hasUniqueSolution(): boolean {
    this.stats.counter.possibleSolution = 0;

    // --- Bitwise Setup ---
    // Create bitmasks for each row, column, and box to track used numbers.
    const rows = Array(9).fill(0);
    const cols = Array(9).fill(0);
    const boxes = Array(9).fill(0);
    const emptyCells: Position[] = [];

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const num = this.board[r][c];
        if (num !== 0) {
          // Actual bit setting
          const mask = 1 << (num - 1);

          const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
          rows[r] |= mask;
          cols[c] |= mask;
          boxes[boxIdx] |= mask;
        } else {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      this.stats.counter.possibleSolution = 1;
      return true;
    }

    this._countSolutions(emptyCells, rows, cols, boxes);

    return this.stats.counter.possibleSolution === 1;
  }

  /**
   * The recursive heart of the bitwise solver. It efficiently finds the number of
   * possible solutions for the current board state.
   * @param emptyCells An array of positions that are currently empty.
   * @param rows An array of row bitmasks.
   * @param cols An array of column bitmasks.
   * @param boxes An array of 3x3 box bitmasks.
   */
  private _countSolutions(
    emptyCells: Position[],
    rows: number[],
    cols: number[],
    boxes: number[],
  ): void {
    // Early exit: if we've already found more than one solution, stop searching.
    if (this.stats.counter.possibleSolution > 1) {
      return;
    }

    // Base case: if there are no more empty cells, we've found one complete solution.
    if (emptyCells.length === 0) {
      this.stats.counter.possibleSolution++;
      return;
    }

    // --- Minimum Remaining Values (MRV) Heuristic ---
    // Find the empty cell with the fewest possible candidates to explore it first.
    // This prunes the search tree significantly.
    let bestCellIndex = -1;
    let minCandidates = 10;
    let bestCellCandidates: number[] = [];

    for (let i = 0; i < emptyCells.length; i++) {
      const { row, col } = emptyCells[i];
      const boxIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);

      // Combine the masks for the cell's row, column, and box to find all used numbers.
      const usedMask = rows[row] | cols[col] | boxes[boxIdx];

      const candidates = [];
      let numCandidates = 0;

      // Check which numbers (1-9) are not in the used mask.
      for (let num = 1; num <= 9; num++) {
        if (!((usedMask >> (num - 1)) & 1)) {
          candidates.push(num);
          numCandidates++;
        }
      }

      if (numCandidates < minCandidates) {
        minCandidates = numCandidates;
        bestCellIndex = i;
        bestCellCandidates = candidates;
      }

      // Optimization: if a cell has only one possible candidate, it's the best choice.
      if (minCandidates <= 1) {
        break;
      }
    }

    // If a cell has no candidates, this path is invalid. Backtrack.
    if (minCandidates === 0) {
      return;
    }

    // At any time, we must keep at least a cell with exactly one candidate, else puzzle is humanly not solvable
    if (bestCellCandidates.length !== 1) return;

    const { row, col } = emptyCells[bestCellIndex];
    const nextEmptyCells = emptyCells.filter(
      (_, index) => index !== bestCellIndex,
    );

    // Try each valid candidate number in the chosen cell.
    for (const num of bestCellCandidates) {
      const mask = 1 << (num - 1);
      const boxIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);

      // --- Forward Step: Place the number (update masks) ---
      rows[row] |= mask;
      cols[col] |= mask;
      boxes[boxIdx] |= mask;

      this._countSolutions(nextEmptyCells, rows, cols, boxes);

      // --- Bitwise Backtrack: Un-place the number (revert masks) ---
      // The bitwise NOT (~) inverts the mask.
      // ANDing with the inverted mask un-sets the specific bit for the number.

      rows[row] &= ~mask;
      cols[col] &= ~mask;
      boxes[boxIdx] &= ~mask;

      if (this.stats.counter.possibleSolution > 1) {
        return;
      }
    }
  }
}
