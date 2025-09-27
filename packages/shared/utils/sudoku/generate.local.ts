import { SudokuV2 } from "./generator-v2";
import { patternPriorityV2 } from "./priority-algorithm";

const difficulty = 40;
const pattern = patternPriorityV2;

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

const main = () => {
  const generator = new SudokuV2(difficulty, pattern, {
    logging: true,
    generatorTimeoutSeconds: 1800,
    resetThreshold: 10,
  });
  generator.generate();

  const { data } = generator.getPuzzleAndSolution();

  console.log(data);
  logDisplayBoard(data.puzzle);
  console.log(generator.getStats());
};
main();
