/**
 * Get base64 certs from all environment variables starting with TRUSTSTORE_
 * @param {NodeJS.ProcessEnv} envs environment variables
 * @returns {string[]}
 */
function getTrustStoreCerts(envs) {
  return Object.entries(envs)
    .map(([key, value]) => key.startsWith('TRUSTSTORE_') && value)
    .filter(
      /**
       * @param {string } envValue Environment variable
       * @returns {envValue is string} Environment variable
       */
      (envValue) => Boolean(envValue)
    )
    .map((envValue) => Buffer.from(envValue, 'base64').toString().trim())
}

export { getTrustStoreCerts }
