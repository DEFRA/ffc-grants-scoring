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
        .valid(ScoreBands.WEAK, ScoreBands.AVERAGE, ScoreBands.STRONG)
        .required(),
      minValue: Joi.number().required(),
      maxValue: Joi.number().required()
    })
  )
  .optional()

const totalScoreBandSchema = Joi.array()
  .items(
    Joi.object({
      name: Joi.string()
        .valid(ScoreBands.WEAK, ScoreBands.AVERAGE, ScoreBands.STRONG)
        .required(),
      startPercentage: Joi.number().required(),
      lessThanPercentage: Joi.number().allow(Infinity).required()
    })
  )
  .optional()

const questionsSchema = Joi.array()
  .items(
    Joi.object({
      id: Joi.string().required(),
      changeLink: Joi.string().required(),
      category: Joi.string().optional(),
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
      isScoreOnly: Joi.boolean().optional(),
      maxScore: Joi.number().optional()
    })
  )
  .required()

export const scoringConfigSchema = Joi.object({
  questions: questionsSchema,
  scoreBand: totalScoreBandSchema,
  maxScore: Joi.number().required()
})
