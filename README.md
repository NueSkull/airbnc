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

## Instructions

First of all we need to install the dependancies, install them with the below command.

```
npm install
```

Next, be sure to create and edit an .env file to be able to access the database. Use the below for testing purposes.

```
PGDATABASE=airbnc_test
```

### Create the database

An NPM script has been created to easily create or recreate the database, use the command below.

```
npm run createdb
```

### Seed the tables

Now it's time to create the tables and insert data, use the command below.

```
npm run seed
```

### Viewing the tables

The tables have been created and populated with data, you can view them directly using `psql` followed by `\c airbnc_test`. Using standard SQL query statements you can view the tables and their details. For example.

```
SELECT * FROM users;
```
