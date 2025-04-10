const createAdmin = async () => {
  const name = "Admin";
  const email = "admin@admin.com";
  const password = "admin123"; // 🔐 CHANGE THIS and keep it safe
  const role = "admin";

  try {
    // Check if user already exists
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      console.log("❌ Admin with this email already exists.");
      return;
    }
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
      } else {
        console.log("Hashed Password:", hashedPassword);
        try {
          await db.query(
            "insert into users (name ,email, password,role) values ($1, $2 , $3, $4)",
            [name, email, hashedPassword, role]
          );
          console.log("✅ Admin created successfully!");
        } catch (err) {
          console.log(
            "Error in the database while inserting details." + err.message
          );
          return;
        }
      }
    });
  } catch (err) {
    console.log(
      "Error while trying to check if the admin exists" + err.message
    );
  }
};
createAdmin();
