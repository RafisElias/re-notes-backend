import mongoose from 'mongoose';

import app from './app';
import connectDataBase from './dbConnection';
import { logEvents } from './middleware/logger.middleware';
import { PORT } from './config';

connectDataBase();

mongoose.connection.once('open', () => {
  console.log('Conectado ao mongoDB');
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  const message = `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`;
  logEvents(message, 'mongoErrLog.log');
});
