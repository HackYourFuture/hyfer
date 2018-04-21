## Hyfer

Hyfer is a Code School platform for students and teachers.

### Installation

## Database

This application requires a MySQL database.

- Create an empty database and a MySQL user with rights to the database.

- Use the command line to load the most recent version of the schema SQL file from the `sql` folder into the database:

    `mysql -u` _user-name_ `-p` _database-name_ `<` _sql-file_

- Next, repeat this command to load the sample data SQL file from the `sql` folder into the database.

- create a `config.js` file in the `server/config` folder, paste the contents of the `config.sample.js` file into it, and modify to reflect your specific database configuration.
you need to Register a new OAuth application in your GitHub developer settings. set the Homepage URL to `http://localhost:3005` and callback URL to `http://localhost:3005/auth/github/callback`.

## Installing dependencies

Install dependencies using:
```bash
npm install
```

## Running tests

You can run tests using:

```bash
npm test
```

## start the app

```bash
npm start
```

# Admin functions

Certain admin tasks require a teacher role. To initially give yourself this role you need to sign-in with GitHUb and then use the my-sql command line or the MySQL Workbench to change your role in the users table from guest to teacher.

