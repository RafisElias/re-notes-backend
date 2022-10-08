import { describe, it, expect } from 'vitest';

import { User, type TUserProps } from './users.model';

describe('User model', () => {
  it('should create a new User model', async () => {
    const newUser: TUserProps = {
      active: false,
      password: 'password',
      username: 'Rafael',
      roles: ['employee']
    };

    const result = await User.safeParseAsync(newUser);
    expect(result.success).toEqual(true);
    if (result.success) expect(result.data).toEqual(newUser);
  });

  it('should not create a new User model', async () => {
    const newUser = {
      active: false,
      username: 'Rafael',
      roles: ['employee']
    } as TUserProps;

    const result = await User.safeParseAsync(newUser);
    expect(result.success).toBe(false);
  });
});
