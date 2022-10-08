/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { Schema, model } from 'mongoose';
import { z } from 'zod';

export const User = z.object({
  username: z.string().min(1, 'O campo deve conter no mínimo um dígito.'),
  password: z.string().min(1, 'O campo deve conter no mínimo um dígito.'),
  roles: z.array(z.string()).default(['employee']),
  active: z.boolean().default(true)
});

const userId = z.object({
  id: z.string().min(1)
});

export const UserWithId = User.merge(userId);
export const UserWithoutPassword = UserWithId.omit({ password: true });

export type TUserProps = z.infer<typeof User>;
export type TUserWithIdProps = z.infer<typeof UserWithId>;
export type TUserWithoutPassword = z.infer<typeof UserWithoutPassword>;

const userSchema = new Schema<TUserProps>({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    default: ['employee']
  },
  active: {
    type: Boolean,
    default: true
  }
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export const UsersModel = model<TUserWithIdProps>('users', userSchema);
