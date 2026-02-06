# Calendly Backend

Lightweight backend for a Calendly-like scheduling app.

## Folder Structure

    ├── app.js
    ├── config
    │   ├── config.js
    │   └── winston.config.js
    ├── connections
    │   └── mongoose.connection.js
    ├── controllers
    │   ├── auth.controller.js
    │   ├── availability.controller.js
    │   ├── google.controller.js
    │   ├── meeting.controller.js
    │   ├── schedule.controller.js
    │   └── user.controller.js
    ├── logs
    │   ├── application-2026-02-06.log
    │   └── error-2026-02-06.log
    ├── middlewares
    │   ├── auth.middleware.js
    │   ├── error.middleware.js
    │   └── googleAuth.middleware.js
    ├── models
    │   ├── availability.js
    │   ├── bookings.js
    │   ├── index.js
    │   ├── meetings.js
    │   ├── schedule.js
    │   └── users.js
    ├── openapi.yaml
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── routes
    │   ├── auth.js
    │   ├── availability.route.js
    │   ├── google.js
    │   ├── health.route.js
    │   ├── index.js
    │   ├── meeting.route.js
    │   ├── public.route.js
    │   ├── schedule.route.js
    │   └── user.route.js
    ├── server.js
    └── utils
        ├── logger.js
        └── validate.js

## Details

- Express API with routes for authentication, user profiles, schedules, availability, meetings, and Google OAuth flows.
- Mongoose models for Users, Schedules, Bookings, Meetings, and Availability.
- An OpenAPI 3.0 spec is placed at `openapi.yaml` in the project root for API documentation.

## start

1. Install dependencies

```bash
npm install
```

2. Configure environment

This project uses a config file under `config/config.js`. You need to set values there (or via environment variables depending on your setup). Important values:

- `jwt.secret` — secret used to sign JWTs
- Google OAuth client/secret and redirect URIs if you use Google integration
- Database connection string for MongoDB

3. Run the server

This project includes a `dev` script that uses `nodemon` to run `server.js`:

```bash
npm run dev
```

By default the server binds to the port configured in your `server.js`/`config`.

## Important endpoints overview

- `POST /auth/register` — register a user
- `POST /auth/login` — login and receive JWT
- `GET /user` — get authenticated user info (Bearer token required)
- `PUT /user/name` — update username (Bearer token required)
- `GET /schedules` — list schedules for authenticated host (Bearer token required)
- `POST /schedules` — create schedule (Bearer token required)
- `GET /schedules/:scheduleId` — get schedule by id (Bearer token required)
- `GET /book/:username/:userId/:schedule_id` — public booking link details
- `GET /availability` — get availability for authenticated user (Bearer token required)
- `PUT /availability` — update availability (Bearer token required)
- `GET /meetings` — get meetings (query param `type=upcoming|past`, Bearer token required)
- `GET /meetings/test` — test endpoint returning all meetings (Bearer token required)
- Google OAuth routes under `/google/*` (login/connect flows)
- Health check: `GET /health`

## Notes about authentication

The project uses a simple Bearer JWT scheme. The middleware expects `Authorization: Bearer <token>`.

## Troubleshooting

- If you get JWT errors, verify `jwt.secret` is set and matches the secret used when signing tokens.
- For Google OAuth flows, ensure redirect URIs registered in Google Console match those in `config/config.js`.
