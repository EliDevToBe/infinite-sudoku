import type { Faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "@prisma/client";
import { sha256 } from "../../../shared/utils/sha256";

type Grid = Prisma.gridCreateInput;

export class GridFactory {
  constructor(
    private readonly fakerClient: Faker,
    private readonly prisma: PrismaClient
  ) {}

  async createMany(count: number) {
    return Promise.all(
      Array.from({ length: count }, () =>
        this.prisma.grid.create({
          data: this.create(),
        })
      )
    );
  }

  private create(): Grid {
    const solution = Array.from({ length: 9 }, () =>
      [...Array(9)].map(() => this.fakerClient.number.int({ min: 1, max: 9 }))
    );

    const puzzle = [solution[0].map((_el) => 0), ...solution.slice(1)];

    const shaString = sha256({ puzzle, solution });

    return {
      solution,
      puzzle,
      sha256: shaString,
      difficulty: this.fakerClient.number.int({ min: 40, max: 67 }),
    };
  }
}
