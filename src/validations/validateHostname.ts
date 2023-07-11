/**
 * A function to validate hostnames.
 * Works when starting with http:// or https://
 * @param string The string to validate
 */
export function validateHostname(string: string) {
  try {
    if (!string || string.length === 0) throw new Error('String is empty');
    // Validate both http and https, but allow for no protocol
    const hostnameRegex =
      /^(http:\/\/|https:\/\/)?[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/;
    if (!hostnameRegex.test(string))
      throw new Error('String is not a hostname');
    return true;
  } catch (error) {
    return false;
  }
}
