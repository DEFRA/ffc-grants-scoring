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

const { error, value } = scoringConfigSchema.validate(exampleGrantConfig)

if (error) {
  throw new Error(`Validation failed: ${error.message}`)
}

export { value as exampleGrantConfig }
