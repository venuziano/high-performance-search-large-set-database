# High performance search in large database sets

The idea of this repository is to solve a common real use case when users need to search for a specific search term in large database sets.
Let's use the follow example:
* Library admins want to search for books in their library database using book and category names.
* Their database has over 2 million book records, and each book is associated with 10 categories. There are around 20 million book category records for this relation.
* There are around 100 categories in total.

This can be easily extended to other business rules, such as a user searching for customers and their licenses, or searching for specific item names in a store, and so on.

### Prerequirements

```
docker compose
```

### How to Run

Set up an .env file, example:

```
# APP
API_PORT=3010
HOST=host.docker.internal

# DB
DATABASE=test-db
DB_USER=root-user
DB_PASSWORD=root-user
PG_TYPE=postgres
PG_PORT=5432
```

Execute:
```
docker compose up --build -d
```

Observation:
The first initialization may take a few minutes due to the procedure that includes 20 million records in the book categories DB table.

If the migrations don't run automatically, you can execute the following command:
```
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/database/data.source.ts
```

Access Swagger doc using:
```
http://localhost:3010/swagger#/Book/BookController_getAll
```

## Built with

* Nest
* Docker compose
* PostgreSQL

## Author

Rafael Rodrigues
