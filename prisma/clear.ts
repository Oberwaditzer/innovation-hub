import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.usersOnTeams.deleteMany({
    where: {},
  });

  await prisma.usersOnWorkshops.deleteMany({
    where: {},
  });

  await prisma.team.deleteMany({
    where: {},
  });

  await prisma.user.deleteMany({
    where: {},
  });

  await prisma.workshop.deleteMany({
    where: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
