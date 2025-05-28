/**
 * @typedef {object} Answer
 * @property {string} answer - The answer text.
 * @property {number|null|Record<string, number>} score - The score associated with the answer, or null if no score applies.
 */

/**
 * @typedef {object} ScoreBand
 * @property {string} name - The name of the score band (e.g., "Weak", "Medium", "Strong").
 * @property {number|null} value - The value associated with the score band, or null if not applicable.
 */

/**
 * @typedef {object} Question
 * @property {string} id - The unique identifier for the question.
 * @property {string} category - The category of the question.
 * @property {string[]} fundingPriorities - An optional array of funding priorities related to the question.
 * @property {Function} scoreMethod - The scoring function to calculate the score for the question.
 * @property {string|undefined} scoreDependency - The ID of the question that the score depends on.
 * @property {boolean|undefined} isDependent - A flag indicating if the question is dependent on another question.
 * @property {Answer[]|undefined} answers - An array of possible answers for the question.
 * @property {boolean} isScoreOnly - A flag indicating if the question is only for scoring purposes and will not be included in final answers.
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
