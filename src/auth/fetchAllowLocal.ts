import RNFetchBlob from 'rn-fetch-blob';
import type {QueryClient} from '@tanstack/react-query';
import type {DomainInfo} from 'types';

export function fetchAllowLocal(queryClient: QueryClient) {
  const domain = queryClient.getQueryData<DomainInfo>(['domain']);
  if (!domain) throw new Error('No domain set');
  return RNFetchBlob.config({
    trusty: domain.isTrusted,
    wifiOnly: domain.isTrusted,
  });
}
