import {QueryClient} from '@tanstack/react-query';
import RNFetchBlob from 'rn-fetch-blob';

export function fetchIgnoreSsl(queryClient: QueryClient) {
  const domain = queryClient.getQueryData<string>(['domain']);
  console.log('domain', domain);
  if (!domain) throw new Error('No domain set');
  return RNFetchBlob.config({
    // Only trust the garage.local domain
    trusty: domain === 'https://garage.local',
  });
}
