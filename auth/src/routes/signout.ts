import express from "express";
import { Request, Response } from "express";
import cookieSession from "cookie-session";
const router = express.Router();

router.post("/api/users/signout", (req: Request, res: Response) => {
  req.session = null;
  res.status(200).send({ message: "Signed out successfully" });
});

export { router as signoutRouter };
