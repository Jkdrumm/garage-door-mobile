import RNFetchBlob from 'rn-fetch-blob';

export async function validateSslDomain(domain: string, usedDomain: string) {
  // Getting the domains from the SSL certificate is kinda tricky, so we have to pull some tricks
  // First, send a regular https request to the local domain.
  try {
    console.log(domain, usedDomain);
    await RNFetchBlob.fetch('GET', `${usedDomain}/api/domain`);
  } catch (e: any) {
    console.log('IN DA CATCH');
    console.log(e);
    // The domains are in the error message, so we can extract them from there
    const message: string = e.message;
    const messageParts = message.split('\n').map(part => part.trim());
    console.log(messageParts);
    const domainsString =
      messageParts
        .find(part => part.startsWith('subjectAltNames'))
        ?.split(' ')[1] ?? '[]';
    // Replace all [ with [", all ] with "], and all , with ", "
    const domainsStringFormatted = domainsString
      .replace(/\[/g, '["')
      .replace(/\]/g, '"]')
      .replace(/,/g, '","');
    console.log(domainsStringFormatted);
    const domains = JSON.parse(domainsStringFormatted);
    console.log(typeof domains);
  }
}
