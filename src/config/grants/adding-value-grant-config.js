import singleScore from '~/src/services/scoring/methods/single-score.js'
import multiScore from '~/src/services/scoring/methods/multi-score.js'
import { ScoreBands } from '../score-bands.js'
import { scoringConfigSchema } from '../scoring-config-schema.js'

const IMPROVE_PROCESSING_AND_SUPPLY_CHAINS =
  'Improve processing and supply chains'
const GROW_YOUR_BUSINESS = 'Grow your business'

/**
 * Scoring configuration data.
 * @type {import("./scoring-types.js").ScoringConfig}
 */
const addingValueGrantConfig = {
  questions: [
    {
      id: '/products-processed',
      category: 'Produce processed',
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
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        GROW_YOUR_BUSINESS
      ],
      scoreMethod: singleScore,
      answers: [
        { answer: 'adding-value-A1', score: 9 },
        { answer: 'adding-value-A2', score: 7 },
        { answer: 'adding-value-A3', score: 5 },
        { answer: 'adding-value-A4', score: 3 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 5 },
        { name: ScoreBands.MEDIUM, minValue: 6, maxValue: 7 },
        { name: ScoreBands.STRONG, minValue: 8, maxValue: 9 }
      ],
      maxScore: 8
    },
    {
      id: '/project-impact',
      category: 'Project impact',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        GROW_YOUR_BUSINESS
      ],
      scoreMethod: multiScore,
      answers: [
        { answer: 'project-impact-A1', score: 7 },
        { answer: 'project-impact-A2', score: 6 },
        { answer: 'project-impact-A3', score: 5 },
        { answer: 'project-impact-A4', score: 4 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 10 },
        { name: ScoreBands.MEDIUM, minValue: 11, maxValue: 16 },
        { name: ScoreBands.STRONG, minValue: 17, maxValue: 22 }
      ],
      maxScore: 22
    },
    {
      id: '/future-customers',
      category: 'Future customers',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        GROW_YOUR_BUSINESS
      ],
      scoreMethod: singleScore,
      answers: [
        { answer: 'future-customers-A1', score: 11 },
        { answer: 'future-customers-A2', score: 9 },
        { answer: 'future-customers-A3', score: 7 },
        { answer: 'future-customers-A4', score: 5 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 6 },
        { name: ScoreBands.MEDIUM, minValue: 7, maxValue: 8 },
        { name: ScoreBands.STRONG, minValue: 9, maxValue: 11 }
      ],
      maxScore: 8
    },
    {
      id: '/collaboration',
      category: 'Future customers',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        'Encourage collaboration and partnerships'
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
    { name: ScoreBands.WEAK, minValue: 0, maxValue: 17 },
    { name: ScoreBands.MEDIUM, minValue: 17, maxValue: 28 },
    { name: ScoreBands.STRONG, minValue: 28, maxValue: 37 }
  ],
  maxScore: 37,
  eligibilityPercentageThreshold: 60
}

const { error, value } = scoringConfigSchema.validate(addingValueGrantConfig)

if (error) {
  throw new Error(`Validation failed: ${error.message}`)
}

export { value as addingValueGrantConfig }
