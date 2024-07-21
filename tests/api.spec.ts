import { test, expect } from '../src/fixtures/login';
import { users } from '../src/helpers/users';

test('Check user email', async ({ api, user }) => {
  const { email } = await api.get('me');
  expect(email).toBe(users[user].email);
});
