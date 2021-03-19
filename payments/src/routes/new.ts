import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@wowowow/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/orders";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled Order");
    }

    // this shipping address and name can be changed to have reply on the customers info

    await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
      description: "Charging for ticket purchased in app",
      shipping: {
        name: "Jenny Rosen",
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US",
        },
      },
    });

    // ! As per Indian regulations, export transactions require a description, a customer name and address
    // await stripe.charges.create({
    //     currency:'usd',
    //     amount: order.price * 100,
    //     source: token,
    //     description:"testing charging route",
    //     shipping: {
    //         name: 'Jenny Rosen',
    //         address: {
    //           line1: '510 Townsend St',
    //           postal_code: '98140',
    //           city: 'San Francisco',
    //           state: 'CA',
    //           country: 'US',
    //         },
    //       },
    // })

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
