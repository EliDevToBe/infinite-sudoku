import { logger, task } from "@trigger.dev/sdk/v3";
import { DifficultyOptions } from "../../../../apps/web/src/utils";
import { SudokuV2 } from "../../../../packages/shared/utils/sudoku/generator-v2";
import {
  getRangeFromDifficulty,
  prepareForDatabase,
} from "../../../../packages/shared/utils/sudoku/helper";
import { patternPriority } from "../../../../packages/shared/utils/sudoku/priority-algorithm";

export const helloWorldTask = task({
  id: "new-sudoku",
  maxDuration: 900, // Stop executing after 900 secs (15 mins) of compute
  run: async (payload: { difficulty: DifficultyOptions }) => {
    const range = getRangeFromDifficulty(payload.difficulty);
    const difficulty = range[Math.floor(Math.random() * range.length)];

    const generator = new SudokuV2(difficulty, patternPriority);
    generator.generate();

    const { data } = generator.getPuzzleAndSolution();
    const stats = generator.getConfig();

    const preparedData = prepareForDatabase(data, difficulty);
    logger.log("Sudoku generated", { stats, difficulty });

    return {
      preparedData,
    };
  },
});
