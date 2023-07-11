import {QueryClient} from '@tanstack/react-query';
import axios from 'axios';

export function getSession(csrf: string, queryClient: QueryClient) {
  const domain = queryClient.getQueryData<string>(['domain']);
  return axios.get<SessionData>(`${domain}/api/auth/session`, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: 'next-auth.csrf-token=' + csrf,
    },
  });
}

export type SessionData = {
  user: {
    id: string;
  };
  expires: string;
};
