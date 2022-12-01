# Kafka Triage

Triage your failed Kafka messages with this application. View, replay, discard and monitor the
records published on a Dead Letter ErrorTopic.

![](kt-readme.gif)

## How does it work?

Kafka triage consumes all records from Dead Letter Topics matching the pattern `.+\.DLT$`. Each
message is saved in the postgres database. The application provides a web interface to view the
messages and perform actions on them.

## Running the project

This project consists of 2 modules.

### kafka-triage-backend
The backend application (Kotlin, Java 17, Gradle). See the README in the folder `/kafka-triage-backend` for more information.

Run the application with `local` profile:

```bash
cd kafka-triage-backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

Now you can access the application at http://localhost:8029

### kafka-triage-frontend
The frontend application (Angular 17). See the README in the folder `/kafka-triage-frontend` for more information.


Run using angular cli:

```bash
cd kafka-triage-frontend
npm install
ng serve
```

## YouTrack

Login required. [YouTrack link](https://mnijdam.youtrack.cloud/agiles/131-2/current?tab=general).
