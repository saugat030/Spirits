import { db } from "../config/dbConnect.js";
import { getProductById } from "../db/repository/product.repo.js";
import { insertOrder, insertOrderItems, fetchOrdersByUserId, updateOrderStatusInDb } from "../db/repository/order.repo.js";

type CheckoutItemDTO = {
    spiritId: string;
    quantity: number;
};

export const createOrderService = async (userId: string, items: CheckoutItemDTO[]) => {
    if (!items || items.length === 0) throw new Error("EMPTY_CART");
    // start the massive atomic transaction
    return await db.transaction(async (tx) => {
        let calculatedTotal = 0;
        const validatedItems = [];
        // verify every single item's real price from the database
        for (const item of items) {
            const product = await getProductById(item.spiritId, tx);
            if (!product) throw new Error(`PRODUCT_NOT_FOUND_${item.spiritId}`);
            if (product.quantity < item.quantity) throw new Error(`INSUFFICIENT_STOCK_${item.spiritId}`);

            const itemTotal = Number(product.price) * item.quantity;
            calculatedTotal += itemTotal;

            validatedItems.push({
                spiritId: item.spiritId,
                quantity: item.quantity,
                priceAtPurchase: product.price.toString(), // lock in the historical price
            });
        }

        const newOrder = await insertOrder(userId, calculatedTotal, tx);
        if (!newOrder) throw new Error("NEW_ORDER_FETCH_ERROR")
        // attach the Order ID to validated items and insert them
        const itemsToInsert = validatedItems.map(item => ({
            ...item,
            orderId: newOrder.id,
        }));
        await insertOrderItems(itemsToInsert, tx);

        return newOrder;
    });
};

export const getMyOrdersService = async (userId: string) => {
    return await fetchOrdersByUserId(userId);
};

export const updateOrderStatusService = async (orderId: string, status: string) => {
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) throw new Error("INVALID_STATUS");

    const updatedOrder = await updateOrderStatusInDb(orderId, status);
    if (!updatedOrder) throw new Error("ORDER_NOT_FOUND");

    return updatedOrder;
};