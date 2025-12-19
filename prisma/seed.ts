import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

async function main() {
  const adminUsername = 'admin';
  const adminPassword = process.env.ADMIN_PASS;
  
  if (!adminPassword) {
    throw new Error('Missing ADMIN_PASS environment variable');
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });