import { expect } from '@playwright/test';

export type User = {
  name: string;
  email: string;
  password: string;
};

export class UserBuilder {
  private user: User;

  constructor(name: string, email: string) {
    this.user = {
      name,
      email,
      password: process.env[`USER_${name.toUpperCase()}_PASS`] ?? '',
    };
  }

  validate() {
    expect(this.user.password, `Missing env var: USER_${this.user.name.toUpperCase()}_PASS`).toBeTruthy();
    return this;
  }

  build() {
    return this.user;
  }
}

export const users = {
  testUser: new UserBuilder('Test', 'test@gmail.com').build(),
};
