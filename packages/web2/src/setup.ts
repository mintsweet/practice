import { setupRequest, createCookieStrategy } from '@mints/request';

setupRequest({
  baseURL: '/api',
  auth: createCookieStrategy({
    refreshPath: '/api/auth/refresh',
    tokenField: 'accessToken',
  }),
});
