import {QueryClient} from '@tanstack/react-query';
import {fetchIgnoreSsl} from '../fetchIgnoreSsl';

export async function getCsrf(queryClient: QueryClient) {
  const domain = queryClient.getQueryData<string>(['domain']);
  if (!domain) throw new Error('No domain set');
  const res = await fetchIgnoreSsl(queryClient).fetch(
    'GET',
    `${domain}/api/auth/csrf`,
  );
  console.log(res.json().csrfToken);
  return (res.json() as CsrfData).csrfToken;
}

export type CsrfData = {
  csrfToken: string;
};
