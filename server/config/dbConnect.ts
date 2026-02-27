// import pg from "pg";
// const { Pool } = pg;

// console.log("Connecting to db...");

// export const dbConnect = async () => {
//   const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   });

//   try {
//     const db = await pool.connect();
//     console.log("Database connected successfully.");
//     console.log("Using connection string:", process.env.DATABASE_URL);
//     const res = await db.query(
//       "SELECT current_database(), current_user, version();"
//     );
//     console.log(`Database: ${res.rows[0].current_database}`);
//     console.log(` User: ${res.rows[0].current_user}`);
//     return db;
//   } catch (err) {
//     console.log(`database connection error: ${err.message}`);
//     process.exit(1);
//   }
// };

import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool);
// helper to verify stuffs
export const verifyConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully.");
    
    const res = await client.query("SELECT current_database(), current_user, version();");
    console.log(`Database: ${res.rows[0].current_database}`);
    console.log(`User: ${res.rows[0].current_user}`);
    
    client.release();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log(`Database connection error: ${errorMessage}`);
    process.exit(1);
  }
};
export default db;