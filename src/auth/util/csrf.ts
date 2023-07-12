import {QueryClient} from '@tanstack/react-query';
import {fetchAllowLocal} from '../fetchAllowLocal';
import {DomainInfo} from 'types';

export async function getCsrf(queryClient: QueryClient) {
  const domain = queryClient.getQueryData<DomainInfo>(['domain']);
  console.log('domain', domain);
  if (!domain) throw new Error('No domain set');
  const res = await fetchAllowLocal(queryClient).fetch(
    'GET',
    `${domain.usedDomain}/api/auth/csrf`,
  );
  return (res.json() as CsrfData).csrfToken;
}

export type CsrfData = {
  csrfToken: string;
};
