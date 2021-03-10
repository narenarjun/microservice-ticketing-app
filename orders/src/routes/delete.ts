import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@wowowow/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

//  ! it maybe considered as PATCH method too
router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // an event must be published about this order being cancelled!

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
