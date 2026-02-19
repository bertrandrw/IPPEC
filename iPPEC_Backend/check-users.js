// Test script to check if there are any users in the database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
      }
    });
    
    console.log('Total users:', users.length);
    console.log('Users:', JSON.stringify(users, null, 2));
    
    // Check specifically for admin users
    const adminUsers = users.filter(user => user.role === 'ADMIN');
    console.log('Admin users:', adminUsers.length);
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();