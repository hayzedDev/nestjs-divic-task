# NestJS Backend Test Task

This project is a **NestJS** application that uses **Prisma** as the ORM, **PostgreSQL** as the database, and **GraphQL** as the API communication layer.

The App has 4 mutations (register, login, biometricLogin and addBiometric) and a query (health).

1. The "register" mutation is the implementation of a GraphQL mutation for user registration

2. The "login" mutation is the implementation of a GraphQL mutation for user login using email and password

3. The "biometricLogin" mutation is the implementation of a GraphQL mutation for user login using biometric

4. The "addBiometric" mutation is the implementation of a protected GraphQL mutation for user to add biometric as a way for them to login

5. The "health" query is the implementation of a GraphQL query to check the health status of the app

## Getting Started

### 1. Clone the Repository

First, clone the repository, and cd into the root of the app:

```bash
git clone https://github.com/hayzedDev/nestjs-divic-task.git
cd nestjs-divic-task
```

### 2. Prerequisites

Ensure that you have **Docker** and **Docker Compose** installed on your machine. You can click on the urls below on how to install both.

- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

---

## Running the Application

### Stage 1: Initialize the Database

Before you begin,

1. **Create a .env File:**

   Create a `.env` file and populate it with the environment variables specified in the `.env.example` file:

   ```bash
   touch .env
   ```
   Copy the variables from `.env.example` to `.env` and modify them according to your configuration.



To initialize the PostgreSQL database using Docker Compose, run:

```bash
docker compose up --build postgres -d
```

This command builds and runs the PostgreSQL container in detached mode. Make sure the database service is running before proceeding.

### Stage 2: Running the App

You can either run the app using **Docker Compose** or **Yarn**. Below are the steps for running the app with Yarn.

#### Running with Yarn

1. **Install Dependencies:**

   Run the following command to install all required dependencies:

   ```bash
   yarn install --frozen-lockfile --include=dev
   ```

   - `--frozen-lockfile`: Ensures that Yarn uses the exact dependency versions specified in the `yarn.lock` file without updating or generating a new one.
   - `--include=dev`: Ensures that development dependencies are installed alongside the production dependencies.

2. **Build the Application:**

   After installing the dependencies, build the app:

   ```bash
   yarn run build
   ```

3. **Run Tests:**

   After building the application, you can run tests to ensure everything works as expected:

   ```bash
   yarn run test
   ```

4. **Start the App:**

   To start the application, run:

   ```bash
   yarn run start:prod
   ```

   The `yarn run start:prod` command essentially runs two key steps:

   - **Migrate and Generate Prisma Client:**

     ```bash
     yarn run migration
     ```

     This is a shortcut for running the following Prisma commands:

     ```bash
     npx prisma generate && npx prisma migrate dev --name db-migration
     ```

     - `npx prisma generate`: Generates the Prisma Client that allows you to interact with the database.
     - `npx prisma migrate dev --name db-migration`: Applies any pending database migrations, creating the necessary schema in the PostgreSQL database.

   - **Start the App:**

     ```bash
     node dist/src/main
     ```

     This starts the app and binds it to the port specified by the `APP_PORT` variable in the `.env` file.
     You can now access the local GraphQL playground at: `http://localhost:${APP_PORT}/graphql`

#### Running the app as a container

1. **Building the Image and Running the container:**

   To run the App as a container, run the following command

   ```bash
   yarn run start:prod:container
   ```

   The container would start listening to request on host port 6000 (as specified in the compose file)

1. **Accessing the logs:**

   To Access the container logs, run the command

   ```bash
   docker logs -f nestjs-divic-app
   ```

---

## Important Notes on Environment Variables

- **Running the app as a container:**

  If you decide to run the app as a container (e.g., using Docker Compose), ensure the following in your `.env` file:

  - `POSTGRES_HOST=postgres`: The value must be `postgres` since this is the service name defined in your Docker Compose file.
  - `POSTGRES_PORT=5432`: The port should be set to `5432` because it’s the internal port used by the PostgreSQL container.

  **Reason:** Inside the Docker network, services communicate using their container names. The `postgres` service is accessible within the Docker network using the name `postgres` and the default PostgreSQL port `5432`.

- **Running the app with Yarn (locally):**

  If you choose to run the app locally using Yarn, configure the following in your `.env` file:

  - `POSTGRES_HOST=localhost`: This points to your local machine where the PostgreSQL instance is running.
  - `POSTGRES_PORT=5434`: Use port `5434` because it's the port mapped to your local machine from the PostgreSQL container.

  **Reason:** When running the app locally, you need to use `localhost` as the host for accessing PostgreSQL on your machine, and port `5434` since Docker maps the PostgreSQL container's port `5432` to `5434` on your local machine.

---

## Accessing the Application

Alternatively, the app is running live, and you can access the **GraphQL Playground** at:

```
https://nestjs-divic-task.mooo.com/graphql
```

Use this URL to interact with the GraphQL API, send queries, and test the endpoints.

---

## Conclusion

This documentation provides a step-by-step guide for setting up and running the project locally using Docker and Yarn.
