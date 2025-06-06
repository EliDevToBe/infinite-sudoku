import { fakerFR as faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { centerText } from "../../shared/utils/center-text";
import { GridFactory } from "./factories/grid-factory";
import { UserFactory } from "./factories/user-factory";

const fakerSeeder = async () => {
  if (process.env.NODE_ENV !== "develop") {
    console.log(centerText(" -  - --== ⚡️ Skipping fake seeds ==-- -  - "));
    return;
  }
  console.log(centerText(" -  - --== 🌱 Seeding fake data ==-- -  - "));
  const prisma = new PrismaClient();

  const userFactory = new UserFactory(faker, prisma);
  await userFactory.createMany(10);

  const gridFactory = new GridFactory(faker, prisma);
  await gridFactory.createMany(10);

  console.log(centerText(" -  - --== Done 👌 ==-- -  - "));
};

fakerSeeder();
