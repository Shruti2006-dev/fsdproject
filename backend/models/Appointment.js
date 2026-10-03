import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Please select a pet for this appointment'],
    },
    clinicName: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true,
    },
    doctorName: {
      type: String,
      trim: true,
      default: '',
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      default: '10:00 AM',
      trim: true,
    },
    reason: {
      type: String,
      required: [true, 'Please specify the reason for visit'],
      trim: true,
      default: 'Routine Health Checkup',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled',
    },
    contactPhone: {
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

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
