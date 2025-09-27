import fs from "node:fs";
import { SudokuV2 } from "./generator-v2";
import { prepareForDatabase } from "./helper";
import { patternPriorityV2 } from "./priority-algorithm";

const difficulty = 60;
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
    generatorTimeoutSeconds: 2100,
    resetThreshold: 10,
  });
  generator.generate();

  const { data } = generator.getPuzzleAndSolution();

  if (generator.getConfig().difficultyLevel >= 60) {
    const level = generator.getConfig().difficultyLevel;

    const readyToDb = prepareForDatabase(data, level);

    const date = new Intl.DateTimeFormat("fr-FR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .format(new Date(Date.now()))
      .replace(/\//g, "-")
      .replace(/ /g, "-");

    const fileName = `level-${level}-${date}.json`;

    fs.writeFileSync(
      `./generated/${fileName}`,
      JSON.stringify(readyToDb, null, 2),
    );
  }

  console.log(data);
  logDisplayBoard(data.puzzle);
  console.log(generator.getStats());
};
main();
