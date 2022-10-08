import { describe, expect, it } from 'vitest';

import request from 'supertest';

import app from './app';

describe('app', () => {
  it('responds with a not found message', async () => {
    await request(app)
      .get('/what-is-this-even')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
  });
});

describe('GET /', () => {
  it('responds with a json message', async () => {
    await request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=UTF-8')
      .expect(200)
      .then((response) => {
        expect(response.text).toBeTruthy();
      });
  });
});
