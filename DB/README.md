# Database Setup

This folder contains the PostgreSQL 16 schema and sample seed data for the Global Recycle project.

## Files

- `schema.sql` - creates the database tables, indexes, extensions, and constraints
- `seed.sql` - inserts sample jurisdictions, rules, pickup schedules, centers, and hours

## Apply Locally

Use any PostgreSQL client, or run:

```bash
psql -d your_database_name -f DB/schema.sql
psql -d your_database_name -f DB/seed.sql
```

If you are starting from a clean local database, run the schema first and then the seed file.

## Notes

- `schema.sql` expects PostgreSQL 17.
- `schema.sql` enables the `pgcrypto` and `postgis` extensions.
- `seed.sql` is wrapped in a transaction, so it will roll back if any insert fails.
