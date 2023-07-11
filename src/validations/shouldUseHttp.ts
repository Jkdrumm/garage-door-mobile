export function shouldUseHttp(domain: string) {
  return (
    domain.startsWith('http://') ||
    domain.startsWith('192.168') ||
    domain === '10.0.2.2' ||
    domain === '127.0.0.1' ||
    domain === 'localhost'
  );
}
