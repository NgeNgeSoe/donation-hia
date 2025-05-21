import { prisma } from "../src/lib/prisma";

async function seed() {
  const count = await prisma.role.count();
  if (count === 0) {
    await prisma.role.createMany({
      data: [{ name: "admin" }, { name: "member" }],
    });
    console.log("Seeded roles: Admin, Member");
  } else console.log("Roles already exist. No seeding needed.");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
