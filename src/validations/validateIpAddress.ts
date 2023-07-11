export function validateIpAddress(string: string) {
  try {
    if (!string || string.length === 0) throw new Error('String is empty');
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(string)) throw new Error('String is not an IP Address');
    const octets = string.split('.');
    if (octets.some(octet => parseInt(octet, 10) > 255))
      throw new Error('Octet is greater than 255');
    return true;
  } catch (error) {
    return false;
  }
}
