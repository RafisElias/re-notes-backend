import { QueryOptions, UpdateQuery } from 'mongoose';
import { TUserProps, TUserWithIdProps, UsersModel } from './users.model';

export async function createUser(data: TUserProps) {
  const result = await UsersModel.create(data);
  return {
    id: result.id,
    username: result.username,
    active: result.active,
    roles: result.roles
  };
}

export async function findAllUsers(options: QueryOptions = { lean: true }) {
  return UsersModel.find({}, {}, options).select('-password');
}

export async function findUserById(
  userId: string,
  options: QueryOptions = { lean: true }
) {
  return UsersModel.findById(userId, {}, options).select('-password').exec();
}

export async function findAndUpdateUser(
  userId: string,
  update: UpdateQuery<TUserWithIdProps>,
  options: QueryOptions = { lean: false, new: true }
) {
  return UsersModel.findByIdAndUpdate(userId, update, options)
    .select('-password')
    .exec();
}

export async function findAndDeleteUser(
  userId: string,
  options: QueryOptions = { lean: true, new: true }
) {
  return UsersModel.findByIdAndDelete(userId, options);
}

export async function hasDuplicateUser(username: string) {
  const result = await UsersModel.findOne({ username })
    .collation({ locale: 'pt', strength: 2 })
    .lean()
    .exec();

  return result;
}
