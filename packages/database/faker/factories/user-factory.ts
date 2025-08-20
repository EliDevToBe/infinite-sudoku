import type { Faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "@prisma/client";

type User = Prisma.userCreateInput;

export class UserFactory {
  constructor(
    private readonly fakerClient: Faker,
    private readonly prisma: PrismaClient,
  ) {}

  async createMany(count: number): Promise<User[]> {
    return Promise.all(
      Array.from({ length: count }, () =>
        this.prisma.user.create({
          data: this.create(),
        }),
      ),
    );
  }

  private create(): User {
    return {
      pseudo: this.fakerClient.internet.username(),
      email: this.fakerClient.internet.email(),
      password: this.fakerClient.internet.password(),
      avatar: this.fakerClient.image.avatar(),
    };
  }

  async createAdmin(): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...this.create(),
        email: "admin@rncp.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=1$Cfx7JE/kt9xtXcAbEj5XyQ$Zxror4jXxDGGrBzA4cc2s5aR0JolsRxxTP1lHRSX/Cw",
        role: "admin",
      },
    });
  }
}
