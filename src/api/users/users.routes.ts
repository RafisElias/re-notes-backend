import { Router } from 'express';

import * as UsersController from './user.controller';
import { User } from './users.model';
import validateRequest from '../../middleware/validateRequest.middleware';
import { checkIfHasDuplicate } from './users.middleware';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

const router = Router();

router
  .route('/')
  .get(UsersController.findAllUsersHandler)
  .post(
    [validateRequest({ body: User }), checkIfHasDuplicate()],
    UsersController.createUserHandler
  );

router
  .route('/:id')
  .get(
    validateRequest({ params: ParamsWithId }),
    UsersController.findUserByIdHandler
  )
  .patch(
    [
      validateRequest({ params: ParamsWithId, body: User }),
      checkIfHasDuplicate()
    ],
    UsersController.updateUserHandler
  )
  .delete(
    validateRequest({ params: ParamsWithId }),
    UsersController.deleteUserHandler
  );

export default router;
