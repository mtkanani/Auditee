const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const otps = await prisma.otp.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('--- LATEST REGISTRATION OTPs ---');
  console.log(JSON.stringify(otps, null, 2));
  
  const forgotOtps = await prisma.forgotPasswordOtp.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('--- LATEST FORGOT PASSWORD OTPs ---');
  console.log(JSON.stringify(forgotOtps, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
