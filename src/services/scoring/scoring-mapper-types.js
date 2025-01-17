/**
 * @typedef {object} FormattedScoringResponse
 * @property {Array<RawScore>} answers - The array of raw scoring results.
 * @property {number} score - The total score.
 * @property {'eligible' | 'ineligible'} status - The eligibility status based on the score.
 * @property {string | null} scoreBand - The name of the score band.
 */

/**
 * @typedef {object} RawScore
 * @property {string} questionId - The ID of the question.
 * @property {object} score - The score details for the question.
 * @property {number} score.value - The numerical score.
 * @property {string} score.band - The band associated with the score.
 */
