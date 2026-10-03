import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses Mongoose with recommended options and clear error diagnostics.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pet_care_manager';
    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Tip: Ensure MongoDB service is running locally on port 27017 or provide a valid MONGO_URI in .env');
    // We do not terminate process immediately in dev mode so the server can display clear status to users
  }
};

export default connectDB;
