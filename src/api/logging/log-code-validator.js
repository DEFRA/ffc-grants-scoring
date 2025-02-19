import Joi from 'joi'
import { isStrictObject } from '../../utils/isStrictObject.js'

class LogLevel {
  static info = new LogLevel('info')
  static error = new LogLevel('error')
  static debug = new LogLevel('debug')

  constructor(name) {
    this.name = name
  }

  static getKeys() {
    return Object.keys(LogLevel)
  }
}

export const validateLogCode = (logCode, messageOptions = null) => {
  if (!isStrictObject(logCode, true)) {
    throw new Error('logCode must be a non-empty object')
  }

  const { error } = Joi.object({
    level: Joi.string().valid(...LogLevel.getKeys()),
    messageFunc: Joi.function()
  }).validate(logCode)

  if (error) {
    throw new Error(error.message)
  }

  validateInterpolation(logCode, messageOptions)
}

function validateInterpolation(logCode, messageOptions) {
  const funcString = logCode.messageFunc.toString()
  const isInterpolatedString =
    /\.concat/.test(funcString) || /\${messageOptions/.test(funcString)

  if (!isInterpolatedString && messageOptions) {
    throw new Error(
      'If you have message options you must have an interpolated string'
    )
  }

  if (isInterpolatedString && !messageOptions) {
    throw new Error(
      'If you have interpolated string values you must have message options'
    )
  }

  return true
}
