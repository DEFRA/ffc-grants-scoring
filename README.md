# ffc-grants-scoring

Core delivery platform Node.js Backend Template.

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
- [Development helpers](#development-helpers)
- [Docker](#docker)
  - [Development image](#development-image)
  - [Production image](#production-image)
  - [Docker Compose](#docker-compose)
  - [Dependabot](#dependabot)
  - [SonarCloud](#sonarcloud)
- [Postman Collection](#postman-collection)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
  - [Keeping the Collection Updated](#keeping-the-collection-updated)
  - [Example Folder Structure](#example-folder-structure)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v18` and [npm](https://nodejs.org/) `>= v9`. You will find it
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

To test the application run:

```bash
npm run test
```

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

| Endpoint                                        | Description                |
| :---------------------------------------------- | :------------------------- |
| `GET: /health`                                  | Health                     |
| `POST: /scoring/api/v1/{{grantType}}/score    ` | Evaluate Grant Eligibility |

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

- **Add Authorization**:
  If the API requires authentication (e.g., API keys or tokens), configure it under the **Authorization** tab for each request or in the environment variables.

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

### Dependabot

We have added an example dependabot configuration file to the repository. You can enable it by renaming
the [.github/example.dependabot.yml](.github/example.dependabot.yml) to `.github/dependabot.yml`

### SonarCloud

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
