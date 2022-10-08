/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import { TNoteProps } from './notes.model';
import { hasDuplicateNote } from './notes.services';

export function checkIfHasDuplicate() {
  return async (
    req: Request<ParamsWithId, {}, TNoteProps>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await hasDuplicateNote(req.body.title);

      // TODO: change the name of the variable
      const hasAnotherNote = result?._id.toString() !== req.params.id;

      if (result && hasAnotherNote) {
        res.statusCode = 409;
        res.json({ message: 'Titulo da nota duplicado.' });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
