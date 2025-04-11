import pg from "pg";

export const dbConnect = async () => {
  try {
    const db = new pg.Client({
      user: "postgres",
      host: "localhost",
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: process.env.DATABASE_PORT,
    });
    await db.connect();
    // paxi Add more to this console.log after successful connection. Somthing like this:
    // const res = await db.query("SELECT current_database(), current_user, version();");
    // console.log(`✅ Database connected: ${res.rows[0].current_database}`);
    // console.log(`👤 Connected as user: ${res.rows[0].current_user}`);
    // console.log(`🐘 PostgreSQL version: ${res.rows[0].version}`);
    console.log("Database connected successfully.");
    return db;
  } catch (err) {
    console.log(`Databse connection error:${err}`);
    process.exit(1);
  }
};
