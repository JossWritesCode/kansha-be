# Kansha API

Backend for Kansha, an employee recognition app. Built with Node, Express, Knex and Postgres, with Auth0 for login and an S3-compatible bucket for profile pictures.

## Running locally

1. Use Node 22 (`nvm use` reads `.nvmrc`).
2. `npm install`
3. Create a Postgres database, e.g. `createdb kansha_dev`.
4. `cp .env.example .env` and fill it in (at minimum `DATABASE_URL` and the Auth0 values).
5. `npx knex migrate:latest` creates the tables and the built-in badges.
6. `npm run server` starts the API with nodemon on http://localhost:8000.

Optional demo data: `npx knex seed:run`.

### Tests

The tests need a Postgres database named `kansha_test`:

```sh
createdb kansha_test
TEST_DB_HOST=localhost TEST_DB_USER=$USER npm test
```

## Deploying to Railway

The app works with Railway's default builder (Railpack) and needs no config file. `npm start` runs migrations and then starts the server.

1. In a Railway project, add a **Postgres** database and a **Bucket**.
2. Add a service from this GitHub repo.
3. Set these variables on the service:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `DB_ENV` | `production` |
| `CLIENT_ID` | Auth0 application Client ID |
| `DOMAIN` | `https://<tenant>.us.auth0.com/` (trailing slash) |
| `SIGNING_CERT_URL` | `https://<tenant>.us.auth0.com/.well-known/jwks.json` |
| `FRONTEND_URL` | `https://<frontend>.up.railway.app` (comma-separate to add `http://localhost:3000`) |
| `PUBLIC_API_URL` | this service's public URL |
| `BUCKET`, `ENDPOINT`, `REGION`, `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY` | reference the bucket, e.g. `${{Bucket.BUCKET}}` |

4. Under **Settings → Networking**, generate a public domain. Set the healthcheck path to `/`.

Profile pictures are uploaded to the private bucket and served via `GET /images/:key`, which redirects to a short-lived signed URL. Badge art and the default avatar are static files in the frontend's `public/` folder. The database stores them as relative paths (e.g. `/badges/mvp.svg`), so they work on any frontend URL without configuration.

## Endpoints

See [documentation.md](./documentation.md).

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

-   Cck first to see if your issue has already been reported.
-   Cck to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
-   Cate a live example of the problem.
-   Smit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

-   Ensure any install or build dependencies are removed before the end of the layer when doing a build.
-   Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
-   Ensure that your code conforms to our existing code conventions and test coverage.
-   Include the relevant issue number, if applicable.
-   You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/kansha-fe/blob/master/README.md) for details on the fronend of our project.
