import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for your pet'],
      trim: true,
      maxlength: [50, 'Pet name cannot exceed 50 characters'],
    },
    species: {
      type: String,
      required: [true, 'Please specify the species (e.g., Dog, Cat, Bird)'],
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'],
      default: 'Dog',
    },
    breed: {
      type: String,
      trim: true,
      default: 'Mixed / Unknown',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      default: 'Unknown',
    },
    birthDate: {
      type: Date,
    },
    ageYears: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      default: 1,
    },
    weightKg: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      default: 5.0,
    },
    microchipId: {
      type: String,
      trim: true,
      default: '',
    },
    allergies: {
      type: [String],
      default: [],
    },
    specialNotes: {
      type: String,
      trim: true,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Pet = mongoose.model('Pet', petSchema);

export default Pet;
