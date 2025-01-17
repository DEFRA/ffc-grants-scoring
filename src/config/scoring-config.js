import singleScore from '../services/scoring/methods/single-score.js'
import multiScore from '../services/scoring/methods/multi-score.js'
import Joi from 'joi'

const ScoreBands = Object.freeze({
  WEAK: 'Weak',
  MEDIUM: 'Medium',
  STRONG: 'Strong'
})

/**
 * Scoring configuration data.
 * @type {import("./scoring-types.js").ScoringConfig}
 */
const scoringConfig = {
  questions: [
    {
      id: 'singleAnswer',
      scoreMethod: singleScore,
      answers: [
        { answer: 'A', score: 4 },
        { answer: 'B', score: 8 },
        { answer: 'None of the above', score: null }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 3 },
        { name: ScoreBands.MEDIUM, minValue: 4, maxValue: 7 },
        { name: ScoreBands.STRONG, minValue: 8, maxValue: 8 }
      ],
      maxScore: 8
    },
    {
      id: 'multiAnswer',
      scoreMethod: multiScore,
      answers: [
        { answer: 'A', score: 4 },
        { answer: 'B', score: 4 },
        { answer: 'C', score: 2 },
        { answer: 'D', score: 2 },
        { answer: 'E', score: 0 },
        { answer: 'None of the above', score: null }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 4 },
        { name: ScoreBands.MEDIUM, minValue: 5, maxValue: 8 },
        { name: ScoreBands.STRONG, minValue: 9, maxValue: 12 }
      ],
      maxScore: 12
    }
  ],
  scoreBand: [
    { name: ScoreBands.WEAK, minValue: 0, maxValue: 8 },
    { name: ScoreBands.MEDIUM, minValue: 9, maxValue: 15 },
    { name: ScoreBands.STRONG, minValue: 16, maxValue: 20 }
  ],
  maxScore: 20,
  eligibilityPercentageThreshold: 60
}

const scoringDataSchema = Joi.object({
  questions: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        scoreMethod: Joi.function().required(),
        answers: Joi.array()
          .items(
            Joi.object({
              answer: Joi.string().required(),
              score: Joi.number().allow(null) // Allow numbers or null
            })
          )
          .required(),
        scoreBand: Joi.array()
          .items(
            Joi.object({
              name: Joi.string()
                .valid(ScoreBands.WEAK, ScoreBands.MEDIUM, ScoreBands.STRONG)
                .required(),
              minValue: Joi.number().required(),
              maxValue: Joi.number().required()
            })
          )
          .required(),
        maxScore: Joi.number().required()
      })
    )
    .required(),
  scoreBand: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .valid(ScoreBands.WEAK, ScoreBands.MEDIUM, ScoreBands.STRONG)
          .required(),
        minValue: Joi.number().required(),
        maxValue: Joi.number().required()
      })
    )
    .required(),
  maxScore: Joi.number().required(),
  eligibilityPercentageThreshold: Joi.number().min(0).max(100).required()
})

const { error, value } = scoringDataSchema.validate(scoringConfig)

if (error) {
  throw new Error(`Validation failed: ${error.message}`)
}

export { value as scoringConfig, ScoreBands }
