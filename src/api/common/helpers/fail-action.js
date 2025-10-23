import { createLogger } from '~/src/api/common/helpers/logging/logger.js'

const logger = createLogger()

/**
 *
 * @param { import('@hapi/hapi').Request } _request Request object not required for function
 * @param { import('@hapi/hapi').ResponseToolkit } _h Response toolkit object not required for function
 * @param { unknown } error Throw unspecified error
 * @returns { never }
 */
export function failAction(_request, _h, error) {
  const err =
    error instanceof Error
      ? error
      : new Error(typeof error === 'string' && error ? error : 'Unknown error')

  logger.warn(err, err.message)
  throw err
}
