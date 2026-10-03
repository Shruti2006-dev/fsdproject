import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Please associate this record with a pet'],
    },
    recordType: {
      type: String,
      required: true,
      enum: ['Vaccination', 'Medication', 'Deworming', 'Checkup', 'Surgery', 'Allergy Test', 'Weight Check', 'Other'],
      default: 'Vaccination',
    },
    title: {
      type: String,
      required: [true, 'Please provide a title (e.g. Rabies Vaccine, Heartworm Prevention)'],
      trim: true,
    },
    dateAdministered: {
      type: Date,
      default: Date.now,
    },
    nextDueDate: {
      type: Date,
      default: null,
    },
    veterinarian: {
      type: String,
      trim: true,
      default: '',
    },
    clinicName: {
      type: String,
      trim: true,
      default: '',
    },
    dosage: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

export default HealthRecord;
