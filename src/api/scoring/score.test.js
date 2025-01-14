import { score } from './score.js'

describe('score function', () => {
  const scoringFn = score([
    {
      id: 'q1',
      answers: [
        { answer: 'Protected cropping', score: 3 },
        { answer: 'Fruit', score: 2 },
        { answer: 'Field-scale crops', score: 1 }
      ]
    },
    {
      id: 'q2',
      answers: [
        { answer: 'Option A', score: 4 },
        { answer: 'Option B', score: 5 }
      ]
    }
  ])

  test('returns a function when question IDs are provided', () => {
    const questionFn = scoringFn('q1')
    expect(typeof questionFn).toBe('function')
  })

  test('returns a function when answer is provided', () => {
    const answerFn = scoringFn('q1')('Protected cropping')
    expect(typeof answerFn).toBe('function')
  })

  test('applies the predicate to the question data and answer', () => {
    const result = scoringFn('q1')('Protected cropping')(
      (questions, answer) => {
        return questions[0].answers.find((a) => a.answer === answer).score
      }
    )

    expect(result).toBe(3) // 'Protected cropping' has a score of 3
  })

  test('throws an error if question ID is not found', () => {
    expect(() => scoringFn('q999')).toThrow(
      'Question with id q999 not found in scoringData.'
    )
  })
})
