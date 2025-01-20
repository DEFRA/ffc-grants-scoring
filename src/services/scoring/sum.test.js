import { sum } from './sum.js'

describe('sum', () => {
  const questionScores = [
    {
      answers: [
        { answer: 'Protected cropping', score: 3 },
        { answer: 'Fruit', score: 2 },
        { answer: 'Field-scale crops', score: 1 }
      ]
    }
  ]

  test('sums the scores for matching answers', () => {
    const userAnswers = ['Protected cropping', 'Fruit']
    const result = sum(questionScores, userAnswers)
    expect(result).toBe(5) // 3 + 2
  })

  test('returns 0 when no answers match', () => {
    const userAnswers = ['Non-existent answer']
    const result = sum(questionScores, userAnswers)
    expect(result).toBe(0)
  })

  test('returns the score for a single matching answer', () => {
    const userAnswers = ['Field-scale crops']
    const result = sum(questionScores, userAnswers)
    expect(result).toBe(1)
  })

  test('ignores answers that do not exist in questionScores', () => {
    const userAnswers = ['Fruit', 'Non-existent answer']
    const result = sum(questionScores, userAnswers)
    expect(result).toBe(2) // Only 'Fruit' matches
  })

  test('returns 0 when questionScores is empty', () => {
    const emptyQuestionScores = []
    const userAnswers = ['Protected cropping']
    expect(() => sum(emptyQuestionScores, userAnswers)).toThrow(
      /Invalid questionScores: must be a non-empty array./
    )
  })

  test('throws an error if questionScores format is invalid', () => {
    const invalidQuestionScores = [{}] // Missing 'answers' property
    const userAnswers = ['Protected cropping']
    expect(() => sum(invalidQuestionScores, userAnswers)).toThrow(
      /Invalid questionScores format: answers must be an array./
    )
  })
})
