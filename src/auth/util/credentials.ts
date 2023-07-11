import {QueryClient} from '@tanstack/react-query';
import axios from 'axios';

export function postCredentials(
  credentials: Credentials,
  queryClient: QueryClient,
) {
  const domain = queryClient.getQueryData<string>(['domain']);
  return axios.post<CredentialsData>(
    `${domain}/api/auth/callback/credentials`,
    credentials,
    {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        cookie:
          `next-auth.csrf-token=${credentials.csrfToken};` +
          `next-auth.callback-url=${credentials.callbackUrl};`,
      },
    },
  );
}

export type CredentialsData = {
  url: string;
};

export type Credentials = {
  username: string;
  password: string;
  redirect: boolean;
  csrfToken: string;
  callbackUrl: string;
  json: boolean;
};
