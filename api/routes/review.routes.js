import express from "express";
const router = express.Router();
import { checkAuth } from "../security/index.js";

import expressCallBack from "../helper/express-callback.js";

import { reviewController } from "../controllers/index.js";

router.post("/", checkAuth, expressCallBack(reviewController.createReview));
router.get("/", checkAuth, expressCallBack(reviewController.getReviews));
router.get("/:_id", expressCallBack(reviewController.getReviewById));
router.patch("/:_id", checkAuth, expressCallBack(reviewController.updateReviewById));

export default router;
