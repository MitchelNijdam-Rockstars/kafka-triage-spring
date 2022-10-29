# Kafka Triage

Triage your failed Kafka messages with this application. View, replay, discard and monitor the
records published on a Dead Letter ErrorTopic.

## How does it work?

Kafka triage consumes all records from Dead Letter Topics matching the pattern `.+\.DLT$`. Each
message is saved in the postgres database. The application provides a web interface to view the
messages and perform actions on them.

## Running the project
This project consists of 2 modules:

* `kafka-triage-backend`: The backend application (Kotlin, Java 17)
* `kafka-triage-frontend`: The frontend application (Angular 17)

