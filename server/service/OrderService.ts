import { db } from "../config/dbConnect.js";
import { getVariantById, decrementVariantInventory, incrementVariantInventory } from "../db/repository/product.repo.js";
import { insertOrder, insertOrderItems, fetchOrdersByUserId, fetchOrderById, fetchOrderItemsByOrderId, updateOrderStatusInDb, fetchAllOrders } from "../db/repository/order.repo.js";
import { fetchActivePromotionsForVariant } from "../db/repository/promotion.repo.js";

type CheckoutItemDTO = {
    variantId: string;
    quantity: number;
};

type CreateOrderParams = {
    userId: string;
    items: CheckoutItemDTO[];
    shippingAddress: string;
    paymentMethod?: string;
};

export const createOrderService = async (params: CreateOrderParams) => {
    if (!params.items || params.items.length === 0) throw new Error("EMPTY_CART");

    return await db.transaction(async (tx) => {
        let calculatedTotal = 0;
        const validatedItems: {
            variantId: string;
            quantity: number;
            originalPrice: number;
            priceAtPurchase: number;
            discountAmount: number;
            appliedPromotionId?: string;
        }[] = [];

        for (const item of params.items) {
            const variant = await getVariantById(item.variantId, tx);
            if (!variant) throw new Error(`VARIANT_NOT_FOUND_${item.variantId}`);
            if (variant.inventoryQuantity < item.quantity) throw new Error(`INSUFFICIENT_STOCK_${item.variantId}`);

            const originalPrice = variant.price;

            let priceAtPurchase = originalPrice;
            let discountAmount = 0;
            let appliedPromotionId: string | undefined;

            if (variant.liquorId && variant.categoryId) {
                const activePromotions = await fetchActivePromotionsForVariant(
                    item.variantId,
                    variant.liquorId,
                    variant.categoryId,
                    tx
                );

                if (activePromotions.length > 0) {
                    const highestDiscount = activePromotions.reduce((max, promo) =>
                        promo.discountValue > max.discountValue ? promo : max
                    );

                    if (highestDiscount.discountType === "percentage") {
                        discountAmount = Math.round(originalPrice * highestDiscount.discountValue / 100);
                    } else {
                        discountAmount = Math.min(highestDiscount.discountValue, originalPrice);
                    }

                    priceAtPurchase = Math.max(0, originalPrice - discountAmount);
                    appliedPromotionId = highestDiscount.id;
                }
            }

            const itemTotal = priceAtPurchase * item.quantity;
            calculatedTotal += itemTotal;

            validatedItems.push({
                variantId: item.variantId,
                quantity: item.quantity,
                originalPrice,
                priceAtPurchase,
                discountAmount,
                ...(appliedPromotionId && { appliedPromotionId }),
            });
        }

        const newOrder = await insertOrder({
            userId: params.userId,
            totalAmount: calculatedTotal,
            shippingAddress: params.shippingAddress,
            paymentMethod: params.paymentMethod,
        }, tx);

        if (!newOrder) throw new Error("NEW_ORDER_FETCH_ERROR");

        const itemsToInsert = validatedItems.map(item => ({
            ...item,
            orderId: newOrder.id,
        }));

        await insertOrderItems(itemsToInsert, tx);

        for (const item of params.items) {
            await decrementVariantInventory(item.variantId, item.quantity, tx);
        }

        return newOrder;
    });
};

export const getMyOrdersService = async (userId: string) => {
    return await fetchOrdersByUserId(userId);
};

export const getOrderByIdService = async (orderId: string) => {
    const order = await fetchOrderById(orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");
    const items = await fetchOrderItemsByOrderId(orderId);
    return { ...order, items };
};

export const updateOrderStatusService = async (orderId: string, status: string) => {
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) throw new Error("INVALID_STATUS");

    const currentOrder = await fetchOrderById(orderId);
    if (!currentOrder) throw new Error("ORDER_NOT_FOUND");

    const updatedOrder = await updateOrderStatusInDb(orderId, status);

    if (status === "cancelled") {
        const orderItems = await fetchOrderItemsByOrderId(orderId);
        for (const item of orderItems) {
            await incrementVariantInventory(item.variant.id, item.quantity);
        }
    }

    return updatedOrder;
};

export const getAllOrdersService = async (options: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
}) => {
    return await fetchAllOrders(options);
};
