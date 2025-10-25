import { createQueryKeys } from '@/services/react-query/createQueryKeys';

export const authKeys = createQueryKeys({
  entity: 'auth',
});

export const AUTH_TOKEN_KEY = 'whiteboard_auth_token';
export const AUTH_REFRESH_TOKEN_KEY = 'whiteboard_refresh_token';
export const AUTH_SESSION_KEY = 'whiteboard_session';
