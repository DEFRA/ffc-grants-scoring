import { score, simpleScore } from './simple-score.js'

export const handler = (request, h) => {
  // Example usage:
  const scoringData = [
    {
      id: 1,
      answers: [
        { answer: 'Protected cropping', score: 3 },
        { answer: 'Fruit', score: 2 },
        { answer: 'Field-scale crops', score: 1 }
      ]
    }
  ]

  // score(scoringObject)({ question id })({ question answer })({ scoringFunction })
  const result = score(scoringData)(1)('Fruit')(simpleScore) // Expected output: 3

  return h.response({ message: String(result) }).code(200)
}
