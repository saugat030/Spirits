import { type Request, type Response } from "express";
import { createOrderService, getMyOrdersService, getOrderByIdService, updateOrderStatusService } from "../service/OrderService.js";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            res.status(400).json({ success: false, message: "Cart cannot be empty." });
            return;
        }

        if (!shippingAddress) {
            res.status(400).json({ success: false, message: "Shipping address is required." });
            return;
        }

        const newOrder = await createOrderService({
            userId,
            items,
            shippingAddress,
            paymentMethod,
        });

        res.status(201).json({ success: true, message: "Order placed successfully!", data: newOrder });
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === "EMPTY_CART") {
                res.status(400).json({ success: false, message: "Cart cannot be empty." });
                return;
            }
            if (error.message.startsWith("VARIANT_NOT_FOUND")) {
                const variantId = error.message.split("_").pop();
                res.status(404).json({ success: false, message: `Variant with ID ${variantId} not found.` });
                return;
            }
            if (error.message.startsWith("INSUFFICIENT_STOCK")) {
                const variantId = error.message.split("_").pop();
                res.status(400).json({ success: false, message: `Insufficient stock for variant ${variantId}.` });
                return;
            }
        }
        console.error("Checkout Error:", error);
        res.status(500).json({ success: false, message: "Server error during checkout." });
    }
};

export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const orders = await getMyOrdersService(userId);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ success: false, message: "Could not fetch your orders." });
    }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderIdParam = req.params.id;
        const orderId = Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam || "";
        if (!orderId) {
            res.status(400).json({ success: false, message: "Invalid order ID." });
            return;
        }
        const order = await getOrderByIdService(orderId);
        res.status(200).json({ success: true, data: order });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "ORDER_NOT_FOUND") {
            res.status(404).json({ success: false, message: "Order not found." });
            return;
        }
        console.error("Fetch Order Error:", error);
        res.status(500).json({ success: false, message: "Could not fetch order." });
    }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderIdParam = req.params.id;
        const orderId = Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam;
        const { status } = req.body;

        if (!orderId) {
            res.status(400).json({ success: false, message: "Invalid order ID." });
            return;
        }

        const updatedOrder = await updateOrderStatusService(orderId, status);

        res.status(200).json({ success: true, message: "Order status updated.", data: updatedOrder });
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === "INVALID_STATUS") {
                res.status(400).json({ success: false, message: "Invalid order status provided." });
                return;
            }
            if (error.message === "ORDER_NOT_FOUND") {
                res.status(404).json({ success: false, message: "Order not found." });
                return;
            }
        }
        console.error("Update Status Error:", error);
        res.status(500).json({ success: false, message: "Server error while updating status." });
    }
};
