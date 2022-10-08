import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import users from './users/users.routes';
import notes from './notes/notes.routes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/users', users);
router.use('/notes', notes);

export default router;
