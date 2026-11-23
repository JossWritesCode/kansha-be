# Kansha API

This is the **backend** for Kansha, a workplace recognition app. It's built with Node, Express, Knex and Postgres. Auth0 handles login, and profile pictures are stored in an S3-compatible bucket.

The **[frontend](https://github.com/kansha-rewards/kansha-fe)** talks to this API. The full list of endpoints is in [documentation.md](./documentation.md).

## Run it locally

You need Node 22 and Postgres.

1. **Install:**

   ```sh
   nvm use
   npm install
   ```

2. **Create a database:**

   ```sh
   createdb kansha_dev
   ```

3. **Configure:**

   ```sh
   cp .env.example .env
   ```

   Then fill in `.env`. For local development you only need these:

   | Variable | What to put |
   |---|---|
   | `DATABASE_URL` | `postgres://<your-user>@localhost:5432/kansha_dev` |
   | `CLIENT_ID` | Your Auth0 application's Client ID |
   | `DOMAIN` | `https://<your-tenant>.auth0.com/` (**with** the trailing slash) |
   | `SIGNING_CERT_URL` | `https://<your-tenant>.auth0.com/.well-known/jwks.json` |
   | `FRONTEND_URL` | `http://localhost:3000` |

   Use the **same Auth0 application** as the frontend (see the [frontend's Auth0 setup](https://github.com/kansha-rewards/kansha-fe#set-up-auth0)). Your tenant name is the start of its Domain, e.g. `my-tenant.us.auth0.com`.

   The bucket variables are only needed to upload profile pictures.

4. **Create the tables:**

   ```sh
   npm run migrate
   ```

5. **Start it:**

   ```sh
   npm run server
   ```

   The API runs on http://localhost:8000. Opening it should show `{"message":"API is Running!"}`.

**Optional demo data:** `npx knex seed:run`. This **deletes everything** in the database first.

## Deploy to Railway

No config file is needed. On start, the app runs any new migrations and then starts the server.

1. In your Railway project, add a **Postgres** database and a **Bucket**.
2. Add a service from this GitHub repo.
3. Set these variables on the service:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
   | `DB_ENV` | `production` |
   | `CLIENT_ID` | Auth0 Client ID (same as the frontend's) |
   | `DOMAIN` | `https://<your-tenant>.auth0.com/` (with the trailing slash) |
   | `SIGNING_CERT_URL` | `https://<your-tenant>.auth0.com/.well-known/jwks.json` |
   | `FRONTEND_URL` | The frontend's URL. To allow more than one, separate them with commas. |
   | `PUBLIC_API_URL` | This service's public URL |
   | `BUCKET`, `ENDPOINT`, `REGION`, `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY` | Reference the bucket, e.g. `${{Bucket.BUCKET}}` |

4. Under **Settings → Networking**, generate a public domain and set the healthcheck path to `/`.

## Commands

| Command | What it does |
|---|---|
| `npm run server` | Starts the API and restarts it when files change |
| `npm start` | Runs migrations, then starts the API (used on Railway) |
| `npm run migrate` | Creates or updates the database tables |
| `npm test` | Runs the tests (see below) |

**Tests** need their own database named `kansha_test`:

```sh
createdb kansha_test
TEST_DB_HOST=localhost TEST_DB_USER=$USER npm test
```

## Troubleshooting

Login problems show up as an error from `GET /profile`. In the frontend, it appears in a red banner after login.

| Error | Fix |
|---|---|
| `Token was signed by an unknown key` | `SIGNING_CERT_URL` points at a different Auth0 tenant than the frontend uses. |
| `jwt audience invalid` | `CLIENT_ID` doesn't match the frontend's `REACT_APP_CLIENT_ID`. |
| `jwt issuer invalid` | `DOMAIN` is wrong. Check that it has `https://` and the trailing slash. |
| `Unable to verify credentials` (503) | The API couldn't download Auth0's keys. Check that `SIGNING_CERT_URL` opens in a browser. |
| A CORS error in the browser | Add the frontend's URL to `FRONTEND_URL`. |

On Railway, changing a variable redeploys the service automatically. The service logs show more detail for each error.

## How images work

- **Profile pictures** are uploaded to the private bucket. `GET /images/:key` redirects to a short-lived link to the file.
- **Badges and the default avatar** are files in the frontend's `public/` folder. The database stores their paths (like `/badges/mvp.svg`), so they work on any frontend URL.

## Contributing

Open an issue or a pull request. Use [Conventional Commits](https://www.conventionalcommits.org) for commit messages and PR titles (e.g. `fix(auth): ...`). Please follow the [code of conduct](./code_of_conduct.md).

Licensed under the [MIT License](./LICENSE).
