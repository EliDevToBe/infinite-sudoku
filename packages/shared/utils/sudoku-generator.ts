type DevNum = { dev: number };
type _Point = { col: number; row: number };

type Difficulty = "easy" | "medium" | "hard" | "hardest";
const _difficulties = [
  "easy",
  "medium",
  "hard",
  "hardest",
] as const satisfies Difficulty[];

type SudokuGrid = number[][];
type SudokuComplete = { puzzle: SudokuGrid; solution: SudokuGrid };
type _SudokuMatrix = Record<Difficulty, SudokuComplete>;

type _MenuSettings = {
  difficulty: Difficulty;
  isHelperActive: boolean;
};

export function chooseDifficulty(str: Difficulty | DevNum) {
  const levels: Record<Difficulty, number> = {
    easy: getRandomNumber(33, 40),
    medium: getRandomNumber(41, 48),
    hard: getRandomNumber(49, 56),
    hardest: 57,
  };
  return typeof str === "string" ? levels[str as Difficulty] : str.dev;
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Sudoku {
  #board: number[][];
  #completeBoard: number[][] = [];

  #difficultyLevel: number;
  #maxDifficultyLevel = 57;

  #callCounter = 0;
  #removeCounter = 0;
  #solutionCount = 0;

  #startTime = 0;
  #timeoutMs = 950;

  #attempts = 0;
  #maxAttempts = 90;
  #timeOutCounter = 0;
  #hardResetCounter = 0;

  #starDate: number;
  #startDateEnd = 0;

  #validNumbers: Set<number>[][] = Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    );

  constructor(difficulty: number) {
    this.#difficultyLevel = difficulty;

    this.#board = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));

    this.#starDate = Date.now();

    this.#fillBoard(0, 0);
    this.#completeBoard = JSON.parse(JSON.stringify(this.#board));

    this.#removeNumbers(this.#difficultyLevel);
  }

  getPuzzle(): { data: SudokuComplete } {
    return { data: { puzzle: this.#board, solution: this.#completeBoard } };
  }

  #resetBoard() {
    this.#hardResetCounter++;
    this.#board = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));

    this.#fillBoard(0, 0);
    this.#completeBoard = JSON.parse(JSON.stringify(this.#board));
  }

  getSolution() {
    // this.#completeBoard.forEach((row, i) => {
    //   console.log(
    //     row
    //       .map((col: number | string, i) => {
    //         col = col == 0 ? "•" : col;
    //         if ((i + 1) % 3 === 0 && i != 8) return col + " |";
    //         return col;
    //       })
    //       .join(" ")
    //   );
    //   if ((i + 1) % 3 === 0 && i != 8) console.log("---------------------");
    // });

    return this.#completeBoard;
  }

  displayBoard(): void {
    process.stdout.write("\x1b[0;0H\x1b[2J");

    console.log("Number of solution:", this.#solutionCount);
    this.#board.forEach((row, i) => {
      console.log(
        row
          .map((col: number | string, i) => {
            col = col == 0 ? "•" : col;
            if ((i + 1) % 3 === 0 && i != 8) return col + " |";
            return col;
          })
          .join(" ")
      );
      if ((i + 1) % 3 === 0 && i != 8) console.log("---------------------");
    });

    console.log("Number of Fill calls:", this.#callCounter);
    console.log("Number of Remove calls:", this.#removeCounter);
    console.log("Number of Attempts generating Sudoku:", this.#attempts);
    console.log(
      "Number of timeouts attempting to remove cells:",
      this.#timeOutCounter
    );
    console.log("Number of Hard resets:", this.#hardResetCounter);
    console.log(
      "Time elapsed:",
      ((this.#startDateEnd ? this.#startDateEnd : Date.now()) -
        this.#starDate) /
        1000,
      "s"
    );
  }

  #getValidRandomRow() {
    const row = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = row.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * i);
      [row[i], row[j]] = [row[j], row[i]];
    }
    return row;
  }

  #fillBoard(row: number, col: number): boolean {
    this.#callCounter += 1;

    if (col === 9) {
      row++;
      col = 0;
    }

    // End call
    if (row === 9) {
      return true;
    }

    const numbers = this.#getValidRandomRow();

    for (const num of numbers) {
      if (this.#isValidCell(row, col, num, this.#board)) {
        this.#board[row][col] = num;

        // Next call
        if (this.#fillBoard(row, col + 1)) {
          return true;
        }

        // If next call isn't valid, reset initial number
        this.#board[row][col] = 0;
      }
    }
    return false;
  }

  #removeNumbers(targetEmpty: number): void {
    if (targetEmpty > 81) targetEmpty = this.#maxDifficultyLevel;
    if (targetEmpty < 0) targetEmpty = 0;

    while (this.#attempts < this.#maxAttempts) {
      // Reducing the Hz of resetBoard for accelerating easy calculations
      if (
        this.#attempts &&
        (this.#attempts < 20
          ? this.#attempts % 5 === 0
          : this.#attempts % 3 === 0)
      ) {
        this.#resetBoard();
      }

      // ====================
      // process.stdout.write("\x1b[0;0H\x1b[2J");
      // this.displayBoard();
      // ====================

      // Reset timer for each attempt
      this.#startTime = Date.now();

      // Prioritize cells based on position
      const positions = this.#getPrioritizedPositions();

      if (this.#removeNumbersBacktrack(positions, 0, 0, targetEmpty)) {
        // =====================================
        // process.stdout.write("\x1b[0;0H\x1b[2J");
        // this.displayBoard();
        // console.log("- - --> SUCCESS <-- - -");
        // console.log("- - --> Level:", this.#difficultyLevel, "<-- - -");
        // =====================================

        this.#startDateEnd = Date.now();
        return;
      }

      this.#attempts++;

      // =====================================
      // console.log(
      //   `Attempt ${
      //     this.#attempts
      //   }: Timeout or no solution found. Reshuffling...`
      // );
      // =====================================
    }

    // process.stdout.write("\x1b[0;0H\x1b[2J");
    // this.displayBoard();
    // console.log("FAILED to find solution after maximum attempts");

    this.#startDateEnd = Date.now();
  }

  // Helper method for smart cell selection
  #getPrioritizedPositions(): { row: number; col: number }[] {
    const positions: { row: number; col: number; priority: number }[] = [];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // Prioritize cells that are more likely to maintain uniqueness
        // Center cells and edges are less important than others
        const centerDistance = Math.abs(i - 3.5) + Math.abs(j - 3.5);
        const priority = centerDistance + Math.random();
        positions.push({ row: i, col: j, priority });
      }
    }

    return positions
      .sort((a, b) => b.priority - a.priority)
      .map(({ row, col }) => ({ row, col }));
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
  #removeNumbersBacktrack(
    positions: { row: number; col: number }[],
    posIndex: number,
    emptyCells: number,
    targetEmpty: number
  ): boolean {
    // Check timeout
    if (Date.now() - this.#startTime > this.#timeoutMs) {
      this.#timeOutCounter++;
      return false;
    }

    // Success stop case
    if (emptyCells === targetEmpty) {
      // console.log("Empty Cells count REACHED");
      return true;
    }

    // No more positions to try
    if (posIndex >= positions.length) {
      // console.log("NO MORE POSITION");
      return false;
    }

    const { row, col } = positions[posIndex];
    this.#removeCounter++;

    // Skip if cell is already empty
    if (this.#board[row][col] === 0) {
      return this.#removeNumbersBacktrack(
        positions,
        posIndex + 1,
        emptyCells,
        targetEmpty
      );
    }

    // Try removing the number
    const temp = this.#board[row][col];
    this.#board[row][col] = 0;

    if (this.hasUniqueSolution()) {
      // Successful removal, continue with next position
      if (
        this.#removeNumbersBacktrack(
          positions,
          posIndex + 1,
          emptyCells + 1,
          targetEmpty
        )
      ) {
        return true;
      }
    }

    // Backtrack: put the number back
    this.#board[row][col] = temp;

    // Try next position
    return this.#removeNumbersBacktrack(
      positions,
      posIndex + 1,
      emptyCells,
      targetEmpty
    );
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
  #isValidCell(
    row: number,
    col: number,
    input: number,
    board: number[][]
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
  #findAllSolutions(row: number, col: number, board: number[][]): void {
    // At least solvable
    if (this.#solutionCount > 1) return;

    if (row === 9) {
      this.#solutionCount++;
      return;
    }

    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;

    if (board[row][col] !== 0) {
      this.#findAllSolutions(nextRow, nextCol, board);

      return;
    }

    // Try only valid numbers for this cell
    for (const num of this.#validNumbers[row][col]) {
      if (this.#isValidCell(row, col, num, board)) {
        board[row][col] = num;
        this.#findAllSolutions(nextRow, nextCol, board);

        // Early exit
        if (this.#solutionCount > 1) return;

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
  hasUniqueSolution(): boolean {
    this.#solutionCount = 0;

    const boardCopy = this.#board.map((row) => [...row]);
    this.#findAllSolutions(0, 0, boardCopy);

    return this.#solutionCount === 1;
  }
}
