# AirBNC

Welcome to my Portfolio project. The aim is to build a booking system with both user and properties functionalities.

This project will be built using **Test-Driven Development (TDD)** methodology to ensure a robust, maintainable codebase, as it also acts as documentation!

**Technologies**

- **Back End**: Node.js
- **Database**: PostgreSQL (SQL)

**Prerequisites**

To run this project locally, please ensure you have installed

- Node.js
- psql

## View

To view this project online, visit https://airbnc-60wa.onrender.com/

## Instructions

First of all we need to install the dependancies, install them with the below command.

```
npm install
```

Next, be sure to create and edit an .env.test file to be able to access the database. Use the below for testing purposes.

```
PGDATABASE=airbnc_test
```

We can create additional .env files such as .env.dev and .env.prod to create the development and production environments. These require the relevant PGDATABASE such as..

```
PGDATABASE=airbnc_dev
```

```
PGDATABASE=airbnc_prod
```

### Create the database

An NPM script has been created to easily create or recreate the database, use the command below.

```
npm run createdbs
```

### Seed the tables

Now it's time to create the tables and insert data, use the command below for your current environment.

```
npm run seed-test
npm run seed-dev
npm run seed-prod
```

### Testing

Multiple Jest tests have been written to ensure that the application is functioning correctly and the responses are as expected. Any new functionality must not break of these tests.

```
npm run test-app
```

Tests have also been provided for the database utilities functions, this can be ran with.

```
npm run test-db
```

### Running the app

The app can be started locally by running the below command in root directory.

```
npm run dev
```

Viewing the application can then be done by visiting localhost:8080 in a browser.

### API Endpoints

| Method | URL                         | Functionality                                   |
| ------ | --------------------------- | ----------------------------------------------- |
| GET    | /api/properties             | Retreives all properties                        |
| GET    | /api/properties/:id         | Retreives a single property based on the :id    |
| GET    | /api/properties/:id/reviews | Retreives reviews for the specified property    |
| POST   | /api/properties/:id/reviews | Created a new review for the specified property |
| GET    | /api/users/:id              | Retrieves the users details                     |
| DELETE | /api/reviews/:id            | Deletes the specified review                    |

### Upcoming features

- Frontend viewing
- Properties (Images)
- Single property (Images)
- Properties by host
- Update user details
- Favourties (add, remove)
- Properties (amenities)
- Single property (amenities)
- Bookings (Retreive, create, adjust, delete)
- Bookings by user
