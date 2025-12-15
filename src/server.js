import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import sweetRoutes from './routes/sweet.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.option('*',cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sweet Shop API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Database connection - skip in test environment
if (process.env.NODE_ENV !== 'test') {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('ERROR: MONGODB_URI is not set in environment variables');
    console.error('Please create a .env file in the backend directory with MONGODB_URI');
    process.exit(1);
  }
  
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📍 API available at http://localhost:${PORT}/api`);
      });
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      console.error('Please check your MONGODB_URI in the .env file');
      process.exit(1);
    });
}

export default app;

