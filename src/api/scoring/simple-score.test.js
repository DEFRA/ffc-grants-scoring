import { simpleScore } from './simple-score.js'

describe('simpleScore function', () => {
  test('returns the correct score for a valid answer', () => {
    const questionScores = [
      {
        answers: [
          { answer: 'Protected cropping', score: 3 },
          { answer: 'Fruit', score: 2 }
        ]
      }
    ]

    const result = simpleScore(questionScores, 'Protected cropping')
    expect(result).toBe(3)
  })

  test('returns 0 for an invalid answer', () => {
    const questionScores = [
      {
        answers: [
          { answer: 'Protected cropping', score: 3 },
          { answer: 'Fruit', score: 2 }
        ]
      }
    ]

    const result = simpleScore(questionScores, 'Nonexistent answer')
    expect(result).toBe(0)
  })

  test('throws an error for invalid questionScores structure', () => {
    expect(() => simpleScore(null, 'Protected cropping')).toThrow(
      'Invalid questionScores structure.'
    )
    expect(() => simpleScore([], 'Protected cropping')).toThrow(
      'Invalid questionScores structure.'
    )
    expect(() =>
      simpleScore([{ answers: null }], 'Protected cropping')
    ).toThrow('Invalid questionScores structure.')
  })
})
