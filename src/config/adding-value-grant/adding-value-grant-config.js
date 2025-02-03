import singleScore from '~/src/services/scoring/methods/single-score.js'
import multiScore from '~/src/services/scoring/methods/multi-score.js'
import { ScoreBands } from '../score-bands.js'
import { scoringConfigSchema } from '../scoring-config-schema.js'

/**
 * Scoring configuration data.
 * @type {import("./scoring-types.js").ScoringConfig}
 */
const addingValueGrantConfig = {
  questions: [
    {
      id: '/products-processed',
      category: 'Products processed',
      fundingPriorities: [
        'Create and expand processing capacity to provide more English-grown food for consumers to buy'
      ],
      scoreMethod: singleScore,
      answers: [
        { answer: 'products-processed-A1', score: 7 },
        { answer: 'products-processed-A2', score: 6 },
        { answer: 'products-processed-A3', score: 5 },
        { answer: 'products-processed-A4', score: 4 },
        { answer: 'products-processed-A5', score: 3 },
        { answer: 'products-processed-A6', score: 2 },
        { answer: 'products-processed-A7', score: 1 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 2 },
        { name: ScoreBands.MEDIUM, minValue: 3, maxValue: 5 },
        { name: ScoreBands.STRONG, minValue: 6, maxValue: 7 }
      ],
      maxScore: 7
    },
    {
      id: '/adding-value',
      category: 'Adding value',
      fundingPriorities: [
        'Improve processing and supply chains',
        'Grow your business'
      ],
      scoreMethod: singleScore,
      answers: [
        { answer: 'adding-value-A1', score: 8 },
        { answer: 'adding-value-A2', score: 6 },
        { answer: 'adding-value-A3', score: 4 },
        { answer: 'adding-value-A4', score: 2 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 3 },
        { name: ScoreBands.MEDIUM, minValue: 5, maxValue: 6 },
        { name: ScoreBands.STRONG, minValue: 7, maxValue: 8 }
      ],
      maxScore: 8
    },
    {
      id: '/project-impact',
      category: 'Project impact',
      fundingPriorities: [
        'Improve processing and supply chains',
        'Grow your business'
      ],
      scoreMethod: singleScore,
      answers: [
        { answer: 'project-impact-A1', score: 8 },
        { answer: 'project-impact-A2', score: 6 },
        { answer: 'project-impact-A3', score: 4 },
        { answer: 'project-impact-A4', score: 2 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 3 },
        { name: ScoreBands.MEDIUM, minValue: 5, maxValue: 6 },
        { name: ScoreBands.STRONG, minValue: 7, maxValue: 8 }
      ],
      maxScore: 8
    },
    {
      id: '/future-customers',
      category: 'Future customers',
      fundingPriorities: [
        'Improve processing and supply chains',
        'Grow your business'
      ],
      scoreMethod: singleScore,
      answers: [
        { answer: 'future-customers-A1', score: 8 },
        { answer: 'future-customers-A2', score: 6 },
        { answer: 'future-customers-A3', score: 4 },
        { answer: 'future-customers-A4', score: 2 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 3 },
        { name: ScoreBands.MEDIUM, minValue: 5, maxValue: 6 },
        { name: ScoreBands.STRONG, minValue: 7, maxValue: 8 }
      ],
      maxScore: 8
    },
    {
      id: '/collaboration',
      category: 'Future customers',
      fundingPriorities: [
        'Improve processing and supply chains',
        'Grow your business'
      ],
      scoreMethod: singleScore,
      answers: [
        { answer: 'collaboration-A1', score: 4 },
        { answer: 'collaboration-A2', score: 2 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 1 },
        { name: ScoreBands.MEDIUM, minValue: 2, maxValue: 3 },
        { name: ScoreBands.STRONG, minValue: 4, maxValue: 4 }
      ],
      maxScore: 4
    },
    {
      id: '/environmental-impact',
      category: 'Collaboration',
      fundingPriorities: ['Improve the environment'],
      scoreMethod: multiScore,
      answers: [
        { answer: 'environmental-impact-A1', score: 14 },
        { answer: 'environmental-impact-A2', score: 12 },
        { answer: 'environmental-impact-A3', score: 10 },
        { answer: 'environmental-impact-A4', score: 8 },
        { answer: 'environmental-impact-A5', score: 6 },
        { answer: 'environmental-impact-A6', score: 4 },
        { answer: 'environmental-impact-A7', score: 2 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 10 },
        { name: ScoreBands.MEDIUM, minValue: 11, maxValue: 13 },
        { name: ScoreBands.STRONG, minValue: 14, maxValue: 56 }
      ],
      maxScore: 56
    }
  ],
  scoreBand: [
    { name: ScoreBands.WEAK, minValue: 0, maxValue: 51 },
    { name: ScoreBands.MEDIUM, minValue: 52, maxValue: 80 },
    { name: ScoreBands.STRONG, minValue: 81, maxValue: 93 }
  ],
  maxScore: 93,
  eligibilityPercentageThreshold: 60
}

const { error, value } = scoringConfigSchema.validate(addingValueGrantConfig)

if (error) {
  throw new Error(`Validation failed: ${error.message}`)
}

export { value as addingValueGrantConfig }
