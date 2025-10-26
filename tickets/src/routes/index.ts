import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@ansif__artickets/common";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";

const router = express.Router();
router.get("/api/tickets",  async (req: Request, res: Response) => {
    const tickets = await Ticket.find({
      orderId: undefined
    });
  res.status(200).send(tickets);
});

export { router as indexTicketRouter };
