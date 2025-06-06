import { Faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";

type UserGrid = Prisma.user_gridCreateInput;

export class UserGridFactory {
  constructor(
    private readonly fakerClient: Faker,
    private readonly prisma: PrismaClient,
  ) {}

  private create(userId: string, gridId: string): UserGrid {
    return {
      user: {
        connect: { id: userId },
      },
      grid: {
        connect: { id: gridId },
      },
    };
  }

  createMany(userIds: string[], gridIds: string[]) {
    return Promise.all(
      userIds.map((userId) => {
        const gridId = gridIds[Math.floor(Math.random() * gridIds.length)];
        return this.prisma.user_grid.create({
          data: this.create(userId, gridId),
        });
      }),
    );
  }
}
