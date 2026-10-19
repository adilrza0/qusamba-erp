import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas with robust error handling, reconnection
 * monitoring, and graceful shutdown support.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 8 uses the Node driver defaults which are already optimal,
      // but we set these explicitly for clarity and control.
      maxPoolSize: 10,       // Max concurrent connections in the pool
      serverSelectionTimeoutMS: 5000,  // Fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,          // Close sockets after 45s of inactivity
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);

    // ─── Connection Event Listeners ─────────────────────────
    mongoose.connection.on('error', (err) => {
      console.error('❌  MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️   MongoDB disconnected. Attempting reconnection…');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄  MongoDB reconnected successfully.');
    });

  } catch (error) {
    console.error('❌  MongoDB initial connection failed:', error.message);
    process.exit(1); // Exit so a process manager (PM2, Docker) can restart
  }
};

/**
 * Gracefully close the Mongoose connection.
 * Called during SIGINT / SIGTERM to avoid orphaned connections.
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🛑  MongoDB connection closed gracefully.');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err.message);
  }
};

export { connectDB, disconnectDB };
