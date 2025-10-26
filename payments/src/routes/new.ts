import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@ansif__artickets/common";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    // body("token").not().isEmpty(),
    body("orderId").not().isEmpty().withMessage("invalid credentials"),
  ],
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
      throw new BadRequestError("can't make payment, order already cancelled");
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      description: "Export testing payment for dev purpose",
      shipping: {
        name: "John Doe",
        address: {
          line1: "123 Fake St",
          city: "Test City",
          postal_code: "00000",
          country: "US",
        },
      },
      metadata: { test: "true", orderId: order.id },
    });

    //from this

    // const payment = Payment.build({
    //   orderId: orderId,
    //   stripeId: stripeId,
    // });
    // await payment.save();

    // await new PaymentCreatedPublisher(natsWrapper.client).publish({
    //   id: payment.id,
    //   orderId: payment.orderId,
    //   stripeId: payment.stripeId,
    // });
    // res.status(201).send({ id: payment.id });
    //to here need to move to a seperate callback file

    res.send({ clientSecret: paymentIntent.client_secret });
  }
);

export { router as createChargeRouter };
