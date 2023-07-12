import {QueryClient} from '@tanstack/react-query';
import {fetchAllowLocal} from 'auth';
import {DomainInfo} from 'types';

export function getSession(csrf: string, queryClient: QueryClient) {
  const domain = queryClient.getQueryData<DomainInfo>(['domain']);
  if (!domain) throw new Error('No domain set');
  return fetchAllowLocal(queryClient).fetch(
    'GET',
    `${domain.usedDomain}/api/auth/session`,
    {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: 'next-auth.csrf-token=' + csrf,
    },
  );
}

export type SessionData = {
  user: {
    id: string;
  };
  expires: string;
};
