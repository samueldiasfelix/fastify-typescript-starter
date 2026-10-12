import { env } from '#/config/env';

export const isProduction = env.NODE_ENV === 'production';

export const isDevelopment = env.NODE_ENV === 'development';

export const isTest = env.NODE_ENV === 'test';

export const isNonProduction = !isProduction;

export const isDevelopmentOrTest = isDevelopment || isTest;
