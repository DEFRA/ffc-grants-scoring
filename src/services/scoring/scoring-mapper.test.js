import mapToFinalResult from './scoring-mapper.js'
import singleScore from './methods/single-score.js'
import multiScore from './methods/multi-score.js'
import { ScoreBands } from '../../config/score-bands.js'

describe('mapToFinalResult', () => {
  const scoringConfig = {
    questions: [
      {
        id: 'q1',
        scoreMethod: singleScore,
        answers: [
          { answer: 'Protected cropping', score: 3 },
          { answer: 'Fruit', score: 2 },
          { answer: 'Field-scale crops', score: 1 }
        ],
        scoreBand: [
          { name: ScoreBands.WEAK, minValue: 0, maxValue: 1 },
          { name: ScoreBands.MEDIUM, minValue: 1, maxValue: 2 },
          { name: ScoreBands.STRONG, minValue: 3, maxValue: 3 }
        ],
        maxScore: 3
      },
      {
        id: 'q2',
        scoreMethod: multiScore,
        answers: [
          { answer: 'answer 1', score: 2 },
          { answer: 'answer 2', score: 4 },
          { answer: 'answer 3', score: 6 }
        ],
        scoreBand: [
          { name: ScoreBands.WEAK, minValue: 0, maxValue: 5 },
          { name: ScoreBands.MEDIUM, minValue: 6, maxValue: 9 },
          { name: ScoreBands.STRONG, minValue: 10, maxValue: 12 }
        ],
        maxScore: 12
      }
    ],
    maxScore: 15,
    scoreBand: [
      { name: ScoreBands.WEAK, minValue: 0, maxValue: 5 },
      { name: ScoreBands.MEDIUM, minValue: 6, maxValue: 10 },
      { name: ScoreBands.STRONG, minValue: 11, maxValue: 15 }
    ],
    eligibilityPercentageThreshold: 80
  }

  it('should return a properly formatted result with score, status, and band', () => {
    const rawScores = [
      { questionId: 'q1', score: { value: 2, band: ScoreBands.MEDIUM } },
      { questionId: 'q2', score: { value: 2, band: ScoreBands.WEAK } }
    ]
    const expectedResult = {
      answers: rawScores,
      score: 4,
      status: 'ineligible',
      scoreBand: ScoreBands.WEAK
    }

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result).toEqual(expectedResult)
  })

  it('should calculate the percentage correctly and return "eligible" if the score is above the threshold', () => {
    const rawScores = [
      { questionId: 'q1', score: { value: 3, band: ScoreBands.STRONG } },
      { questionId: 'q2', score: { value: 11, band: ScoreBands.STRONG } }
    ]

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result.status).toBe('eligible')
    expect(result.score).toBe(14)
  })

  it('should handle empty rawScores array', () => {
    const rawScores = []

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result.score).toBe(0)
    expect(result.status).toBe('ineligible')
  })

  it('should handle cases where max score is zero', () => {
    // Simulating a scenario where scoringData has no answers with valid scores
    const scoringConfig = {
      questions: [
        { id: 'q1', answers: [{ answer: 'No Score', score: 0 }] },
        { id: 'q2', answers: [{ answer: 'No Score', score: 0 }] }
      ],
      scoreBand: [
        { name: ScoreBands.WEAK, minValue: 0, maxValue: 0 },
        { name: ScoreBands.MEDIUM, minValue: 0, maxValue: 0 },
        { name: ScoreBands.STRONG, minValue: 0, maxValue: 0 }
      ],
      maxScore: 0,
      percentageThreshold: 80
    }

    const rawScores = [
      { questionId: 'q1', score: { value: 0, band: ScoreBands.WEAK } },
      { questionId: 'q2', score: { value: 0, band: ScoreBands.WEAK } }
    ]

    const result = mapToFinalResult(scoringConfig, rawScores)

    expect(result.score).toBe(0)
    expect(result.status).toBe('ineligible')
  })

  it('should throw an error if rawScores is not an array', () => {
    expect(() => {
      mapToFinalResult(null, {})
    }).toThrow('rawScores must be an array')

    expect(() => {
      mapToFinalResult('invalid', {})
    }).toThrow('rawScores must be an array')
  })
})