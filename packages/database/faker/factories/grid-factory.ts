import { Faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";

type Grid = Prisma.gridCreateInput;

export class GridFactory {
  constructor(
    private readonly fakerClient: Faker,
    private readonly prisma: PrismaClient,
  ) {}

  async createMany(count: number) {
    const grids = Array.from({ length: count }, () => this.create());

    return this.prisma.grid.createMany({
      data: grids,
    });
  }

  private create(): Grid {
    const puzzle = Array.from({ length: 8 }, () =>
      [...Array(8)].map(() => this.fakerClient.number.int({ min: 1, max: 9 })),
    );

    const solution = [puzzle[0].map((_el) => 0), ...puzzle.slice(1)];

    return {
      puzzle,
      solution,
      difficulty: this.fakerClient.number.int({ min: 40, max: 67 }),
    };
  }
}
