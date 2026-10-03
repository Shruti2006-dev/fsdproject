import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pet from '../models/Pet.js';
import CareTask from '../models/CareTask.js';
import HealthRecord from '../models/HealthRecord.js';
import Appointment from '../models/Appointment.js';
import connectDB from '../config/db.js';

dotenv.config();

const samplePets = [
  {
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    gender: 'Male',
    ageYears: 3,
    weightKg: 28.5,
    microchipId: '985141002348911',
    allergies: ['Chicken meal', 'Certain flea powders'],
    specialNotes: 'Loves playing fetch at the park. Takes joint supplements with morning meal.',
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Luna',
    species: 'Cat',
    breed: 'British Shorthair',
    gender: 'Female',
    ageYears: 2,
    weightKg: 4.2,
    microchipId: '985141009871234',
    allergies: ['None known'],
    specialNotes: 'Likes wet food in the evening and sleeping by the window.',
    avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Mochi',
    species: 'Rabbit',
    breed: 'Holland Lop',
    gender: 'Female',
    ageYears: 1,
    weightKg: 1.8,
    microchipId: '985141005556789',
    allergies: ['Alfalfa hay (excess)'],
    specialNotes: 'Needs fresh Timothy hay and fresh water replenished twice daily.',
    avatarUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing database data...');
    await Pet.deleteMany();
    await CareTask.deleteMany();
    await HealthRecord.deleteMany();
    await Appointment.deleteMany();

    console.log('🌱 Inserting sample pets...');
    const createdPets = await Pet.insertMany(samplePets);
    const [buddy, luna, mochi] = createdPets;

    console.log('🌱 Inserting daily routines and tasks...');
    await CareTask.insertMany([
      // Buddy's Tasks
      { petId: buddy._id, title: 'Morning Kibble & Joint Supplement', category: 'Feeding', time: '07:30 AM', frequency: 'Daily', isCompleted: true, completedAt: new Date() },
      { petId: buddy._id, title: '30-Minute Neighborhood Walk & Fetch', category: 'Walk', time: '08:15 AM', frequency: 'Daily', isCompleted: true, completedAt: new Date() },
      { petId: buddy._id, title: 'Evening Dinner (Wet + Dry Mix)', category: 'Feeding', time: '06:30 PM', frequency: 'Daily', isCompleted: false },
      { petId: buddy._id, title: 'Coat Brushing & Teeth Gel', category: 'Grooming', time: '08:00 PM', frequency: 'Daily', isCompleted: false },

      // Luna's Tasks
      { petId: luna._id, title: 'Fresh Water Bowl & Dry Food Refill', category: 'Feeding', time: '08:00 AM', frequency: 'Daily', isCompleted: true, completedAt: new Date() },
      { petId: luna._id, title: 'Interactive Laser / Feather Toy Session', category: 'Play', time: '05:00 PM', frequency: 'Daily', isCompleted: false },
      { petId: luna._id, title: 'Salmon Pate Dinner', category: 'Feeding', time: '07:00 PM', frequency: 'Daily', isCompleted: false },
      { petId: luna._id, title: 'Litter Box Cleaning', category: 'Cleaning', time: '09:00 PM', frequency: 'Daily', isCompleted: false },

      // Mochi's Tasks
      { petId: mochi._id, title: 'Fresh Timothy Hay & Leafy Greens', category: 'Feeding', time: '08:30 AM', frequency: 'Daily', isCompleted: true, completedAt: new Date() },
      { petId: mochi._id, title: 'Bunny Playpen Free Roam Time', category: 'Play', time: '06:00 PM', frequency: 'Daily', isCompleted: false },
    ]);

    console.log('🌱 Inserting health & vaccination logs...');
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    await HealthRecord.insertMany([
      {
        petId: buddy._id,
        recordType: 'Vaccination',
        title: 'Rabies 3-Year Vaccine Booster',
        dateAdministered: new Date('2024-03-15'),
        nextDueDate: new Date('2027-03-15'),
        veterinarian: 'Dr. Sarah Jenkins, DVM',
        clinicName: 'Paws & Claws Animal Hospital',
        dosage: '1.0 mL subcutaneous',
        notes: 'Buddy did great, no adverse reactions.',
      },
      {
        petId: buddy._id,
        recordType: 'Medication',
        title: 'Heartworm & Tick Preventive (NexGard Spectra)',
        dateAdministered: today,
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        veterinarian: 'Dr. Sarah Jenkins, DVM',
        clinicName: 'Paws & Claws Animal Hospital',
        dosage: '1 chewable tablet (monthly)',
        notes: 'Given with breakfast.',
      },
      {
        petId: luna._id,
        recordType: 'Vaccination',
        title: 'FVRCP Core Cat Vaccine',
        dateAdministered: new Date('2024-01-10'),
        nextDueDate: new Date('2025-01-10'),
        veterinarian: 'Dr. Michael Chang',
        clinicName: 'Happy Whiskers Feline Clinic',
        dosage: '0.5 mL',
        notes: 'Routine booster completed.',
      },
      {
        petId: mochi._id,
        recordType: 'Checkup',
        title: 'Annual Dental & Nail Health Check',
        dateAdministered: new Date('2024-04-02'),
        nextDueDate: new Date('2024-10-02'),
        veterinarian: 'Dr. Emily Vance (Exotics)',
        clinicName: 'Avian & Exotic Pet Care',
        dosage: 'N/A',
        notes: 'Molars in excellent alignment, nail trim done.',
      },
    ]);

    console.log('🌱 Inserting upcoming vet appointments...');
    const upcomingDate1 = new Date();
    upcomingDate1.setDate(upcomingDate1.getDate() + 5);
    upcomingDate1.setHours(10, 30, 0, 0);

    const upcomingDate2 = new Date();
    upcomingDate2.setDate(upcomingDate2.getDate() + 14);
    upcomingDate2.setHours(14, 0, 0, 0);

    await Appointment.insertMany([
      {
        petId: buddy._id,
        clinicName: 'Paws & Claws Animal Hospital',
        doctorName: 'Dr. Sarah Jenkins',
        appointmentDate: upcomingDate1,
        timeSlot: '10:30 AM',
        reason: 'Semi-Annual Wellness Exam & Weight Check',
        status: 'Scheduled',
        contactPhone: '(555) 234-5678',
        notes: 'Bring updated stool sample for routine lab panel.',
      },
      {
        petId: luna._id,
        clinicName: 'Happy Whiskers Feline Clinic',
        doctorName: 'Dr. Michael Chang',
        appointmentDate: upcomingDate2,
        timeSlot: '02:00 PM',
        reason: 'Dental Scaling Consultation',
        status: 'Scheduled',
        contactPhone: '(555) 876-5432',
        notes: 'Check tartar build-up on upper right premolars.',
      },
    ]);

    console.log('✅ Demo Pet Care data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
