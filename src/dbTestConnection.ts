import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const connect = async () => {
  await mongoose.disconnect();

  mongoServer = await MongoMemoryServer.create();

  const mongoUri = await mongoServer.getUri();
  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    process.exit(1);
  }
};

export const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
};

export const clear = async () => {
  const collections = await mongoose.connection.db.collections();

  await Promise.all(
    collections.map(async (collection) => {
      await collection.deleteMany({});
    })
  );
};
