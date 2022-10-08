import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import app from '../../app';
import type { TUserWithIdProps } from './users.model';

const createUserObject = {
  username: 'teste',
  password: 'teste'
};

const updatedUserObject = {
  username: 'updated',
  password: 'updated'
};

let user = {} as TUserWithIdProps;

const USERS_API_ROUTE = '/api/v1/users';

describe('GET /api/v1/users', () => {
  it('should return a empty array of users', async () => {
    const response = await request(app)
      .get(USERS_API_ROUTE)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toHaveProperty('length');
    expect(response.body.length).toBe(0);
  });
});

describe('POST /api/v1/users', () => {
  it('should return a error when try save the User', async () => {
    const response = await request(app)
      .post(USERS_API_ROUTE)
      .set('Accept', 'application/json')
      .send({ username: '', password: '' })
      .expect('Content-Type', /json/)
      .expect(422);
    expect(response.body).toHaveProperty('message');
  });
  it('should create a new user and return the inserted user', async () => {
    const response = await request(app)
      .post(USERS_API_ROUTE)
      .set('Accept', 'application/json')
      .send(createUserObject)
      .expect('Content-Type', /json/)
      .expect(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('roles');
    expect(response.body).toHaveProperty('active');
    expect(response.body).not.toHaveProperty('password');
    user = response.body;
  });

  it('should should return a 409 error when tries insert the same username', async () => {
    const response = await request(app)
      .post(USERS_API_ROUTE)
      .set('Accept', 'application/json')
      .send(createUserObject)
      .expect('Content-Type', /json/)
      .expect(409);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Esse usuário já existe.');
  });
});

describe('GET /api/v1/users/:id', () => {
  it('should return a not found error', async () => {
    const response = await request(app)
      .get(`${USERS_API_ROUTE}/63349c701dc3a8aef4b3553a`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
    expect(response.body).toHaveProperty('message');
  });
  it('should return a invalid ID error', async () => {
    await request(app)
      .get(`${USERS_API_ROUTE}/adasdasdasdsa`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);
  });

  it('should return a User object', async () => {
    const response = await request(app)
      .get(`${USERS_API_ROUTE}/${user.id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toHaveProperty('username');
    expect(response.body.username).toBe(user.username);
    expect(response.body).toHaveProperty('roles');
    expect(response.body.roles).toEqual(user.roles);
    expect(response.body).toHaveProperty('active');
    expect(response.body.active).toBe(user.active);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(user.id);
    expect(response.body).not.toHaveProperty('password');
  });
});

describe('PATCH /api/v1/users/:id', () => {
  const mockName = 'rafael';
  beforeAll(async () => {
    await request(app)
      .post(USERS_API_ROUTE)
      .set('Accept', 'application/json')
      .send({ username: mockName, password: 'rafael123' })
      .expect('Content-Type', /json/)
      .expect(201);
  });

  it('should return a not found error', async () => {
    const response = await request(app)
      .patch(`${USERS_API_ROUTE}/63349c701dc3a8aef4b3553a`)
      .set('Accept', 'application/json')
      .send(updatedUserObject)
      .expect('Content-Type', /json/)
      .expect(404);
    expect(response.body).toHaveProperty('message');
  });

  it('should return a invalid ID error', async () => {
    await request(app)
      .patch(`${USERS_API_ROUTE}/adasdasdasdsa`)
      .set('Accept', 'application/json')
      .send(updatedUserObject)
      .expect('Content-Type', /json/)
      .expect(422);
  });

  it('should return a a 409 error when try update the username to one already used', async () => {
    await request(app)
      .patch(`${USERS_API_ROUTE}/${user.id}`)
      .set('Accept', 'application/json')
      .send({ ...updatedUserObject, username: mockName })
      .expect('Content-Type', /json/)
      .expect(409);
  });

  it('should return the updated user object', async () => {
    const response = await request(app)
      .patch(`${USERS_API_ROUTE}/${user.id}`)
      .set('Accept', 'application/json')
      .send(updatedUserObject)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).not.toHaveProperty('password');
  });

  it('should return the updated user object with active false', async () => {
    const response = await request(app)
      .patch(`${USERS_API_ROUTE}/${user.id}`)
      .set('Accept', 'application/json')
      .send({ ...updatedUserObject, active: false })
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(user.id);
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('roles');
    expect(response.body).toHaveProperty('active');
    expect(response.body.active).toBe(false);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return the updated user object with roles: ["employee", "admin"]', async () => {
    const response = await request(app)
      .patch(`${USERS_API_ROUTE}/${user.id}`)
      .set('Accept', 'application/json')
      .send({ ...updatedUserObject, roles: ['employee', 'admin'] })
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).toHaveProperty('roles');
    expect(response.body.roles).toEqual(['employee', 'admin']);
    expect(response.body).not.toHaveProperty('password');
  });
});

describe('DELETE /api/v1/users/:id', () => {
  it('should return a not found error', async () => {
    const response = await request(app)
      .delete(`${USERS_API_ROUTE}/63349c701dc3a8aef4b3553a`)
      .set('Accept', 'application/json')
      .expect(404);
    expect(response.body).toHaveProperty('message');
  });

  it('should return a invalid ID error', async () => {
    await request(app)
      .delete(`${USERS_API_ROUTE}/adasdasdasdsa`)
      .set('Accept', 'application/json')
      .expect(422);
  });

  it('should delete the user and return 204 status code', async () => {
    await request(app)
      .delete(`${USERS_API_ROUTE}/${user.id}`)
      .set('Accept', 'application/json')
      .expect(204);
  });

  it('should return 404 status when try delete a already deleted user', async () => {
    await request(app)
      .delete(`${USERS_API_ROUTE}/${user.id}`)
      .set('Accept', 'application/json')
      .expect(404);
  });

  it('should return 404 status when try get a already deleted user', async () => {
    await request(app)
      .get(`${USERS_API_ROUTE}/${user.id}`)
      .set('Accept', 'application/json')
      .expect(404);
  });
});
