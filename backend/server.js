import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import petRoutes from './routes/petRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Root Status Route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: '🐾 Digital Pet Care Manager API is running smoothly!',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/appointments', appointmentRoutes);

// Fallback 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('⚠️ Unhandled Server Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
=====================================================
🐾  Digital Pet Care Manager Backend Server Ready!
🚀  Running on: http://localhost:${PORT}
📚  API Health Check: http://localhost:${PORT}/api/status
=====================================================
  `);
});
