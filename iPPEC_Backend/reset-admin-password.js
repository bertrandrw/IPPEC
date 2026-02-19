// Script to reset admin password
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const BCRYPT_SALT_ROUNDS = 10;

async function resetAdminPassword() {
  try {
    // Find the admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.log('No admin user found!');
      return;
    }

    console.log('Found admin user:', adminUser.email);

    // Hash the new password
    const newPassword = 'admin123'; // Simple password for local development
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    // Update the user's password
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: hashedPassword }
    });

    console.log('✅ Admin password reset successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 New Password:', newPassword);
    console.log('🌐 You can now login at: http://localhost:30000/api/v1/auth/login');

  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();