import {QueryClient} from '@tanstack/react-query';
import {fetchAllowLocal} from 'auth';
import {DomainInfo} from 'types';

export function getProviders(queryClient: QueryClient) {
  const domain = queryClient.getQueryData<DomainInfo>(['domain']);
  if (!domain) throw new Error('No domain set');
  return fetchAllowLocal(queryClient).fetch(
    'GET',
    `${domain.usedDomain}/api/auth/providers`,
  );
}

export type ProviderData = {
  credentials: {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
  };
};
