import mongoose from 'mongoose';

import { MONGO_URI } from './config';

export default async function connectDataBase() {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    process.exit(1);
  }
}
