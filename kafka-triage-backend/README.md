# Kafka Triage Backend

Triage your failed Kafka messages with this application. View, replay, discard and monitor the
records published on a Dead Letter Topic.

## How does it work?

Kafka triage consumes all records from Dead Letter Topics matching the pattern `.+\.DLT$`. Each
message is saved in the postgres database. The application provides a web interface to view the
messages and perform actions on them.

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

### PostgresQL

The application uses a postgres database to store the messages. The database is started with
docker compose. The database is exposed on port `5432` and the credentials are:

* username: `rootuser`
* password: `rootpass`
* database: `kafka-triage`

After starting the application, check if Flyway applied the migrations (located
in `src/main/resources/db/migration`):

```bash
psql -U rootuser kafka-triage
kafka-triage=# \dt
                 List of relations
 Schema |         Name          | Type  |  Owner
--------+-----------------------+-------+----------
 public | flyway_schema_history | table | rootuser
 public | record                | table | rootuser
(2 rows)
```