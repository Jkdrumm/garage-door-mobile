import {QueryClient} from '@tanstack/react-query';
import {fetchAllowLocal} from 'auth';
import {DomainInfo} from 'types';

export function postCredentials(
  credentials: Credentials,
  queryClient: QueryClient,
) {
  const domain = queryClient.getQueryData<DomainInfo>(['domain']);
  if (!domain) throw new Error('No domain set');

  const formBody: string[] = [];
  for (let property in credentials) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(
      credentials[property as keyof Credentials],
    );
    formBody.push(encodedKey + '=' + encodedValue);
  }
  return fetchAllowLocal(queryClient).fetch(
    'POST',
    `${domain.usedDomain}/api/auth/callback/credentials`,
    {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie:
        `next-auth.csrf-token=${credentials.csrfToken};` +
        `next-auth.callback-url=${credentials.callbackUrl};`,
    },
    formBody.join('&'),
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
