import { logger, task } from "@trigger.dev/sdk/v3";
import { SudokuV2 } from "../../../../packages/shared/utils/sudoku/generator-v2";
import {
  DifficultyOptions,
  getRangeFromDifficulty,
  prepareForDatabase,
} from "../../../../packages/shared/utils/sudoku/helper";
import {
  gaussianPriority,
  patternPriority,
} from "../../../../packages/shared/utils/sudoku/priority-algorithm";

export const newSudokuTask = task({
  id: "new-sudoku",
  maxDuration: 900, // Stop executing after 900 secs (15 mins) of compute
  run: async (payload: {
    difficulty: DifficultyOptions;
    priorityType: "pattern" | "gaussian";
  }) => {
    try {
      const range = getRangeFromDifficulty(payload.difficulty);
      const difficulty = range[Math.floor(Math.random() * range.length)];

      const priorityAlgorithm =
        payload.priorityType === "pattern" ? patternPriority : gaussianPriority;

      const generator = new SudokuV2(difficulty, priorityAlgorithm, {
        logging: false,
      });
      generator.generate();

      const { data } = generator.getPuzzleAndSolution();

      const preparedData = prepareForDatabase(data, difficulty);
      logger.log("Sudoku level generated", { difficulty });

      return {
        preparedData,
      };
    } catch (error) {
      logger.error("Error generating Sudoku", { error });
      throw error;
    }
  },
});
