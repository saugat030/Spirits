import { type Request, type Response } from "express";
import { createOrderService, getMyOrdersService, updateOrderStatusService } from "../service/OrderService.js";

// POST /api/orders
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { items } = req.body;

    const newOrder = await createOrderService(userId, items);

    res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
  } catch (error: any) {
    if (error.message === "EMPTY_CART") {
      res.status(400).json({ success: false, message: "Cart cannot be empty." });
      return;
    }
    if (error.message.startsWith("PRODUCT_NOT_FOUND")) {
      res.status(404).json({ success: false, message: "One or more products in your cart no longer exist." });
      return;
    }
    console.error("Checkout Error:", error);
    res.status(500).json({ success: false, message: "Server error during checkout." });
  }
};

// GET /api/orders/my-orders
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

// PATCH /api/admin/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!orderId) {
      res.status(400).json({ success: false, message: "Invalid order ID." });
      return;
    }
    const updatedOrder = await updateOrderStatusService(orderId as string, status);

    res.status(200).json({ success: true, message: "Order status updated.", data: updatedOrder });
  } catch (error: any) {
    if (error.message === "INVALID_STATUS") {
      res.status(400).json({ success: false, message: "Invalid order status provided." });
      return;
    }
    if (error.message === "ORDER_NOT_FOUND") {
      res.status(404).json({ success: false, message: "Order not found." });
      return;
    }
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: "Server error while updating status." });
  }
};