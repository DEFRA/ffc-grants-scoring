import singleScore from '~/src/services/scoring/methods/single-score.js'
import multiScore from '~/src/services/scoring/methods/multi-score.js'
import matrixScore from '~/src/services/scoring/methods/matrix-score.js'
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
      id: 'produceProcessedRadiosField',
      category: 'Produce processed',
      fundingPriorities: [
        'Create and expand processing capacity to provide more English-grown food for consumers to buy'
      ],
      scoreMethod: matrixScore,
      scoreDependency: 'howAddingValueRadiosField',
      answers: [
        {
          answer: 'produceProcessed-A1',
          score: {
            'howAddingValue-A1': 24,
            'howAddingValue-A2': 18,
            'howAddingValue-A3': 9,
            'howAddingValue-A4': 3
          }
        },
        {
          answer: 'produceProcessed-A2',
          score: {
            'howAddingValue-A1': 30,
            'howAddingValue-A2': 21,
            'howAddingValue-A3': 12,
            'howAddingValue-A4': 3
          }
        },
        {
          answer: 'produceProcessed-A3',
          score: {
            'howAddingValue-A1': 24,
            'howAddingValue-A2': 18,
            'howAddingValue-A3': 9,
            'howAddingValue-A4': 3
          }
        },
        {
          answer: 'produceProcessed-A4',
          score: {
            'howAddingValue-A1': 0,
            'howAddingValue-A2': 0,
            'howAddingValue-A3': 0,
            'howAddingValue-A4': 0
          }
        },
        {
          answer: 'produceProcessed-A5',
          score: {
            'howAddingValue-A1': 15,
            'howAddingValue-A2': 9,
            'howAddingValue-A3': 3,
            'howAddingValue-A4': 0
          }
        },
        {
          answer: 'produceProcessed-A6',
          score: {
            'howAddingValue-A1': 18,
            'howAddingValue-A2': 12,
            'howAddingValue-A3': 6,
            'howAddingValue-A4': 0
          }
        },
        {
          answer: 'produceProcessed-A7',
          score: {
            'howAddingValue-A1': 15,
            'howAddingValue-A2': 9,
            'howAddingValue-A3': 3,
            'howAddingValue-A4': 0
          }
        }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 10 },
        { name: ScoreBands.MEDIUM, minValue: 11, maxValue: 20 },
        { name: ScoreBands.STRONG, minValue: 21, maxValue: 30 }
      ],
      maxScore: 30
    },
    {
      id: 'howAddingValueRadiosField',
      category: 'Adding value',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        GROW_YOUR_BUSINESS
      ],
      scoreMethod: () => undefined,
      isDependency: true,
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 5 },
        { name: ScoreBands.MEDIUM, minValue: 6, maxValue: 7 },
        { name: ScoreBands.STRONG, minValue: 8, maxValue: 9 }
      ],
      maxScore: 8
    },
    {
      id: 'projectImpactCheckboxesField',
      category: 'Project impact',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        GROW_YOUR_BUSINESS
      ],
      scoreMethod: multiScore,
      answers: [
        { answer: 'projectImpact-A1', score: 7 },
        { answer: 'projectImpact-A2', score: 6 },
        { answer: 'projectImpact-A3', score: 5 },
        { answer: 'projectImpact-A4', score: 4 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 10 },
        { name: ScoreBands.MEDIUM, minValue: 11, maxValue: 16 },
        { name: ScoreBands.STRONG, minValue: 17, maxValue: 22 }
      ],
      maxScore: 22
    },
    {
      id: 'futureCustomersRadiosField',
      category: 'Future customers',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        GROW_YOUR_BUSINESS
      ],
      scoreMethod: singleScore,
      answers: [
        { answer: 'futureCustomers-A1', score: 11 },
        { answer: 'futureCustomers-A2', score: 9 },
        { answer: 'futureCustomers-A3', score: 7 },
        { answer: 'futureCustomers-A4', score: 5 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 6 },
        { name: ScoreBands.MEDIUM, minValue: 7, maxValue: 8 },
        { name: ScoreBands.STRONG, minValue: 9, maxValue: 11 }
      ],
      maxScore: 11
    },
    {
      id: 'collaborationRadiosField',
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
      id: 'environmentalImpactCheckboxesField',
      category: 'Collaboration',
      fundingPriorities: ['Improve the environment'],
      scoreMethod: multiScore,
      answers: [
        { answer: 'environmentalImpact-A1', score: 14 },
        { answer: 'environmentalImpact-A2', score: 12 },
        { answer: 'environmentalImpact-A3', score: 10 },
        { answer: 'environmentalImpact-A4', score: 8 },
        { answer: 'environmentalImpact-A5', score: 6 },
        { answer: 'environmentalImpact-A6', score: 4 },
        { answer: 'environmentalImpact-A7', score: 2 }
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
    { name: ScoreBands.WEAK, minValue: 0, maxValue: 50 },
    { name: ScoreBands.MEDIUM, minValue: 51, maxValue: 80 },
    { name: ScoreBands.STRONG, minValue: 81, maxValue: 150 }
  ],
  maxScore: 123,
  eligibilityPercentageThreshold: 60
}

const { error, value } = scoringConfigSchema.validate(addingValueGrantConfig)

if (error) {
  throw new Error(`Validation failed: ${error.message}`)
}

export { value as addingValueGrantConfig }
