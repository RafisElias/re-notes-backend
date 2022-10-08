import { Request, Response } from 'express';
import path from 'node:path';

export default function notFound(req: Request, res: Response) {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: `🔍 - Not Found - ${req.originalUrl}` });
  } else {
    res.type('txt').send(`🔍 - Not Found - ${req.originalUrl}`);
  }
}
