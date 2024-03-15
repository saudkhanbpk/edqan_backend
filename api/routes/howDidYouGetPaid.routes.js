import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { howDidYouGetPaidController } from "../controllers/index.js";

router.post("/", expressCallBack(howDidYouGetPaidController.createHowDidYouGetPaid));
router.get("/:_id", expressCallBack(howDidYouGetPaidController.getHowDidYouGetPaidById));
router.get("/", expressCallBack(howDidYouGetPaidController.getHowDidYouGetPaid));
router.patch("/:_id", expressCallBack(howDidYouGetPaidController.updateHowDidYouGetPaidById));
router.delete("/:_id", expressCallBack(howDidYouGetPaidController.deleteHowDidYouGetPaidById));

export default router;
