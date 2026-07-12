import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'test') {
  dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });
} else {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cardealership?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key-that-should-be-changed-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  NODE_ENV: nodeEnv,
};

// Simple sanity check validation
if (!env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environmental variables.');
}
