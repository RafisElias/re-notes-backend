import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import type {
  TUserProps,
  TUserWithIdProps,
  TUserWithoutPassword
} from './users.model';
import {
  createUser,
  findAllUsers,
  findUserById,
  findAndUpdateUser,
  findAndDeleteUser
} from './users.services';

/**
@desc Create a new user
@route POST /api/v1/users
@access Private
* */
export async function createUserHandler(
  req: Request<{}, TUserWithoutPassword, TUserProps>,
  res: Response<TUserWithoutPassword>
) {
  const { username, password, roles } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  let newUserObject = {
    username,
    password: hashedPassword
  } as TUserProps;

  if (Array.isArray(roles) && roles.length) {
    newUserObject = {
      ...newUserObject,
      roles
    };
  }
  const result = await createUser(newUserObject);
  res.status(201).json(result);
}

/**
@desc Get all users
@route GET /api/v1/users
@access Private
* */
export async function findAllUsersHandler(
  _req: Request,
  res: Response<TUserWithIdProps[]>
) {
  const result = await findAllUsers({ lean: false });
  res.status(200).json(result);
}

/**
@desc Get user by ID
@route GET /users/:id
@access Private
* */
export async function findUserByIdHandler(
  req: Request<ParamsWithId, TUserWithIdProps, {}>,
  res: Response<TUserWithoutPassword>
) {
  const userId = req.params.id;
  const result = await findUserById(userId, { lean: false });

  if (!result) {
    res.statusCode = 404;
    throw new Error(`User with id "${userId}" not found`);
  }
  res.status(200).json(result);
}

/** * */
export async function updateUserHandler(
  req: Request<ParamsWithId, TUserWithoutPassword, TUserProps>,
  res: Response<TUserWithoutPassword>
) {
  const userId = req.params.id;
  const result = await findAndUpdateUser(userId, req.body, {
    new: true,
    lean: false
  });

  if (!result) {
    res.statusCode = 404;
    throw Error(`User with id "${userId}" not found`);
  }
  res.status(200).send(result);
}

export async function deleteUserHandler(
  req: Request<ParamsWithId, {}, {}>,
  res: Response<{}>
) {
  const userId = req.params.id;
  const result = await findAndDeleteUser(userId);

  if (!result) {
    res.statusCode = 404;
    throw Error(`User with id "${userId}" not found`);
  }
  res.statusCode = 204;
  res.send();
}
