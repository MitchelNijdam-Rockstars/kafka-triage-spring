# Kafka Triage Backend

Triage your failed Kafka messages with this application. View, replay, discard and monitor the
records published on a Dead Letter ErrorTopic.

## How does it work?

Kafka triage consumes all records from Dead Letter Topics matching the pattern `.+\.DLT$`. Each
message is saved in the postgres database. The application provides a web interface to view the
messages and perform actions on them, like replaying them to the original topic or discarding.

## Running the project

1. Start docker compose
    ```bash
    docker-compose up -d
    ```
2. Start the application
    ```bash
    ./gradlew bootRun
    ```
3. Open the application in your browser: [http://localhost:8080](http://localhost:8080)

## Manual testing

Install the CLI tool [kcat (formerly kafkacat)](https://github.com/edenhill/kcat)

Produce some messages to the topic `test.DLT`:

```bash
kafkacat -b localhost:29092 -t test.DLT -P
```

## PostgresQL

The application uses a postgres database to store the messages. The database is started with
docker compose. The database is exposed on port `5432` and the credentials are:

* username: `rootuser`
* password: `rootpass`
* database: `kafka-triage`

Connect with the database via:

```bash
psql -U rootuser kafka-triage
```

### Flyway & JOOQ

This app uses JOOQ and Flyway for interacting with the database.

* **Flyway** for managing schema evolution
* **JOOQ** for generating SQL queries in a type-safe and dynamic manner

Since JOOQ classes are generated during the gradle build step based on a running database, we need to apply the flyway
migration before it. The following approach is used.

**On local dev environment**
1. Disable Flyway migration in Spring by setting the property `spring.flyway.enabled=false`
2. Start the database
3. Apply the flyway migration scripts manually
4. Run `gradle clean build`

This generates the Java classes, which are committed to Git, so that on production...

**On production environment**
1. Enable flyway migration in Spring by setting the property `spring.flyway.enabled=true`
2. When Spring starts it will apply the Flyway migrations (and fail if it errors)
