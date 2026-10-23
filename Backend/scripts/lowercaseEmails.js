const prisma = require('../src/config/db');

async function main() {
  console.log('🔄 Normalizing all user and client emails to lowercase...');
  try {
    const userResult = await prisma.$executeRawUnsafe(`
      UPDATE users 
      SET email = LOWER(TRIM(email)) 
      WHERE email != LOWER(TRIM(email));
    `);
    console.log(`✅ Updated ${userResult} user email(s) to lowercase.`);

    const clientResult = await prisma.$executeRawUnsafe(`
      UPDATE clients 
      SET email = LOWER(TRIM(email)) 
      WHERE email != LOWER(TRIM(email));
    `);
    console.log(`✅ Updated ${clientResult} client email(s) to lowercase.`);

    console.log('✨ All emails normalized successfully.');
  } catch (err) {
    console.error('❌ Error normalizing emails:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = main;

