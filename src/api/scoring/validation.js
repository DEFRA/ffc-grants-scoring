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
        isProvidingServicesToOtherFarmers: 'true',
        isBuildingFruitStorage: 'true',
        processedProduceType: 'produceProcessed-A1',
        valueAdditionMethod: 'howAddingValue-A1',
        impactType: ['projectImpact-A1', 'projectImpact-A2'],
        manualLabourEquivalence: 'manualLabourAmount-A1',
        futureCustomerTypes: 'futureCustomers-A1',
        collaboration: 'true',
        environmentalImpactTypes: [
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
        changeLink: Joi.string(),
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
        questionId: 'processedProduceType',
        changeLink: '/produce-processed',
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
        questionId: 'valueAdditionMethod',
        changeLink: '/how-adding-value',
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
        questionId: 'impactType',
        changeLink: '/project-impact',
        category: 'Project impact',
        fundingPriorities: [
          'Improve processing and supply chains',
          'Grow your business'
        ],
        score: {
          value: 13,
          band: 'Average'
        }
      },
      {
        questionId: 'manualLabourEquivalence',
        changeLink: '/manual-labour-amount',
        category: 'Mechanisation',
        fundingPriorities: [
          'Improve processing and supply chains',
          'Grow your business'
        ],
        score: {
          value: 1.65,
          band: 'Average'
        }
      },
      {
        questionId: 'futureCustomerTypes',
        changeLink: '/future-customers',
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
        questionId: 'collaboration',
        changeLink: '/collaboration',
        category: 'Collaboration',
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
        questionId: '/environmental-impact',
        category: 'Environmental impact',
        fundingPriorities: ['Improve the environment'],
        score: {
          value: 26,
          band: 'Strong'
        }
      }
    ],
    score: 102,
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
