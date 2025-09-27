import { PrismaClient } from "@prisma/client";
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
  maxDuration: 2100, // Stop executing after 2100 secs (35 mins) of compute
  retry: {
    outOfMemory: {
      machine: "large-2x",
    },
  },
  run: async (payload: {
    difficulty: DifficultyOptions | number;
    priorityType: "pattern" | "patternV2" | "gaussian";
  }) => {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

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

      await prisma.grid.create({
        data: preparedData,
      });

      return { difficulty, success: true };
    } catch (error) {
      logger.error("Error generating Sudoku", { error });

      return { difficulty: payload.difficulty, success: false };
    } finally {
      await prisma.$disconnect();
    }
  },
});
