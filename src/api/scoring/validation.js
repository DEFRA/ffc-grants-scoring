import Joi from 'joi'

export const paramsSchema = Joi.object({
  grantType: Joi.string()
    .default('adding-value')
    .example('adding-value')
    .required()
    .description('Grant type for the scoring endpoint')
})

export const scoringQueryParamsSchema = Joi.object({
  allowPartialScoring: Joi.boolean().default(false)
})

export const scoringPayloadSchema = Joi.object({
  meta: Joi.any(),
  data: Joi.object({
    files: Joi.object().strip(), // Allows and strips the field
    repeaters: Joi.object().strip(), // Allows and strips the field
    main: Joi.object()
      .pattern(
        Joi.string(),
        Joi.alternatives().try(
          Joi.string(),
          Joi.number(),
          Joi.boolean(),
          Joi.array()
            .min(1)
            .items(Joi.string(), Joi.number(), Joi.boolean())
            .unique()
        )
      )
      .required()
      .messages({
        'object.base': '"main" must be an object',
        'any.required': '"main" field is missing inside "data"'
      })
  })
    .label('data')
    .required()
    .messages({
      'object.base': '"data" must be an object when using this format',
      'any.required':
        'Expected an object with "data", but received something else'
    })
})
  .example({
    data: {
      main: {
        produceProcessedRadiosField: 'produceProcessed-A1',
        howAddingValueRadiosField: 'howAddingValue-A1',
        projectImpactCheckboxesField: ['projectImpact-A1', 'projectImpact-A2'],
        futureCustomersRadiosField: 'futureCustomers-A1',
        collaborationRadiosField: 'collaboration-A1',
        environmentalImpactCheckboxesField: [
          'environmentalImpact-A1',
          'environmentalImpact-A2'
        ]
      }
    }
  })
  .label('scoring-payload')

const fundingPriorities = [
  'Improve processing and supply chains',
  'Grow your business'
]

export const scoringResponseSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string(),
        category: Joi.string(),
        fundingPriorities: Joi.array()
          .items(Joi.string())
          .label('funding-priorities'),
        score: Joi.object({
          value: Joi.number(),
          band: Joi.string()
        }).label('score')
      }).label('scored-answer')
    )
    .label('scored-answers'),
  score: Joi.number(),
  status: Joi.string(),
  scoreBand: Joi.string()
})
  .label('scoring-response')
  .example({
    answers: [
      {
        questionId: 'produceProcessedRadiosField',
        category: 'Produce processed',
        fundingPriorities: [
          'Create and expand processing capacity to provide more English-grown food for consumers to buy'
        ],
        score: {
          value: 24,
          band: 'Strong'
        }
      },
      {
        questionId: 'howAddingValueRadiosField',
        category: 'Adding value',
        fundingPriorities: [
          'Improve processing and supply chains',
          'Grow your business'
        ],
        score: {
          value: 24,
          band: 'Strong'
        }
      },
      {
        questionId: 'projectImpactCheckboxesField',
        category: 'Project impact',
        fundingPriorities: [
          'Improve processing and supply chains',
          'Grow your business'
        ],
        score: {
          value: 13,
          band: 'Medium'
        }
      },
      {
        questionId: 'futureCustomersRadiosField',
        category: 'Future customers',
        fundingPriorities: [
          'Improve processing and supply chains',
          'Grow your business'
        ],
        score: {
          value: 11,
          band: 'Strong'
        }
      },
      {
        questionId: 'collaborationRadiosField',
        category: 'Future customers',
        fundingPriorities: [
          'Improve processing and supply chains',
          'Encourage collaboration and partnerships'
        ],
        score: {
          value: 4,
          band: 'Strong'
        }
      },
      {
        questionId: 'environmentalImpactCheckboxesField',
        category: 'Collaboration',
        fundingPriorities: ['Improve the environment'],
        score: {
          value: 26,
          band: 'Strong'
        }
      }
    ],
    score: 102,
    status: 'Eligible',
    scoreBand: 'Strong'
  })

export const errorResponseSchema = Joi.object({
  statusCode: Joi.number().required(),
  error: Joi.string().required(),
  message: Joi.string().required()
})
  .label('error-response')
  .example({
    statusCode: 400,
    error: 'Bad Request',
    message: 'Validation failed: Validation Reason'
  })
