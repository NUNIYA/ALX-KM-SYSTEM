const mongoose = require('mongoose');
require('dotenv').config();

const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

let cached = global.__mongooseConnection;
if (!cached) {
  cached = global.__mongooseConnection = { conn: null, promise: null };
}

const CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: isServerless ? 5 : 10,
  minPoolSize: isServerless ? 0 : 2,
  maxIdleTimeMS: isServerless ? 10000 : 30000,
  heartbeatFrequencyMS: isServerless ? 15000 : 10000,
  bufferCommands: !isServerless,
  autoIndex: !isServerless,
};

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

async function connectWithRetry(uri, options, attempt = 1) {
  try {
    return await mongoose.connect(uri, options);
  } catch (error) {
    if (attempt >= MAX_RETRIES) {
      throw error;
    }
    const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
    console.warn(
      `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}. Retrying in ${delay}ms...`
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    return connectWithRetry(uri, options, attempt + 1);
  }
}

function registerConnectionEvents() {
  const conn = mongoose.connection;

  conn.on('connected', () => {
    console.log('MongoDB connection established');
  });

  conn.on('disconnected', () => {
    console.warn('MongoDB connection lost');
    cached.conn = null;
    cached.promise = null;
  });

  conn.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
    cached.conn = null;
    cached.promise = null;
  });
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error(
      'MONGO_URI environment variable is not defined. Please set it in your .env file or hosting platform.'
    );
  }

  if (!cached.promise) {
    registerConnectionEvents();
    cached.promise = connectWithRetry(process.env.MONGO_URI, CONNECTION_OPTIONS)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        cached.conn = conn;
        return conn;
      })
      .catch((error) => {
        cached.promise = null;
        console.error(
          `MongoDB connection failed after ${MAX_RETRIES} attempts: ${error.message}`
        );
        throw error;
      });
  }

  return cached.promise;
};

if (!isServerless) {
  const shutdown = async (signal) => {
    console.log(`${signal} received. Closing MongoDB connection...`);
    await mongoose.connection.close();
    cached.conn = null;
    cached.promise = null;
    process.exit(0);
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = connectDB;
