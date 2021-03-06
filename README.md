# Node.js assessment Web API
This project is using the [Pankod MoleculerJS boilerplate](https://pankod.github.io/moleculerjs-boilerplate/), which provides additional tools the [Moleculer JS Microservice framework](https://moleculer.services/).

## Requirements
- `npm`
- `Node` =10.19.0

## Running the API
- Install the dependencies `npm install`
- Start the API `npm run dev`

The API will then be accessible at [http://0.0.0.0:3000](http://0.0.0.0:3000)

## Available endpoints
The following endpoints are available as required by the assessment, a thorough documentation of these endpoints is available in the [Swagger documentation](http://0.0.0.0:3001).

### Authentication
Prefixed with `/auth/`.

| Endpoint | Method | Params | Description |
| --- | --- | --- | --- |
| `/users/login`|`POST`|`name`, `password` | Authenticates the user, returns a JWT |

For the sake of the assessment, the `password` is equals to the `name` of the account, here are 2 users you can use:
- `Britney` (admin)
- `Barnett` (user)

### API
Prefixed with `/api/`, requires a valid JWT (Bearer token) to be attached or will return a `401: Unauthorized` error.

| Endpoint | Method | Description |
| --- | --- | --- |
| `/users/{id}` | `GET` | Get user data by id |
| `/users/name/{name}` | `GET` | Get user data by name |
| `/policies/user/{name}` | `GET` | Get policies linked to a user name (admin only) |
| `/policies/{id}/user` | `GET` | Get user linked to policy number (admin only) |

## Assessment considerations
- This API is acting as a simple gateway to the remote Mocky API.
- An evolution of this API would be to store the data from the remote Mocky API to a local database, and to keep the data in sync on a daily/hourly basis through a cron job.
- Authentication is done through JWTs, I decided to keep this part simple and not implement features such as refresh tokens.
- Authorization is managed though ACLs:
  - `users` can only access their own ressources (`users` routes only).
  - `admin` can access any ressource.
  - ACLs are in plain code, they could be stored in a dedicated database.
- Better maintainability could be achieved through automated testing.
- Licenses have been checked to allow commercial use of this API, here's a summary of the dependencies' licenses:
  - MIT: 346
  - ISC: 41
  - Apache-2.0: 15
  - BSD-3-Clause: 10
  - BSD-2-Clause: 9
  - MIT*: 2
  - BSD: 1
  - (MIT AND Apache-2.0): 1
  - WTFPL: 1
  - (WTFPL OR MIT): 1
  - Apache License, Version 2.0: 1
  - Unlicense: 1

## License

Licensed under the MIT License
