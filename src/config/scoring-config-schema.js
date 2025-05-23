import Joi from 'joi'
import { ScoreBands } from './score-bands.js'

const answersSchema = Joi.array()
  .items(
    Joi.object({
      answer: Joi.string().required(),
      score: Joi.alternatives().try(
        Joi.number().allow(null),
        Joi.object().pattern(Joi.string(), Joi.number().allow(null))
      )
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
      category: Joi.string().required(),
      fundingPriorities: Joi.array().items(Joi.string()).optional(),
      isDependency: Joi.boolean().optional(),
      scoreDependency: Joi.string().optional(),
      scoreMethod: Joi.function().required(),
      answers: Joi.alternatives().conditional('isDependency', {
        is: true,
        then: Joi.optional(),
        otherwise: answersSchema
      }),
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
