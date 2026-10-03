import mongoose from 'mongoose';

const careTaskSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Please associate this task with a pet'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title (e.g. Morning Kibble, 30-min Walk)'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Feeding', 'Walk', 'Medication', 'Grooming', 'Play', 'Water', 'Cleaning', 'Other'],
      default: 'Feeding',
    },
    time: {
      type: String,
      default: '08:00 AM',
      trim: true,
    },
    frequency: {
      type: String,
      enum: ['Daily', 'Twice Daily', 'Weekly', 'As Needed', 'Once'],
      default: 'Daily',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
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

const CareTask = mongoose.model('CareTask', careTaskSchema);

export default CareTask;
