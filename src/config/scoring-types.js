/**
 * @typedef {object} Answer
 * @property {string} answer - The answer text.
 * @property {number|null} score - The score associated with the answer, or null if no score applies.
 */

/**
 * @typedef {object} ScoreBand
 * @property {string} name - The name of the score band (e.g., "Weak", "Medium", "Strong").
 * @property {number|null} value - The value associated with the score band, or null if not applicable.
 */

/**
 * @typedef {object} Question
 * @property {string} id - The unique identifier for the question.
 * @property {Function} scoreMethod - The scoring function to calculate the score for the question.
 * @property {Answer[]} answers - An array of possible answers for the question.
 * @property {number} maxScore - Max score
 * @property {ScoreBand[]} scoreBand - An array of score bands for the question.
 */

/**
 * @typedef {object} ScoringConfig
 * @property {Question[]} questions - An array of questions in the scoring configuration.
 * @property {ScoreBand[]} scoreBand - An array of score bands applicable across the configuration.
 * @property {number} maxScore - Max score of all questions' max scores
 * @property {number} eligibilityPercentageThreshold - The minimum percentage threshold for eligibility.
 */

/**
 * @typedef {object} ScoreResult
 * @property {number} value - The score value
 * @property {string} band - The score band
 */