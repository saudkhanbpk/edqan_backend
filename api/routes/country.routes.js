import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { countryController } from "../controllers/index.js";

router.post("/", expressCallBack(countryController.createCountry));
router.get("/:_id", expressCallBack(countryController.getCountryById));
router.get("/", expressCallBack(countryController.getCountrys));
router.patch("/:_id", expressCallBack(countryController.updateCountryById));
router.delete("/:_id", expressCallBack(countryController.removeCountryById));

export default router;
