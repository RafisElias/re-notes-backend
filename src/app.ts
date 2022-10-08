import 'express-async-errors';
import path from 'node:path';
import express, { Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import errorHandler from './middleware/erroHandler.middleware';
import { logger } from './middleware/logger.middleware';
import notFound from './middleware/notFound.middleware';
import api from './api';

const app = express();

app.use(logger);

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public/css')));

app.get('^/$|index(.html)?', (_, res: Response) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

export default app;
