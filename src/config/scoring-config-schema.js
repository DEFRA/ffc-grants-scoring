import Joi from 'joi'
import { ScoreBands } from './score-bands.js'

const answersSchema = Joi.array()
  .items(
    Joi.object({
      answer: Joi.string().required(),
      score: Joi.number().allow(null) // Allow numbers or null
    })
  )
  .required()

const scoreBandSchema = Joi.array()
  .items(
    Joi.object({
      name: Joi.string()
        .valid(ScoreBands.WEAK, ScoreBands.MEDIUM, ScoreBands.STRONG)
        .required(),
      minValue: Joi.number().required(),
      maxValue: Joi.number().required()
    })
  )
  .required()

const questionsSchema = Joi.array()
  .items(
    Joi.object({
      id: Joi.string().required(),
      scoreMethod: Joi.function().required(),
      answers: answersSchema,
      scoreBand: scoreBandSchema,
      maxScore: Joi.number().required()
    })
  )
  .required()

export const scoringConfigSchema = Joi.object({
  questions: questionsSchema,
  scoreBand: scoreBandSchema,
  maxScore: Joi.number().required(),
  eligibilityPercentageThreshold: Joi.number().min(0).max(100).required()
})
