# ffc-grants-scoring

This project isnt currently being maintained. Follows is a list of TODOs to bring it back if we need to:
* Upgrade to the version of node that grants-ui uses
* Upgrade testing and logging to bring in line with grants-ui
* Update service to service auth to match grants-ui
* Ensure that the service is configurable and uses config broker. 


Stateless ancillary scoring API for grants-ui. Accepts grant application answers and returns scores with banding.

- [Requirements](#requirements)
  - [Node.js](#nodejs)
- [Local development](#local-development)
  - [Setup](#setup)
  - [Development](#development)
  - [Testing](#testing)
  - [Production](#production)
  - [Npm scripts](#npm-scripts)
  - [Update dependencies](#update-dependencies)
  - [Formatting](#formatting)
    - [Windows prettier issue](#windows-prettier-issue)
- [API endpoints](#api-endpoints)
- [Docker](#docker)
  - [Development image](#development-image)
  - [Production image](#production-image)
  - [Docker Compose](#docker-compose)
- [Postman Collection](#postman-collection)
- [Snyk](#snyk)
- [Dependabot](#dependabot)
- [SonarCloud](#sonarcloud)
- [Licence](#licence)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v22` and [npm](https://nodejs.org/) `>= v9`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
cd ffc-grants-scoring
nvm use
```

## Local development

### Setup

Install application dependencies:

```bash
npm install
```

### Development

To run the application in `development` mode run:

```bash
npm run dev
```

### Testing

To run all tests (unit and integration) with coverage:

```bash
npm test
```

To run without coverage:

```bash
npm run test:no-cov
```

To run in watch mode during development:

```bash
npm run test:watch
```

#### Test structure

```
src/**/*.test.js          # Unit tests (co-located with source)
test/integration/         # Integration tests (Hapi server.inject)
├── health.test.js
├── scoring.test.js
├── documentation.test.js
├── observability.test.js
└── adding-value/
    ├── scoring.test.js
    ├── single-scoring.test.js
    ├── multi-scoring.test.js
    ├── matrix-scoring.test.js
    └── schema-validation.test.js
```

- **Unit tests** use `jest.mock()` for isolation and are co-located alongside the source files they test.
- **Integration tests** spin up a real Hapi server instance and use `server.inject()` to test HTTP endpoints. The `adding-value` tests validate scoring logic against the real grant configuration with exact score value assertions. The schema validation test checks that API responses conform to the service's own OpenAPI specification.

### Production

To mimic the application running in `production` mode locally run:

```bash
npm start
```

### Npm scripts

All available Npm scripts can be seen in [package.json](./package.json).
To view them in your command line run:

```bash
npm run
```

### Update dependencies

To update dependencies use [npm-check-updates](https://github.com/raineorshine/npm-check-updates):

> The following script is a good start. Check out all the options on
> the [npm-check-updates](https://github.com/raineorshine/npm-check-updates)

```bash
ncu --interactive --format group
```

### Formatting

#### Windows prettier issue

If you are having issues with formatting of line breaks on Windows update your global git config by running:

```bash
git config --global core.autocrlf false
```

## API endpoints

| Endpoint                                  | Description         |
| :---------------------------------------- | :------------------ |
| `GET: /health`                            | Health check        |
| `POST: /scoring/api/v1/{grantType}/score` | Score grant answers |
| `GET: /scoring/api/v1/documentation`      | Swagger UI          |
| `GET: /scoring/api/v1/swagger.json`       | OpenAPI JSON schema |

## Docker

### Development image

Build:

```bash
docker build --target development --no-cache --tag ffc-grants-scoring:development .
```

Run:

```bash
docker run -e PORT=3001 -p 3001:3001 ffc-grants-scoring:development
```

### Production image

Build:

```bash
docker build --no-cache --tag ffc-grants-scoring .
```

Run:

```bash
docker run -e PORT=3001 -p 3001:3001 ffc-grants-scoring
```

### Docker Compose

A local environment with:

- Localstack for AWS services (S3, SQS)
- This service.

```bash
docker compose up --build -d
```

## Postman Collection

The project includes a Postman collection to make it easier to test and interact with the API. This collection contains pre-configured requests for various endpoints and an environment file to manage variables like API URLs.

### Getting Started

1. **Install Postman**
   If you don’t already have Postman installed, download it from [Postman’s official site](https://www.postman.com/).

2. **Import the Collection**
   - Open Postman.
   - Go to **File > Import**.
   - Select the file `postman/ffc-grants-scoring.postman_collection.json`.

3. **Import the Environment (Optional)**
   If the project includes an environment file:
   - Go to **File > Import**.
   - Select the file `postman/ffc-grants-scoring.dev.postman_environment.json`.
   - Update variables like `base_url`, `api_key` or `grant_type` as needed.

4. **Set the Active Environment**
   - In Postman, click on the environment dropdown in the top right corner.
   - Select the imported environment (e.g., `dev`).

### Usage

- **Send Requests**:
  Once imported, you can navigate through the requests in the collection and send them directly to the API.

- **Customize Variables**:
  If using an environment file, adjust variables like `base_url` to match your local or deployed API instance.

### Keeping the Collection Updated

The Postman collection is maintained in the repository under the `/postman/` directory. If the API changes, the collection will be updated accordingly. Pull the latest changes from the repository to ensure you have the most up-to-date collection.

### Example Folder Structure

```

project-root/
├── postman/
│ ├── ffc-grants-scoring.postman_collection.json
│ ├── ffc-grants-scoring.local.postman_environment.json
│ └── ffc-grants-scoring.dev.postman_environment.json

```

## Snyk

Run `snyk auth` to authenticate your local machine with Snyk.

## Dependabot

We have added an example dependabot configuration file to the repository. You can enable it by renaming
the [.github/example.dependabot.yml](.github/example.dependabot.yml) to `.github/dependabot.yml`

## SonarCloud

Instructions for setting up SonarCloud can be found in [sonar-project.properties](./sonar-project.properties)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
