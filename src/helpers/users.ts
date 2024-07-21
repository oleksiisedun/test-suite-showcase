export class User {
  name: string;
  email: string;
  password: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
    this.password = process.env[`USER_${name.toUpperCase()}_PASS`] ?? '';
  }
}

export const users = {
  testUser: new User('Test', 'test@gmail.com')
};
