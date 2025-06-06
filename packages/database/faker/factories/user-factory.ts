import type { Faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";

type User = Prisma.userCreateInput;

export class UserFactory {
  constructor(
    private readonly fakerClient: Faker,
    private readonly prisma: PrismaClient,
  ) {}

  async createMany(count: number) {
    const users = Array.from({ length: count }, () => this.create());

    return this.prisma.user.createMany({
      data: users,
    });
  }

  private create(): User {
    return {
      pseudo: this.fakerClient.internet.username(),
      email: this.fakerClient.internet.email(),
      password: this.fakerClient.internet.password(),
      avatar: this.fakerClient.image.avatar(),
    };
  }
}
