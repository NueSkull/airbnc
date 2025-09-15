# AirBNC

Welcome to my Portfolio project. The aim is to build a booking system with both user and properties functionalities.

This project will be built using **Test-Driven Development (TDD)** methodology to ensure a robust, maintainable codebase, as it also acts as documentation!

**Technologies**

- **Front End**: HTML, CSS, JavaScript (Node.js)
- **Back End**: Node.js
- **Database**: PostgreSQL (SQL)

**Prerequisites**

To run this project locally, please ensure you have installed

- Node.js
- psql

## Instructions

### Executing Scripts

To execute SQL scripts use 'psql -f' followed by the location of the SQL script from the root directory.
For example, to create the database run the code below.

```
psql -f db/create-database.sql
```

### Database Connection

Be sure to create and edit an .env file to be able to access the database. Use the below for testing purposes.

```
PGDATABASE=airbnc_test

```
