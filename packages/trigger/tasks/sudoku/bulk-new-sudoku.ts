import { task } from "@trigger.dev/sdk/v3";
import { DifficultyOptions } from "../../../../packages/shared/utils/sudoku/helper";
import { newSudokuTask } from "./new-sudoku";

export const bulkNewSudokuTask = task({
  id: "bulk-new-sudoku",
  maxDuration: 1800, // Stop executing after 1800 secs (30 mins) of compute
  run: async (payload: {
    difficulty: DifficultyOptions | number;
    priorityType: "pattern" | "patternV2" | "gaussian";
    count: number;
  }) => {
    const batchItems = Array.from({ length: payload.count }).map(() => ({
      payload: {
        difficulty: payload.difficulty,
        priorityType: payload.priorityType,
      },
    }));

    const results = await newSudokuTask.batchTriggerAndWait([...batchItems]);

    const createdGrids = results.runs.filter(
      (run) => run.ok && run.output.success,
    );

    const failedGrids = results.runs.filter(
      (run) => run.ok && !run.output.success,
    );

    return {
      initialGridCount: batchItems.length,
      createdGrid: createdGrids.length,
      failedGrid: failedGrids.length,
    };
  },
});
