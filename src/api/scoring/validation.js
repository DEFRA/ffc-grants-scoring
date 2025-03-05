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
          Joi.array().items(Joi.string(), Joi.number()).unique()
        )
      )
      .required()
      .messages({
        'object.base': '"main" must be an object',
        'any.required': '"main" field is missing inside "data"'
      })
  })
    .label('Data')
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
        '/products-processed': 'products-processed-A1',
        '/adding-value': 'adding-value-A1',
        '/project-impact': 'project-impact-A1',
        '/future-customers': 'future-customers-A1',
        '/collaboration': 'collaboration-A1',
        '/environmental-impact': [
          'environmental-impact-A1',
          'environmental-impact-A2',
          'environmental-impact-A3'
        ]
      }
    }
  })
  .label('Scoring Payload')

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
          .label('Funding Priorities'),
        score: Joi.object({
          value: Joi.number(),
          band: Joi.string()
        }).label('Score')
      }).label('Answer Item')
    )
    .label('Answer Items'),
  score: Joi.number(),
  status: Joi.string(),
  scoreBand: Joi.string()
})
  .label('Scoring Response')
  .example({
    answers: [
      {
        questionId: '/products-processed',
        category: 'Products processed',
        fundingPriorities: [
          'Create and expand processing capacity to provide more English-grown food for consumers to buy'
        ],
        score: {
          value: 7,
          band: 'Strong'
        }
      },
      {
        questionId: '/adding-value',
        category: 'Adding value',
        fundingPriorities,
        score: {
          value: 9,
          band: 'Strong'
        }
      },
      {
        questionId: '/project-impact',
        category: 'Project impact',
        fundingPriorities,
        score: {
          value: 7,
          band: 'Weak'
        }
      },
      {
        questionId: '/future-customers',
        category: 'Future customers',
        fundingPriorities,
        score: {
          value: 11,
          band: 'Strong'
        }
      },
      {
        questionId: '/collaboration',
        category: 'Future customers',
        fundingPriorities,
        score: {
          value: 4,
          band: 'Strong'
        }
      },
      {
        questionId: '/environmental-impact',
        category: 'Collaboration',
        fundingPriorities: ['Improve the environment'],
        score: {
          value: 36,
          band: 'Strong'
        }
      }
    ],
    score: 74,
    status: 'Eligible',
    scoreBand: 'Medium'
  })

export const errorResponseSchema = Joi.object({
  statusCode: Joi.number().required(),
  error: Joi.string().required(),
  message: Joi.string().required()
})
  .label('Error Response')
  .example({
    statusCode: 400,
    error: 'Bad Request',
    message: 'Validation failed: Validation Reason'
  })
