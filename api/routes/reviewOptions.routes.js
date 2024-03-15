import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { reviewOptionsController } from "../controllers/index.js";

router.post("/", expressCallBack(reviewOptionsController.createReviewOptions));
router.get("/:_id", expressCallBack(reviewOptionsController.getReviewOptionsById));
router.get("/", expressCallBack(reviewOptionsController.getReviewOptionss));
router.patch("/:_id", expressCallBack(reviewOptionsController.updateReviewOptionsById));

export default router;
