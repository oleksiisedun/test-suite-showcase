import { APIEndpoints, APIRegexes } from './api.constants';

export type APIEndpoint = keyof typeof APIEndpoints;
export type APIRegex = keyof typeof APIRegexes;
