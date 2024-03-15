import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { keyWaysController } from "../controllers/index.js";

router.post("/", expressCallBack(keyWaysController.createKeyWays));
router.get("/:_id", expressCallBack(keyWaysController.getKeyWaysById));
router.get("/", expressCallBack(keyWaysController.getKeyWayss));
router.patch("/:_id", expressCallBack(keyWaysController.updateKeyWaysById));
router.delete("/:_id", expressCallBack(keyWaysController.removeKeyWaysById));

export default router;
