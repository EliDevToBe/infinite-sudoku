import { logger, task } from "@trigger.dev/sdk/v3";
import { SudokuV2 } from "../../../../packages/shared/utils/sudoku/generator-v2";
import {
  DifficultyOptions,
  getRangeFromDifficulty,
  prepareForDatabase,
} from "../../../../packages/shared/utils/sudoku/helper";
import { patternMap } from "../../../../packages/shared/utils/sudoku/priority-algorithm";

export const newSudokuTask = task({
  id: "new-sudoku",
  maxDuration: 1200, // Stop executing after 1200 secs (20 mins) of compute
  run: async (payload: {
    difficulty: DifficultyOptions | number;
    priorityType: "pattern" | "patternV2" | "gaussian";
  }) => {
    try {
      let difficulty: number;

      if (typeof payload.difficulty === "string") {
        const range = getRangeFromDifficulty(payload.difficulty);
        difficulty = range[Math.floor(Math.random() * range.length)];
      } else if (typeof payload.difficulty === "number") {
        difficulty = payload.difficulty;
      } else {
        throw new Error("Invalid difficulty");
      }

      const priorityAlgorithm = patternMap[payload.priorityType];

      if (typeof priorityAlgorithm !== "function") {
        throw new Error("Invalid priority algorithm");
      }

      const generator = new SudokuV2(difficulty, priorityAlgorithm, {
        logging: false,
        generatorTimeoutSeconds: 1200,
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
