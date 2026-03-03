import "dotenv/config";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../config/dbConnect";
import { users } from "../db/schema/User";
import { categories } from "../db/schema/Category";
import { liquors } from "../db/schema/Liquor";

const ADMIN_EMAIL = "admin@spirits.test";
const ADMIN_PASSWORD = "Admin123!";

const USER_EMAIL = "user@spirits.test";
const USER_PASSWORD = "User123!";

const CATEGORY_NAME = "Whiskey";
const PRODUCT_NAME = "Sample Whiskey";

const SALT_ROUNDS = 10;

async function ensureUsers() {
  const adminExists = await db
    .select()
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL));

  if (adminExists.length === 0) {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    await db.insert(users).values({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashed,
      role: "admin",
      is_verified: true,
      is_active: true,
    });
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
  } else {
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
  }

  const userExists = await db
    .select()
    .from(users)
    .where(eq(users.email, USER_EMAIL));

  if (userExists.length === 0) {
    const hashed = await bcrypt.hash(USER_PASSWORD, SALT_ROUNDS);
    await db.insert(users).values({
      name: "Test User",
      email: USER_EMAIL,
      password: hashed,
      role: "user",
      is_verified: true,
      is_active: true,
    });
    console.log(`Created regular user: ${USER_EMAIL}`);
  } else {
    console.log(`Regular user already exists: ${USER_EMAIL}`);
  }
}

async function ensureCategoryAndProduct() {
  const existingCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.typeName, CATEGORY_NAME));

  let categoryId: string;

  if (existingCategories.length === 0) {
    const inserted = await db
      .insert(categories)
      .values({ typeName: CATEGORY_NAME })
      .returning();

    categoryId = inserted[0].typeId;
    console.log(`Created category: ${CATEGORY_NAME}`);
  } else {
    categoryId = existingCategories[0].typeId;
    console.log(`Category already exists: ${CATEGORY_NAME}`);
  }

  const existingProducts = await db
    .select()
    .from(liquors)
    .where(eq(liquors.name, PRODUCT_NAME));

  if (existingProducts.length === 0) {
    await db.insert(liquors).values({
      name: PRODUCT_NAME,
      typeId: categoryId,
      description: "Seeded sample whiskey product.",
      quantity: 100,
      price: 5000,
    });
    console.log(`Created product: ${PRODUCT_NAME}`);
  } else {
    console.log(`Product already exists: ${PRODUCT_NAME}`);
  }
}

async function main() {
  try {
    console.log("Starting seed...");
    await ensureUsers();
    await ensureCategoryAndProduct();
    console.log("Seed completed successfully.");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Seed failed:", message);
    process.exitCode = 1;
  }
}

void main();

