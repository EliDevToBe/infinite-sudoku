import { SudokuV2 } from "./generator-v2";
import { patternPriority } from "./priority-algorithm";

const difficulty = 60;

const main = () => {
  const generator = new SudokuV2(difficulty, patternPriority, {
    logging: true,
    generatorTimeoutSeconds: 1200,
  });
  generator.generate();

  const { data } = generator.getPuzzleAndSolution();

  console.log(data);
  console.log(generator.getStats());
};

main();
