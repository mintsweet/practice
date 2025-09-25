import { setupRequest, createCookieStrategy } from '@mints/request';
import { toast } from '@mints/ui';

setupRequest({
  baseURL: '/api',
  toast: {
    success: toast.success,
    error: toast.error,
  },
  auth: createCookieStrategy({
    refreshPath: '/api/auth/refresh',
    tokenField: 'accessToken',
  }),
});
