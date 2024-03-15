import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { socialMediaController } from "../controllers/index.js";

router.post("/", expressCallBack(socialMediaController.createSocialMedia));
router.get("/:_id", expressCallBack(socialMediaController.getSocialMediaById));
router.get("/", expressCallBack(socialMediaController.getSocialMedias));
router.patch("/:_id", expressCallBack(socialMediaController.updateSocialMediaById));
router.delete("/:_id", expressCallBack(socialMediaController.deleteSocialMediaById));

export default router;
