import path from 'node:path';
import dotenv from 'dotenv';

const envPath =
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '..', `.env.${process.env.NODE_ENV}`)
    : path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`);

dotenv.config({
  path: envPath
});

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI || '';
