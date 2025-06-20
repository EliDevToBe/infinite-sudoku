type SudokuGrid = number[][];
type SudokuComplete = { puzzle: SudokuGrid; solution: SudokuGrid };
type Position = { row: number; col: number };

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

export class Sudoku {
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
    },
    execution: {
      solver: 0,
      backtrack: 0,
    },
  };

  constructor(
    difficulty: number,
    config: { logging?: boolean; generatorTimeoutSeconds?: number } = {
      logging: false,
      generatorTimeoutSeconds: 300,
    },
  ) {
    this.stats.generatorCreatedAt = Date.now();
    this.config.difficultyLevel = difficulty;

    this.config = { ...this.config, ...config };

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
      console.info(
        `Elapsed time: ${formatted}.${ms}ms - Attempts: ${attempts} - Resets: ${resets}`,
      );
    }

    return `${formatted}.${ms}ms`;
  };

  private setFinalStats() {
    this.stats.generatorFinishedAt = Date.now();

    this.stats.counter.priorityRatio =
      this.stats.counter.priorityAttempt / this.stats.counter.removeNumAttempt;

    this.stats.generatorTimeTaken = `${this.logProgress(
      this.stats.generatorCreatedAt,
    )}`;
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

  private removeNumbers(targetEmpty: number): void {
    let cellCountToRemove = targetEmpty;

    if (cellCountToRemove > 81)
      cellCountToRemove = this.config.maxDifficultyLevel;
    if (cellCountToRemove < 0) cellCountToRemove = 0;

    while (
      Date.now() - this.stats.generatorCreatedAt <
      this.config.generatorTimeoutSeconds * 1000
    ) {
      this.attemptTimeoutMs = Date.now();

      this.logProgress(
        this.stats.generatorCreatedAt,
        this.stats.counter.removeNumAttempt,
        this.stats.counter.hardReset,
      );

      const positions = this.prioritizePositions();

      if (this.backtrack(positions, 0, 0, cellCountToRemove)) {
        this.setFinalStats();

        return;
      }

      this.stats.counter.removeNumAttempt++;

      const currAttempt = this.stats.counter.removeNumAttempt;
      if (currAttempt && currAttempt % this.config.resetThreshold === 0) {
        this.resetBoard();
      }
    }

    this.setFinalStats();
  }

  private prioritizePositions(): Position[] {
    this.stats.counter.priorityAttempt++;

    const zones: Record<string, Position[]> = {
      diagonals: [],
      corners: [],
      edges: [],
      centers: [],
      others: [],
    };

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (i === j || i + j === 8) {
          zones.diagonals.push({ row: i, col: j });
        } else if ((i === 0 || i === 8) && (j === 0 || j === 8)) {
          zones.corners.push({ row: i, col: j });
        } else if (i === 0 || i === 8 || j === 0 || j === 8) {
          zones.edges.push({ row: i, col: j });
        } else if (i % 3 === 1 && j % 3 === 1) {
          zones.centers.push({ row: i, col: j });
        } else {
          zones.others.push({ row: i, col: j });
        }
      }
    }

    for (const zone of Object.values(zones)) {
      for (let i = zone.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [zone[i], zone[j]] = [zone[j], zone[i]];
      }
    }

    return [
      ...zones.diagonals,
      ...zones.corners,
      ...zones.edges,
      ...zones.others,
      ...zones.centers,
    ];
  }

  private backtrack(
    positions: Position[],
    posIndex: number,
    emptyCells: number,
    targetEmpty: number,
  ): boolean {
    if (
      Date.now() - this.attemptTimeoutMs >
      this.config.maxBacktrackTimeoutMs
    ) {
      this.stats.counter.backtrackTimeout++;
      return false;
    }

    if (emptyCells === targetEmpty) {
      this.stats.success = true;
      return true;
    }

    if (posIndex + 1 >= positions.length) {
      return false;
    }

    const { row, col } = positions[posIndex];
    this.stats.execution.backtrack++;

    if (this.board[row][col] === 0) {
      return this.backtrack(positions, posIndex + 1, emptyCells, targetEmpty);
    }

    const temp = this.board[row][col];
    this.board[row][col] = 0;

    if (this.hasUniqueSolution()) {
      if (
        this.backtrack(positions, posIndex + 1, emptyCells + 1, targetEmpty)
      ) {
        return true;
      }
    }

    this.board[row][col] = temp;

    return this.backtrack(positions, posIndex + 1, emptyCells, targetEmpty);
  }

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

  private hasUniqueSolution(): boolean {
    this.stats.counter.possibleSolution = 0;

    const rows = Array(9).fill(0);
    const cols = Array(9).fill(0);
    const boxes = Array(9).fill(0);
    const emptyCells: Position[] = [];

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = this.board[r][c];
        if (val !== 0) {
          const mask = 1 << (val - 1);
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

  private _countSolutions(
    emptyCells: Position[],
    rows: number[],
    cols: number[],
    boxes: number[],
  ): void {
    if (this.stats.counter.possibleSolution > 1) {
      return;
    }

    if (emptyCells.length === 0) {
      this.stats.counter.possibleSolution++;
      return;
    }

    let bestCellIndex = -1;
    let minCandidates = 10;
    let bestCellCandidates: number[] = [];

    for (let i = 0; i < emptyCells.length; i++) {
      const { row, col } = emptyCells[i];
      const boxIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      const usedMask = rows[row] | cols[col] | boxes[boxIdx];

      const candidates = [];
      let numCandidates = 0;

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

      if (minCandidates <= 1) {
        break;
      }
    }

    if (minCandidates === 0) {
      return;
    }

    const { row, col } = emptyCells[bestCellIndex];
    const nextEmptyCells = emptyCells.filter(
      (_, index) => index !== bestCellIndex,
    );

    for (const num of bestCellCandidates) {
      const mask = 1 << (num - 1);
      const boxIdx = Math.floor(row / 3) * 3 + Math.floor(col / 3);

      rows[row] |= mask;
      cols[col] |= mask;
      boxes[boxIdx] |= mask;

      this._countSolutions(nextEmptyCells, rows, cols, boxes);

      rows[row] &= ~mask;
      cols[col] &= ~mask;
      boxes[boxIdx] &= ~mask;

      if (this.stats.counter.possibleSolution > 1) {
        return;
      }
    }
  }
}

const generator = new Sudoku(60, { logging: true });
const { data } = generator.getPuzzleAndSolution();
const stats = generator.getStats();
const config = generator.getConfig();

logDisplayBoard(data.puzzle);
console.log(stats, config);
