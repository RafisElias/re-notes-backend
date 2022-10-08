/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import { TUserProps } from './users.model';
import { hasDuplicateUser } from './users.services';

export function checkIfHasDuplicate() {
  return async (
    req: Request<ParamsWithId, {}, TUserProps>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await hasDuplicateUser(req.body.username);

      // TODO: change the name of the variable
      const hasAnotherUser = result?._id.toString() !== req.params.id;

      if (result && hasAnotherUser) {
        res.status(409).json({ message: 'Esse usuário já existe.' });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
