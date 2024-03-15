import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { didYouGetOfferController } from "../controllers/index.js";

router.post("/", expressCallBack(didYouGetOfferController.createDidYouGetOffer));
router.get("/:_id", expressCallBack(didYouGetOfferController.getDidYouGetOfferById));
router.get("/", expressCallBack(didYouGetOfferController.getDidYouGetOffers));
router.patch("/:_id", expressCallBack(didYouGetOfferController.updateDidYouGetOfferById));
router.delete("/:_id", expressCallBack(didYouGetOfferController.deleteDidYouGetOfferById));

export default router;
