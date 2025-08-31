import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tohatsu.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'مدير النظام',
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Password:', adminPassword);
    console.log('Please change the password after first login');

  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
