import { simpleScore } from './simple-score.js'

describe('simpleScore function', () => {
  const validQuestionScores = [
    {
      answers: [
        { answer: 'Protected cropping', score: 3 },
        { answer: 'Fruit', score: 2 },
        { answer: 'Field-scale crops', score: 1 }
      ]
    }
  ]

  test('returns the correct score for a valid answer', () => {
    expect(simpleScore(validQuestionScores, 'Protected cropping')).toBe(3)
    expect(simpleScore(validQuestionScores, 'Fruit')).toBe(2)
    expect(simpleScore(validQuestionScores, 'Field-scale crops')).toBe(1)
  })

  test('throws an error if questionScores is not an array', () => {
    expect(() => simpleScore(null, 'Protected cropping')).toThrow(
      'questionScores must be a non-empty array'
    )
    expect(() => simpleScore({}, 'Fruit')).toThrow(
      'questionScores must be a non-empty array'
    )
  })

  test('throws an error if questionScores is an empty array', () => {
    expect(() => simpleScore([], 'Protected cropping')).toThrow(
      'questionScores must be a non-empty array'
    )
  })

  test('throws an error if userAnswer is not found in the scoring rules', () => {
    expect(() =>
      simpleScore(validQuestionScores, 'Nonexistent answer')
    ).toThrow('Answer "Nonexistent answer" not found in question scores.')
  })
})
