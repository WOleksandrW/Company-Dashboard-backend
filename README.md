# Company-Dashboard-backend

Planned technologies:
- TypeScript
- Nest.js
- JWT (Passport)
- PostgreSQL
- Swagger API (documentation)
- Docker

## Database Migrations with TypeORM

### Create a New Migration

Use this command to create a blank migration file. Replace <MigrationName> with the name for your migration.

```bash
npm run migration:create src/migrations/<MigrationName>
```

### Generate a Migration Based on Entity Changes

Use this command to automatically generate a new migration file based on changes in your entities. Replace <MigrationName> with a descriptive name for the migration.

```bash
npm run migration:generate src/migrations/<MigrationName>
```

### Run Migrations

To apply all pending migrations to the database, use this command:

```bash
npm run migration:run
```

### Revert Migrations

To roll back the last migration, use this command:

```bash
npm run migration:revert
```
