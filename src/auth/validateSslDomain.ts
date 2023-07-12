import type {QueryClient} from '@tanstack/react-query';
import RNFetchBlob from 'rn-fetch-blob';
import {DomainInfo} from 'types';

export async function validateSslDomain(
  queryClient: QueryClient,
  domain: string,
  usedDomain: string,
) {
  // Getting the domains from the SSL certificate is kinda tricky, so we have to pull some tricks
  // First, send a regular https request to the local domain.
  try {
    await RNFetchBlob.fetch('GET', `${usedDomain}/api/domain`);
  } catch (e: any) {
    // If the error message doesn't start with the expected message, rethrow the error
    const usedDomainWithoutProtocol = usedDomain.replace(/https?:\/\//, '');
    if (
      !e.message.startsWith(
        `Hostname ${usedDomainWithoutProtocol} not verified`,
      )
    )
      throw e;
    // The domains are in the error message, so we can extract them from there
    const message: string = e.message;
    const messageParts = message.split('\n').map(part => part.trim());
    const domainsString =
      messageParts
        .find(part => part.startsWith('subjectAltNames'))
        ?.split(' ')[1] ?? '[]';
    // Replace all [ with [", all ] with "], and all , with ", "
    const domainsStringFormatted = domainsString
      .replace(/\[/g, '["')
      .replace(/\]/g, '"]')
      .replace(/,/g, '","');
    const domains = JSON.parse(domainsStringFormatted);
    if (!domains.includes(domain))
      throw new Error('Domain not in SSL certificate');
    queryClient.setQueryData<DomainInfo>(['domain'], {
      domain,
      usedDomain,
      // We can trust this connection because the domain from the SSL certificate matches the domain we're trying to connect to
      isTrusted: true,
    });
  }
}
