import mongoose from 'mongoose';
// Mock data
import roomsMockData from './mockData/rooms.json';
// Models
import Room from '../models/Room';

const initDatabase = (): void => {
  // Connect to MongoDB
  mongoose.connect(
    'mongodb+srv://ulianchenko:a1b2c3d4e5@cluster0.nzybwy4.mongodb.net/dbAmalfi?retryWrites=true&w=majority'
  );

  const db: mongoose.Connection = mongoose.connection;
  db.on('error', console.error.bind(console, 'Connection error'));
  db.once('open', async function () {
    console.log('Connected successfully');
    const roomsCount: number = await Room.estimatedDocumentCount();
    if (roomsCount === 0) {
      try {
        await Room.insertMany(roomsMockData);
        console.log('Database was uploaded from mock data');
      } catch (err) {
        console.error('Error uploading database from mock data');
      }
    }
  });
}

export default initDatabase;