import "dotenv/config";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../config/dbConnect";
import { users } from "../db/schema/User";
import { categories } from "../db/schema/Category";
import { liquors, liquorVariants } from "../db/schema/Liquor";
import { promotions } from "../db/schema/Promotions";

const ADMIN_EMAIL = "admin@spirits.test";
const ADMIN_PASSWORD = "Admin123!";

const USER_EMAIL = "user@spirits.test";
const USER_PASSWORD = "User123!";

const SALT_ROUNDS = 10;

const CATEGORIES_DATA = [
    { name: "Whiskey", image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400" },
    { name: "Vodka", image: "https://images.unsplash.com/photo-1471255614837-3c53d7b3dd61?w=400" },
    { name: "Rum", image: "https://images.unsplash.com/photo-1574190245510-e6ca8ef8f5bc?w=400" },
    { name: "Gin", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400" },
    { name: "Beer", image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400" },
    { name: "Wine", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400" },
];

const PRODUCTS_DATA: Array<{
    name: string;
    category: string;
    description: string;
    thumbnail: string;
    images: Array<{ url: string; alt_text: string }>;
    variants: Array<{ size: string; price: number; quantity: number }>;
}> = [
    {
        name: "Johnnie Walker Black Label",
        category: "Whiskey",
        description: "Premium blended Scotch whisky with rich smoky flavor and smooth finish.",
        thumbnail: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400",
        images: [
            { url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800", alt_text: "Front view" },
        ],
        variants: [
            { size: "750ml", price: 850000, quantity: 50 },
            { size: "1 Litre", price: 1100000, quantity: 30 },
            { size: "1.5 Litre", price: 1550000, quantity: 15 },
        ],
    },
    {
        name: "Jameson Irish Whiskey",
        category: "Whiskey",
        description: "Triple distilled Irish whiskey known for its smooth and approachable taste.",
        thumbnail: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400",
        images: [],
        variants: [
            { size: "750ml", price: 550000, quantity: 45 },
            { size: "1 Litre", price: 720000, quantity: 25 },
        ],
    },
    {
        name: "Grey Goose Vodka",
        category: "Vodka",
        description: "French premium vodka made from soft winter wheat and spring water.",
        thumbnail: "https://images.unsplash.com/photo-1471255614837-3c53d7b3dd61?w=400",
        images: [],
        variants: [
            { size: "700ml", price: 650000, quantity: 40 },
            { size: "1 Litre", price: 880000, quantity: 20 },
        ],
    },
    {
        name: "Absolut Vodka",
        category: "Vodka",
        description: "Swedish vodka made from natural ingredients with a clean taste.",
        thumbnail: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400",
        images: [],
        variants: [
            { size: "700ml", price: 450000, quantity: 60 },
            { size: "1 Litre", price: 620000, quantity: 35 },
        ],
    },
    {
        name: "Old Monk Rum",
        category: "Rum",
        description: "Classic Indian dark rum with a rich vanilla and caramel flavor.",
        thumbnail: "https://images.unsplash.com/photo-1574190245510-e6ca8ef8f5bc?w=400",
        images: [],
        variants: [
            { size: "750ml", price: 350000, quantity: 80 },
            { size: "1 Litre", price: 450000, quantity: 40 },
        ],
    },
    {
        name: "Captain Morgan Spiced Rum",
        category: "Rum",
        description: "Spiced rum with vanilla, cinnamon, and clove notes.",
        thumbnail: "https://images.unsplash.com/photo-1574190245510-e6ca8ef8f5bc?w=400",
        images: [],
        variants: [
            { size: "750ml", price: 480000, quantity: 35 },
            { size: "1 Litre", price: 620000, quantity: 20 },
        ],
    },
    {
        name: "Tanqueray London Dry Gin",
        category: "Gin",
        description: "Classic London dry gin with juniper and citrus notes.",
        thumbnail: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
        images: [],
        variants: [
            { size: "750ml", price: 580000, quantity: 30 },
            { size: "1 Litre", price: 750000, quantity: 15 },
        ],
    },
    {
        name: "Heineken Lager Beer",
        category: "Beer",
        description: "Premium Dutch lager beer with a crisp and refreshing taste.",
        thumbnail: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        images: [],
        variants: [
            { size: "330ml", price: 18000, quantity: 200 },
            { size: "500ml", price: 25000, quantity: 150 },
            { size: "6 Pack 330ml", price: 95000, quantity: 50 },
        ],
    },
    {
        name: "Corona Extra",
        category: "Beer",
        description: "Mexican pale lager known for its light flavor and clear bottle.",
        thumbnail: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        images: [],
        variants: [
            { size: "330ml", price: 20000, quantity: 180 },
            { size: "6 Pack 330ml", price: 105000, quantity: 45 },
        ],
    },
    {
        name: "Sula Vineyards Red Wine",
        category: "Wine",
        description: "Indian red wine with rich berry and oak flavors.",
        thumbnail: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
        images: [],
        variants: [
            { size: "750ml", price: 750000, quantity: 25 },
        ],
    },
    {
        name: "Sula Vineyards White Wine",
        category: "Wine",
        description: "Crisp and refreshing white wine with citrus notes.",
        thumbnail: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
        images: [],
        variants: [
            { size: "750ml", price: 680000, quantity: 20 },
        ],
    },
];

const PROMOTIONS_DATA = [
    {
        name: "Whiskey Lovers 15% Off",
        discountType: "percentage" as const,
        discountValue: 15,
        targetType: "category",
        targetName: "Whiskey",
    },
    {
        name: "Beer Festival 10% Off",
        discountType: "percentage" as const,
        discountValue: 10,
        targetType: "category",
        targetName: "Beer",
    },
    {
        name: "Premium Spirits Rs.500 Off",
        discountType: "fixed_amount" as const,
        discountValue: 50000,
        targetType: "product",
        targetName: "Grey Goose Vodka",
    },
    {
        name: "Holiday Rum Deal 20% Off",
        discountType: "percentage" as const,
        discountValue: 20,
        targetType: "category",
        targetName: "Rum",
    },
    {
        name: "Welcome Wine 5% Off",
        discountType: "percentage" as const,
        discountValue: 5,
        targetType: "category",
        targetName: "Wine",
    },
];

async function seedUsers() {
    const adminExists = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL));

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

    const userExists = await db.select().from(users).where(eq(users.email, USER_EMAIL));

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

async function seedCategories(): Promise<Map<string, string>> {
    const categoryIdMap = new Map<string, string>();

    for (const cat of CATEGORIES_DATA) {
        const existing = await db.select().from(categories).where(eq(categories.category_name, cat.name));

        if (existing.length === 0) {
            const inserted = await db.insert(categories).values({
                category_name: cat.name,
                category_image_url: cat.image,
            }).returning();

            const insertedCat = inserted[0];
            if (insertedCat) {
                categoryIdMap.set(cat.name, insertedCat.id);
                console.log(`Created category: ${cat.name}`);
            }
        } else {
            const existingCat = existing[0];
            if (existingCat) {
                categoryIdMap.set(cat.name, existingCat.id);
                console.log(`Category already exists: ${cat.name}`);
            }
        }
    }

    return categoryIdMap;
}

async function seedProducts(categoryIdMap: Map<string, string>) {
    for (const product of PRODUCTS_DATA) {
        const categoryId = categoryIdMap.get(product.category);
        if (!categoryId) {
            console.log(`Category not found for product: ${product.name}`);
            continue;
        }

        const existingProducts = await db.select().from(liquors).where(eq(liquors.name, product.name));

        if (existingProducts.length === 0) {
            const inserted = await db.insert(liquors).values({
                name: product.name,
                categoryId: categoryId,
                description: product.description,
                thumbnail_url: product.thumbnail,
                images: product.images.length > 0 ? product.images : null,
            }).returning();

            const insertedProduct = inserted[0];
            if (!insertedProduct) continue;

            const productId = insertedProduct.id;
            console.log(`Created product: ${product.name}`);

            for (const variant of product.variants) {
                const sku = `SKU-${product.name.substring(0, 6).toUpperCase().replace(/\s/g, "")}-${variant.size.toUpperCase().replace(/\s/g, "").replace(/ML/g, "ML")}-${crypto.randomUUID().substring(0, 6).toUpperCase()}`;

                await db.insert(liquorVariants).values({
                    liquorId: productId,
                    size: variant.size,
                    sku: sku,
                    price: variant.price,
                    inventoryQuantity: variant.quantity,
                });
                console.log(`  Created variant: ${variant.size} - Rs.${variant.price / 100}`);
            }
        } else {
            console.log(`Product already exists: ${product.name}`);
        }
    }
}

async function seedPromotions(categoryIdMap: Map<string, string>) {
    const now = new Date();
    const endDate = new Date("2027-12-31T23:59:59Z");

    for (const promo of PROMOTIONS_DATA) {
        const existingPromo = await db.select().from(promotions).where(eq(promotions.name, promo.name));

        if (existingPromo.length > 0) {
            console.log(`Promotion already exists: ${promo.name}`);
            continue;
        }

        let categoryId: string | null = null;
        let liquorId: string | null = null;

        if (promo.targetType === "category") {
            categoryId = categoryIdMap.get(promo.targetName) || null;
        } else if (promo.targetType === "product") {
            const product = await db.select().from(liquors).where(eq(liquors.name, promo.targetName));
            const foundProduct = product[0];
            if (foundProduct) {
                liquorId = foundProduct.id;
            }
        }

        await db.insert(promotions).values({
            name: promo.name,
            discountType: promo.discountType,
            discountValue: promo.discountValue,
            startDate: now,
            endDate: endDate,
            isActive: true,
            categoryId: categoryId,
            liquorId: liquorId,
        });

        console.log(`Created promotion: ${promo.name} (${promo.discountType === "percentage" ? `${promo.discountValue}%` : `Rs.${promo.discountValue / 100}`} off)`);
    }
}

async function main() {
    try {
        console.log("Starting seed...\n");

        await seedUsers();
        console.log("");

        const categoryIdMap = await seedCategories();
        console.log("");

        await seedProducts(categoryIdMap);
        console.log("");

        await seedPromotions(categoryIdMap);
        console.log("");

        console.log("Seed completed successfully!");
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Seed failed:", message);
        process.exitCode = 1;
    }
}

void main();
