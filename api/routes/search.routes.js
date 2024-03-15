import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { searchController } from "../controllers/index.js";

router.get("/", expressCallBack(searchController.search));

export default router;
