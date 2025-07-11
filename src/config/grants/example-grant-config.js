import singleScore from '~/src/services/scoring/methods/single-score.js'
import multiScore from '~/src/services/scoring/methods/multi-score.js'
import { ScoreBands } from '../score-bands.js'
import { scoringConfigSchema } from '../scoring-config-schema.js'

/**
 * Scoring configuration data.
 * @type {import("./scoring-types.js").ScoringConfig}
 */
const exampleGrantConfig = {
  questions: [
    {
      id: 'singleAnswer',
      category: 'Single answer',
      fundingPriorities: [
        'This question is a single answer question',
        `It's funding priorities are undefined`
      ],
      changeLink: '/single-answer',
      scoreMethod: singleScore,
      answers: [
        { answer: 'A', score: 4 },
        { answer: 'B', score: 8 },
        { answer: 'None of the above', score: null }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 3 },
        { name: ScoreBands.AVERAGE, minValue: 4, maxValue: 7 },
        { name: ScoreBands.STRONG, minValue: 8, maxValue: 8 }
      ],
      maxScore: 8
    },
    {
      id: 'multiAnswer',
      category: 'Multi answer',
      fundingPriorities: [
        'This question is a multi answer question',
        `It's funding priorities are well defined`
      ],
      changeLink: '/multi-answer',
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
        { name: ScoreBands.AVERAGE, minValue: 5, maxValue: 8 },
        { name: ScoreBands.STRONG, minValue: 9, maxValue: 12 }
      ],
      maxScore: 12
    }
  ],
  scoreBand: [
    { name: ScoreBands.WEAK, startPercentage: 0, lessThanPercentage: 20 },
    { name: ScoreBands.AVERAGE, startPercentage: 20, lessThanPercentage: 50 },
    {
      name: ScoreBands.STRONG,
      startPercentage: 50,
      lessThanPercentage: Infinity
    }
  ],
  maxScore: 20
}

const { error, value } = scoringConfigSchema.validate(exampleGrantConfig)

if (error) {
  throw new Error(`Validation failed: ${error.message}`)
}

export { value as exampleGrantConfig }
