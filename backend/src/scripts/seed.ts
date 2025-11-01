import sequelize from '../config/database';
import Experience from '../models/Experience';
import Slot from '../models/Slot';

const seedData = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create experiences
    const experiences = await Experience.bulkCreate([
      {
        name: 'Kayaking',
        location: 'Udupi',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        price: 999,
      },
      {
        name: 'Kayaking',
        location: 'Udupi, Karnataka',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        image: 'https://images.unsplash.com/photo-1503481766315-7a586b20f66d?w=800',
        price: 999,
      },
      {
        name: 'Kayaking',
        location: 'Udupi, Karnataka',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        price: 999,
      },
      {
        name: 'Nandi Hills Sunrise',
        location: 'Bangalore',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        price: 899,
      },
      {
        name: 'Coffee Trail',
        location: 'Coorg',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
        price: 1299,
      },
      {
        name: 'Nandi Hills Sunrise',
        location: 'Bangalore',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        image: 'https://images.unsplash.com/photo-1495556650867-99590cea3657?w=800',
        price: 899,
      },
      {
        name: 'Boat Cruise',
        location: 'Sundarban',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
        price: 999,
      },
      {
        name: 'Bunjee Jumping',
        location: 'Manali',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
        price: 999,
      },
    ]);

    console.log(`Created ${experiences.length} experiences`);

    // Create slots for each experience
    interface SlotData {
      experienceId: string;
      date: Date;
      time: string;
      availableSpots: number;
      totalSpots: number;
    }
    const slots: SlotData[] = [];
    const dates = ['2025-10-22', '2025-10-23', '2025-10-24', '2025-10-25', '2025-10-26'];
    const times = [
      { time: '07:00 am', slots: 4 },
      { time: '9:00 am', slots: 2 },
      { time: '11:00 am', slots: 5 },
      { time: '1:00 pm', slots: 0 },
    ];

    for (const experience of experiences) {
      for (const date of dates) {
        for (const timeSlot of times) {
          slots.push({
            experienceId: experience.id,
            date: new Date(date),
            time: timeSlot.time,
            availableSpots: timeSlot.slots,
            totalSpots: 10,
          });
        }
      }
    }

    await Slot.bulkCreate(slots);
    console.log(`Created ${slots.length} slots`);

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
