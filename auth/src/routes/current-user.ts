import express from "express";
import { Request, Response } from "express";

import { currentUser } from "@ansif__artickets/common";

const router = express.Router();

router.get("/api/users/currentuser",currentUser, (req: Request, res: Response) => {
res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
