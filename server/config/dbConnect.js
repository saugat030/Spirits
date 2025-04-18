import pg from "pg";

const { Pool } = pg;

export const dbConnect = async () => {
  const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DATABASE_PORT,
  });
  try {
    const db = await pool.connect();
    console.log("Database connected successfully.");
    // // Optional logging
    // const res = await db.query(
    //   "SELECT current_database(), current_user, version();"
    // );
    // console.log(`✅ Database connected: ${res.rows[0].current_database}`);
    // console.log(`👤 Connected as user: ${res.rows[0].current_user}`);
    // console.log(`🐘 PostgreSQL version: ${res.rows[0].version.split("\n")[0]}`);
    return db; // this client has `.release()`
  } catch (err) {
    console.log(`❌ Database connection error: ${err.message}`);
    process.exit(1);
  }
};
