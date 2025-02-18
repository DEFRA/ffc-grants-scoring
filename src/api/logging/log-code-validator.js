import Joi from 'joi'
import { isStrictObject } from '../../utils/isStrictObject.js'

class LogLevel {
  static info = new LogLevel('info')
  static error = new LogLevel('error')
  static debug = new LogLevel('debug')

  constructor(name) {
    this.name = name
  }
}

export const validateLogCode = (logCode, messageOptions = null) => {
  if (!isStrictObject(logCode, true)) {
    throw new Error('logCode must be a non-empty object')
  }

  const { error } = Joi.object({
    level: Joi.string().valid(...Object.keys(LogLevel)),
    messageFunc: Joi.function()
  }).validate(logCode)

  if (error) throw new Error(error.message)

  validateInterpolation(logCode, messageOptions)
}

function validateInterpolation(logCode, messageOptions) {
  const funcString = logCode.messageFunc.toString()
  const isInterpolatedString =
    /\.concat/.test(funcString) || /\${messageOptions/.test(funcString)

  if (!isInterpolatedString && messageOptions)
    throw new Error(
      'If you have message options you must have an interpolated string'
    )

  if (isInterpolatedString) {
    if (!messageOptions) {
      throw new Error(
        'If you have interpolated string values you must have message options'
      )
    }

    const messageOptionsKeys = getKeys(messageOptions)
    const interpolatedKeys = getInterpolations(funcString)

    if (
      !interpolatedKeys.every((value) => messageOptionsKeys.includes(value))
    ) {
      throw new Error('String interpolation values must match messageOptions')
    }
  }

  return true
}

const getKeys = (obj, prefix = '') => {
  return Object.entries(obj).flatMap(([key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key

    return typeof value !== 'object'
      ? [`messageOptions.${newKey}`]
      : getKeys(value, newKey)
  })
}

const getInterpolations = (str) => {
  const regexConcat = /\.concat\(([^)]+)\)/g
  const regexMessageOptions = /\$\{messageOptions((?:\.\w+)+)\}/g

  const concatMatches = [...str.matchAll(regexConcat)]
  const messageOptionsMatches = [...str.matchAll(regexMessageOptions)]

  const extractedConcat = concatMatches.flatMap((match) =>
    [...match[1].matchAll(/messageOptions((?:\.\w+)+)/g)].map(
      (m) => `messageOptions${m[1]}`
    )
  )

  const extractedTemplate = messageOptionsMatches.map(
    // istanbul ignore next
    (match) => `messageOptions${match[1]}`
  )

  return [...extractedConcat, ...extractedTemplate]
}
