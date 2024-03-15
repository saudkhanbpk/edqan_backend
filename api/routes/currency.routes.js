import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { currencyController } from "../controllers/index.js";

router.post("/", expressCallBack(currencyController.createCurrency));
router.get("/:_id", expressCallBack(currencyController.getCurrencyById));
router.get("/", expressCallBack(currencyController.getCurrencys));
router.patch("/:_id", expressCallBack(currencyController.updateCurrencyById));
router.delete("/:_id", expressCallBack(currencyController.removeCurrencyById));

export default router;
