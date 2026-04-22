import { Request } from '@playwright/test';

export type RequestData = {
  env: string;
  pathname: string;
  href: string;
  type: string;
  status: number;
  time: Omit<ReturnType<Request['timing']>, 'startTime'> & { startTime: number | Date };
  size?: Awaited<ReturnType<Request['sizes']>>;
  errorMessage?: string;
};
