export const APIEndpoints = {
  me: '/api/v1/dispatchers/me?'
} as const;

export const APIRegexes = {
  signIn: /v1\/sign-in/,
  drivers: /v1\/drivers\?page/
} as const;
