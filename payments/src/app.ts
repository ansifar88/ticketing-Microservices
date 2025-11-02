import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@ansif__artickets/common";

import { createChargeRouter } from "./routes/new";
import { stripeCallbackRouter } from "./callback/stripe-callback";
import { metricsHandler, metricsMiddleware } from "./metrics/metrics";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(metricsMiddleware);
app.use(currentUser);

app.use(createChargeRouter);
app.use(stripeCallbackRouter);
app.get('/metrics', metricsHandler);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
