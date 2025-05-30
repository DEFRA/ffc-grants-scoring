import singleScore from '~/src/services/scoring/methods/single-score.js'
import multiScore from '~/src/services/scoring/methods/multi-score.js'
import matrixScore from '~/src/services/scoring/methods/matrix-score.js'
import { ScoreBands } from '../score-bands.js'
import { scoringConfigSchema } from '../scoring-config-schema.js'

const IMPROVE_PROCESSING_AND_SUPPLY_CHAINS =
  'Improve processing and supply chains'
const ENCOURAGE_COLLABORATION_AND_PARTNERSHIPS =
  'Encourage collaboration and partnerships'
const GROW_YOUR_BUSINESS = 'Grow your business'

/**
 * Scoring configuration data.
 * @type {import("./scoring-types.js").ScoringConfig}
 */
const addingValueGrantConfig = {
  questions: [
    {
      id: 'isProvidingServicesToOtherFarmers',
      changeLink: '/other-farmers',
      scoreMethod: singleScore,
      answers: [
        { answer: 'true', score: 20 },
        { answer: 'false', score: 0 }
      ],
      isScoreOnly: true,
      maxScore: 20
    },
    {
      id: 'isBuildingFruitStorage',
      changeLink: '/fruit-storage',
      scoreMethod: singleScore,
      answers: [
        { answer: 'true', score: 45 },
        { answer: 'false', score: 0 }
      ],
      isScoreOnly: true,
      maxScore: 45
    },
    {
      id: 'processedProduceType',
      changeLink: '/produce-processed',
      category: 'Produce processed',
      fundingPriorities: [
        'Create and expand processing capacity to provide more English-grown food for consumers to buy'
      ],
      scoreMethod: matrixScore,
      scoreDependency: 'valueAdditionMethod',
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
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 11 },
        { name: ScoreBands.AVERAGE, minValue: 12, maxValue: 17 },
        { name: ScoreBands.STRONG, minValue: 18, maxValue: 30 }
      ],
      maxScore: 30
    },
    {
      id: 'valueAdditionMethod',
      changeLink: '/how-adding-value',
      category: 'Adding value',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        GROW_YOUR_BUSINESS
      ],
      scoreMethod: () => undefined,
      isDependency: true
    },
    {
      id: 'impactType',
      changeLink: '/project-impact',
      category: 'Project impact',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        GROW_YOUR_BUSINESS
      ],
      scoreMethod: multiScore,
      answers: [
        { answer: 'projectImpact-A1', score: 6 },
        { answer: 'projectImpact-A2', score: 4 },
        { answer: 'projectImpact-A3', score: 3 },
        { answer: 'projectImpact-A4', score: 2 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 6 },
        { name: ScoreBands.AVERAGE, minValue: 7, maxValue: 10 },
        { name: ScoreBands.STRONG, minValue: 11, maxValue: 15 }
      ],
      maxScore: 15
    },
    {
      id: 'manualLabourEquivalence',
      changeLink: '/manual-labour-amount',
      category: 'Mechanisation',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        GROW_YOUR_BUSINESS
      ],
      scoreMethod: singleScore,
      answers: [
        { answer: 'manualLabourAmount-A1', score: 1.65 },
        { answer: 'manualLabourAmount-A2', score: 3.35 },
        { answer: 'manualLabourAmount-A3', score: 5 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 1.64 },
        { name: ScoreBands.AVERAGE, minValue: 1.65, maxValue: 4.99 },
        { name: ScoreBands.STRONG, minValue: 5, maxValue: 5 }
      ],
      maxScore: 5
    },
    {
      id: 'futureCustomerTypes',
      changeLink: '/future-customers',
      category: 'New customers',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        GROW_YOUR_BUSINESS
      ],
      scoreMethod: multiScore,
      answers: [
        { answer: 'futureCustomers-A1', score: 0 },
        { answer: 'futureCustomers-A2', score: 2 },
        { answer: 'futureCustomers-A3', score: 3 },
        { answer: 'futureCustomers-A4', score: 5 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 2 },
        { name: ScoreBands.AVERAGE, minValue: 3, maxValue: 4 },
        { name: ScoreBands.STRONG, minValue: 5, maxValue: 10 }
      ],
      maxScore: 10
    },
    {
      id: 'collaboration',
      changeLink: '/collaboration',
      category: 'Collaboration',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        ENCOURAGE_COLLABORATION_AND_PARTNERSHIPS
      ],
      scoreMethod: singleScore,
      answers: [
        { answer: 'true', score: 10 },
        { answer: 'false', score: 0 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 9 },
        { name: ScoreBands.AVERAGE, minValue: 9.1, maxValue: 9.9 },
        { name: ScoreBands.STRONG, minValue: 10, maxValue: 10 }
      ],
      maxScore: 10
    },
    {
      id: 'environmentalImpactTypes',
      changeLink: '/environmental-impact',
      category: 'Environmental impact',
      fundingPriorities: [
        IMPROVE_PROCESSING_AND_SUPPLY_CHAINS,
        ENCOURAGE_COLLABORATION_AND_PARTNERSHIPS
      ],
      scoreMethod: multiScore,
      answers: [
        { answer: 'environmentalImpact-A1', score: 9 },
        { answer: 'environmentalImpact-A2', score: 3.3 },
        { answer: 'environmentalImpact-A3', score: 3.3 },
        { answer: 'environmentalImpact-A4', score: 3.3 },
        { answer: 'environmentalImpact-A5', score: 8.1 },
        { answer: 'environmentalImpact-A6', score: 3 }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 6.5 },
        { name: ScoreBands.AVERAGE, minValue: 6.6, maxValue: 12.2 },
        { name: ScoreBands.STRONG, minValue: 12.3, maxValue: 30 }
      ],
      maxScore: 30
    }
  ],
  scoreBand: [
    { name: ScoreBands.WEAK, minValue: 0, maxValue: 19 },
    { name: ScoreBands.AVERAGE, minValue: 20, maxValue: 49 },
    { name: ScoreBands.STRONG, minValue: 50, maxValue: 100 }
  ],
  maxScore: 165
}

const { error, value } = scoringConfigSchema.validate(addingValueGrantConfig)

if (error) {
  throw new Error(`Validation failed: ${error.message}`)
}

export { value as addingValueGrantConfig }
