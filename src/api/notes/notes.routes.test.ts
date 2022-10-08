import { expect, it, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import app from '../../app';
import { type TUserWithIdProps, UsersModel } from '../users/users.model';
import { type TNoteWithIdProps } from './notes.model';

let user = {} as TUserWithIdProps;
let note = {} as TNoteWithIdProps;

let createdNoteObject = {
  user: '',
  title: 'Esse é o titulo da minha nota',
  text: 'Esse é o texto da minha nota'
};

let updatedNoteObject = {
  user: '',
  title: 'Esse é o titulo da minha nota atualizado',
  text: 'Esse é o texto da minha nota atualizado'
};

const NOTES_API_URL: string = '/api/v1/notes';

beforeAll(async () => {
  const response = await request(app)
    .post('/api/v1/users')
    .set('Accept', 'application/json')
    .send({
      username: 'teste',
      password: 'teste'
    });
  user = response.body;
  updatedNoteObject = {
    ...updatedNoteObject,
    user: user.id
  };
  createdNoteObject = {
    ...createdNoteObject,
    user: user.id
  };
});

afterAll(() => {
  UsersModel.deleteMany({});
});

describe('GET /api/v1/notes', async () => {
  it('should return a empty array of notes', async () => {
    const response = await request(app)
      .get(NOTES_API_URL)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
    expect(response.body).toHaveProperty('length');
    expect(response.body.length).toBe(0);
  });
});

describe('POST /api/v1/notes', async () => {
  it('should return return 422 a error when try create a note', async () => {
    const response = await request(app)
      .post(NOTES_API_URL)
      .set('Accept', 'application/json')
      .send({})
      .expect('content-type', /json/)
      .expect(422);

    expect(response.body).toHaveProperty('message');
  });

  it('should create a new note and return the inserted note', async () => {
    const response = await request(app)
      .post(NOTES_API_URL)
      .set('Accept', 'application/json')
      .send({
        user: user.id,
        title: 'Esse é o titulo da minha nota',
        text: 'Esse é o texto da minha nota'
      })
      .expect('content-type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toEqual({
      username: user.username,
      id: user.id
    });
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('title');
    expect(response.body.title).toBe('Esse é o titulo da minha nota');
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('text');
    expect(response.body.text).toBe('Esse é o texto da minha nota');
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('completed');
    expect(response.body.completed).toBe(false);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.createdAt).toBeTypeOf('string');
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body.updatedAt).toBeTypeOf('string');
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('ticket');
    expect(response.body.ticket).toBeTypeOf('number');
    expect(response.body.ticket).toBeGreaterThanOrEqual(500);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('id');
    note = response.body;
  });

  it('should return a 409 erro when try insert a already used title', async () => {
    const response = await request(app)
      .post(NOTES_API_URL)
      .set('Accept', 'application/json')
      .send(createdNoteObject)
      .expect('content-type', /json/)
      .expect(409);
    expect(response.body).toHaveProperty('message');
  });
});

describe('GET /api/v1/notes:id', () => {
  it('should return a not found error', async () => {
    const response = await request(app)
      .get(`${NOTES_API_URL}/63349c701dc3a8aef4b3553a`)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(404);
    expect(response.body).toHaveProperty('message');
  });

  it('should return invalid ID error', async () => {
    const response = await request(app)
      .get(`${NOTES_API_URL}/aoosaioasdoas`)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(422);

    expect(response.body).toHaveProperty('message');
  });

  it('should return the Note object', async () => {
    const response = await request(app)
      .get(`${NOTES_API_URL}/${note.id}`)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toEqual({
      username: user.username,
      id: user.id
    });
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('title');
    expect(response.body.title).toBe(note.title);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('text');
    expect(response.body.text).toBe(note.text);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('completed');
    expect(response.body.completed).toBe(note.completed);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.createdAt).toBe(note.createdAt);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body.updatedAt).toBe(note.updatedAt);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('ticket');
    expect(response.body.ticket).toBeTypeOf('number');
    expect(response.body.ticket).toBe(note.ticket);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(note.id);
  });
});

describe('PATCH /api/v1/notes/:id', () => {
  const mockTitle = 'Esse é o titulo da minha segunda nota';
  beforeAll(async () => {
    await request(app)
      .post(NOTES_API_URL)
      .set('Accept', 'application/json')
      .send({
        user: user.id,
        title: mockTitle,
        text: 'Esse é o texto da minha nota'
      })
      .expect('Content-Type', /json/)
      .expect(201);
  });

  it('should return a not found error', async () => {
    const response = await request(app)
      .patch(`${NOTES_API_URL}/63349c701dc3a8aef4b3553a`)
      .set('Accept', 'application/json')
      .send(updatedNoteObject)
      .expect('Content-Type', /json/)
      .expect(404);
    expect(response.body).toHaveProperty('message');
  });

  it('should return a invalid ID error', async () => {
    await request(app)
      .patch(`${NOTES_API_URL}/adasdasdasdsa`)
      .set('Accept', 'application/json')
      .send(updatedNoteObject)
      .expect('Content-Type', /json/)
      .expect(422);
  });

  it('should return a a 409 error when try update the username to one already used', async () => {
    await request(app)
      .patch(`${NOTES_API_URL}/${note.id}`)
      .set('Accept', 'application/json')
      .send({ ...updatedNoteObject, title: mockTitle })
      .expect('Content-Type', /json/)
      .expect(409);
  });

  it('should update the title and the text of the note and return the updated note', async () => {
    const response = await request(app)
      .patch(`${NOTES_API_URL}/${note.id}`)
      .set('Accept', 'application/json')
      .send(updatedNoteObject)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toEqual({
      username: user.username,
      id: user.id
    });
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('title');
    expect(response.body.title).toBe(updatedNoteObject.title);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('text');
    expect(response.body.text).toBe(updatedNoteObject.text);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('completed');
    expect(response.body.completed).toBe(note.completed);
    // ----------------------------------------------------- //
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(note.id);

    note = response.body;
  });

  it('should complete the note and return the updated note', async () => {
    const response = await request(app)
      .patch(`${NOTES_API_URL}/${note.id}`)
      .set('Accept', 'application/json')
      .send({ ...updatedNoteObject, completed: true })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('completed');
    expect(response.body.completed).toBe(true);
  });
});

describe('DELETE /api/v1/notes/:id', () => {
  it('should return a not found error', async () => {
    const response = await request(app)
      .delete(`${NOTES_API_URL}/63349c701dc3a8aef4b3553a`)
      .set('Accept', 'application/json')
      .expect(404);
    expect(response.body).toHaveProperty('message');
  });

  it('should return a invalid ID error', async () => {
    await request(app)
      .delete(`${NOTES_API_URL}/adasdasdasdsa`)
      .set('Accept', 'application/json')
      .expect(422);
  });

  it('should delete the note and return 204 status code', async () => {
    await request(app)
      .delete(`${NOTES_API_URL}/${note.id}`)
      .set('Accept', 'application/json')
      .expect(204);
  });

  it('should return 404 status when try delete a already deleted note', async () => {
    await request(app)
      .delete(`${NOTES_API_URL}/${note.id}`)
      .set('Accept', 'application/json')
      .expect(404);
  });

  it('should return 404 status when try get a already deleted note', async () => {
    await request(app)
      .get(`${NOTES_API_URL}/${note.id}`)
      .set('Accept', 'application/json')
      .expect(404);
  });
});
