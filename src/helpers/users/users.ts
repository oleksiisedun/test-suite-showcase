import { expect } from '@playwright/test';
import { User } from './users.types';

export class UserBuilder {
  private user: User;

  constructor(name: string, username: string) {
    this.user = {
      name,
      username,
      password: process.env.USERS_PASSWORD ?? '',
    };
  }

  validate() {
    expect(this.user.password, 'Missing env var: USERS_PASSWORD').toBeTruthy();
    return this;
  }

  build() {
    return this.user;
  }
}

export const users = {
  standardUser: new UserBuilder('Standard', 'standard_user').validate().build(),
  lockedOutUser: new UserBuilder('Locked Out', 'locked_out_user').validate().build(),
  problemUser: new UserBuilder('Problem', 'problem_user').validate().build(),
  performanceGlitchUser: new UserBuilder('Performance Glitch', 'performance_glitch_user').validate().build(),
  errorUser: new UserBuilder('Error', 'error_user').validate().build(),
  visualUser: new UserBuilder('Visual', 'visual_user').validate().build(),
};
