import { fakerFR as faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { centerText } from "../../shared/utils/center-text";
import { GridFactory } from "./factories/grid-factory";
import { UserFactory } from "./factories/user-factory";
import { UserGridFactory } from "./factories/user-grid-factory";

const fakerSeeder = async () => {
	if (process.env.NODE_ENV !== "develop") {
		console.log(centerText(" -  - --== ⚡️ Skipping fake seeds ==-- -  - "));
		return;
	}
	console.log(centerText(" -  - --== 🌱 Seeding fake data ==-- -  - "));
	const prisma = new PrismaClient();

	const userFactory = new UserFactory(faker, prisma);
	const users = await userFactory.createMany(10);
	const userIds = users.map((user) => user.id);

	const gridFactory = new GridFactory(faker, prisma);
	const grids = await gridFactory.createMany(10);
	const gridIds = grids.map((grid) => grid.id);

	const userGridFactory = new UserGridFactory(faker, prisma);
	await userGridFactory.createMany(userIds, gridIds);

	console.log(centerText(" -  - --== Done 👌 ==-- -  - "));
};

fakerSeeder();
