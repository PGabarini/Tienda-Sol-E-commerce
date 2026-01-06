import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer

export async function openDb() {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '5.0.18',
    },
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}

export async function clearDb() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
}

export async function closeDb() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}
