import pg from "pg";
const { Pool } = pg;

console.log("Connecting to db...");

export const dbConnect = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const db = await pool.connect();
    console.log("Database connected successfully.");
    console.log("Using connection string:", process.env.DATABASE_URL);

    const res = await db.query(
      "SELECT current_database(), current_user, version();"
    );
    console.log(`Database: ${res.rows[0].current_database}`);
    console.log(` User: ${res.rows[0].current_user}`);
    console.log(`Version: ${res.rows[0].version.split("\n")[0]}`);
    //Debug:
    // //  List all tables in the "public" schema
    // const tables = await db.query(`
    //   SELECT table_name
    //   FROM information_schema.tables
    //   WHERE table_schema = 'public'
    //   ORDER BY table_name;
    // `);

    // console.log("Tables in 'public' schema:");
    // tables.rows.forEach((row) => {
    //   console.log(`- ${row.table_name}`);
    // });

    return db;
  } catch (err) {
    console.log(`❌ Database connection error: ${err.message}`);
    process.exit(1);
  }
};
