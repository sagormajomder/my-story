import { connectDB } from '../config/db.js';
import { User } from '../modules/user/user.model.js';

const seedUsers = [
  {
    name: 'Super Admin',
    email: 'admin@mystory.com',
    password: 'password123',
    role: 'super_admin',
  },
  {
    name: 'Moderator User',
    email: 'mod@mystory.com',
    password: 'password123',
    role: 'moderator',
  },
  {
    name: 'Regular User',
    email: 'user@mystory.com',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Regular User 2',
    email: 'user2@mystory.com',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Guest User',
    email: 'guest@mystory.com',
    password: 'password123',
    role: 'guest',
  },
];

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Checking for existing seed users...');

    let createdCount = 0;

    for (const seed of seedUsers) {
      const exists = await User.findOne({ email: seed.email });
      if (!exists) {
        await User.create(seed);
        console.log(`Created ${seed.role}: ${seed.email}`);
        createdCount++;
      } else {
        console.log(`User already exists: ${seed.email}`);
      }
    }

    console.log(
      `Seed script completed successfully! Created ${createdCount} new users.`,
    );
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
