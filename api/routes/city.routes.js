import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { cityController } from "../controllers/index.js";

router.post("/", expressCallBack(cityController.createCity));
router.get("/province/:countryId", expressCallBack(cityController.getCityByCountry));
router.get("/:_id", expressCallBack(cityController.getCityById));
router.get("/", expressCallBack(cityController.getCitys));
router.patch("/:_id", expressCallBack(cityController.updateCityById));
router.delete("/:_id", expressCallBack(cityController.removeCityById));

export default router;
