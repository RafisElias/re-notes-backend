import { afterAll, beforeAll } from 'vitest';
import { connect, clear } from './dbTestConnection';

beforeAll(async () => connect());
afterAll(async () => {
  await clear();
});
