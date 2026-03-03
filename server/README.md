## Seed script

To insert initial data (one admin, one regular user, and one sample product) into the database:

1. Make sure your `.env` in `server` has a valid `DATABASE_URL` and that migrations have been applied.
2. From the `server` directory, run:

```bash
npm install
npm run seed
```

This will create:

- Admin user: email `admin@spirits.test`, password `Admin123!`
- Regular user: email `user@spirits.test`, password `User123!`
- Category `Whiskey` and product `Sample Whiskey` with a stock quantity and price.

