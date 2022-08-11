# AWS Serverless API
### Project structure
```
├── api
│   ├── controllers         # Controllers for endpoints
│   ├── models              # Models for endpoints
├── database
│   ├── serverless.yml      # DynamoDB Cloud Formation file
├── lib                     # Libraries written by us
├── types
│   ├── core.d.ts           # Essential types for the entire project
│   ├── entities.d.ts       # Essential types for database definition
├── utils                   # Partials to compose Cloud Formation files
├── .env                    # Environment variables
├── .eslintrc.yml           # ESlint configuration
├── README.md
├── serverless.yml          # API Gateway Cloud Formation file
└── tsconfig.json           # Typescript configuration override file
```

## Environment file (.env)
```
DEV_API_URL=https://dev.api.com
DEV_AWS_ACCESS_KEY_ID=DEV_AWS_ACCESS_KEY_ID
DEV_AWS_SECRET_ACCESS_KEY=DEV_AWS_SECRET_ACCESS_KEY

PROD_API_URL=https://api.com
PROD_ACCESS_KEY_ID=PROD_ACCESS_KEY_ID
PROD_SECRET_ACCESS_KEY=PROD_SECRET_ACCESS_KEY
```

## Git branches (workflow) - [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
<img src="https://dl7op14h3s9f3.cloudfront.net/gitflow.svg" width="400">