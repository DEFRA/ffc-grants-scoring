import { createLogger } from '../common/helpers/logging/logger.js'
import { LogCodes, LogCodeLevels } from './log-codes.js'

const logger = createLogger()

/**
 * @typedef {'info' | 'debug' | 'error' | undefined} LogLevel
 * @typedef {string | undefined} LogEvent
 */

/**
 * Logs an event with the specified level and context.
 * @param {object} options - Logging options.
 * @param {LogLevel} options.level - The log level.
 * @param {LogEvent} options.event - The log event.
 * @param {object} [context] - Additional context for the log.
 * @throws {Error} If log parameters are invalid.
 */
const log = ({ level, event } = {}, context = {}) => {
  validateLogParams({ level, event }, context)

  // Call the appropriate logger function with the provided context
  getLoggerOfType(level)({
    event,
    ...context
  })
}

/**
 * Returns the logger function corresponding to the given log level.
 * @param {LogLevel} type - The log level.
 * @returns {(context: object) => void} Logger function.
 */
const getLoggerOfType = (type) => {
  return {
    info: (context) => logger.info(context),
    debug: (context) => logger.debug(context),
    error: (context) => logger.error(context)
  }[type]
}

/**
 * Validates logging parameters.
 * @param {object} params - The log parameters.
 * @param {LogLevel} params.level - The log level.
 * @param {LogEvent} params.event - The log event.
 * @param {object} context - Additional context.
 * @throws {Error} If parameters are invalid.
 */
const validateLogParams = ({ level, event }, context) => {
  if (level === undefined && event === undefined) {
    throw new Error('Invalid log configuration: Missing or invalid logCode')
  }

  if (!LogCodeLevels.includes(level)) {
    throw new Error('Invalid log configuration: Invalid logCode level')
  }

  const validationErrors = {
    level: !level,
    event: !event,
    context: typeof context !== 'object' || Array.isArray(context)
  }

  const invalidField = Object.keys(validationErrors).find(
    (key) => validationErrors[key]
  )

  if (invalidField) {
    throw new Error(
      `Invalid log configuration: Missing or invalid ${invalidField}`
    )
  }
}

export { log, LogCodes }
