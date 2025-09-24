import { PrismaClient } from "@prisma/client";
import { task } from "@trigger.dev/sdk/v3";
import { DifficultyOptions } from "../../../../packages/shared/utils/sudoku/helper";
import { newSudokuTask } from "./new-sudoku";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export const bulkNewSudokuTask = task({
  id: "bulk-new-sudoku",
  maxDuration: 1800, // Stop executing after 1800 secs (30 mins) of compute
  run: async (payload: {
    difficulty: DifficultyOptions;
    priorityType: "pattern" | "gaussian";
    count: number;
  }) => {
    const batchItems = Array.from({ length: payload.count }).map(() => ({
      payload: {
        difficulty: payload.difficulty,
        priorityType: payload.priorityType,
      },
    }));

    const results = await newSudokuTask.batchTriggerAndWait([...batchItems]);

    const newGrids = await prisma.grid.createMany({
      data: results.runs
        .filter((run) => run.ok)
        .map((run) => run.output.preparedData),
    });

    return {
      initialGridCount: results.runs.length,
      createdGrid: newGrids.count,
    };
  },
});
