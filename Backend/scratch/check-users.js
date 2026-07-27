const prisma = require('../src/config/db');

async function main() {
  const users = await prisma.user.findMany({
    take: 10,
    select: { id: true, email: true, role: true, firstName: true, lastName: true }
  });
  console.log('--- EXISTING USERS ---');
  console.table(users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
