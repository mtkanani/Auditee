# Database migrations

`npm start` runs `prisma migrate deploy`, which applies any migration in `prisma/migrations`
that the database hasn't seen yet. It never drops or resets anything on its own.

## Changing the schema

1. Edit `schema.prisma`.
2. `npx prisma migrate dev --name <what_changed>` against your **local** database. This writes a new
   folder in `prisma/migrations`.
3. Commit the migration folder with the schema change. It is applied on the next deploy.

Don't use `prisma db push` on a shared database: it changes tables without recording a migration.

## One-time step for the existing production database

Production was built with `db push`, so it already has every table but no migration history.
`migrate deploy` refuses a non-empty database without history (error P3005). **Before** the first
deploy with this change, mark the two migrations that describe today's schema as already applied,
from a shell with the production `DATABASE_URL` (for example the Dokploy container's terminal):

```sh
npx prisma migrate resolve --applied 20260727075406_
npx prisma migrate resolve --applied 20260801000000_catch_up_with_schema
npx prisma migrate status
```

`migrate status` should then report the database schema as up to date. After that, every later
migration (such as the R2 storage ones) is applied automatically by `npm start`.

Only do this if production was built from the current `schema.prisma` (it was, by `db push`).
If unsure, first run `npx prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma`
— it should print an empty migration.
