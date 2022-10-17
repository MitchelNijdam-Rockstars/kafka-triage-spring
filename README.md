# Kafka Triage

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

