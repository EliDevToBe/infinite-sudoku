import type { Faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "@prisma/client";

type User = Prisma.userCreateInput;

export class UserFactory {
  constructor(
    private readonly fakerClient: Faker,
    private readonly prisma: PrismaClient,
  ) {}

  async createMany(count: number) {
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

  async createAdmin() {
    return this.prisma.user.create({
      data: {
        ...this.create(),
        email: "admin@rncp.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=1$TYA1vt0zIbyAkhKBVaIjNg$heZx69OPUYCEhJK+a7dgAlQRIT6YKgsgm5uG6s+ybDw",
        role: "admin",
      },
    });
  }
}
