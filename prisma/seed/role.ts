import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'owner', description: 'Owner' },
      { name: 'admin', description: 'Admin' },
      { name: 'user', description: 'User' },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
