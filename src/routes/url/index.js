import express from "express";
import createUrlRouter from "./createUrl.js";
import getAllUrlsRouter from "./getAllUrls.js";
import getUrlAnalyticsRouter from "./getUrlAnalytics.js";
import deleteUrlRouter from "./deleteUrl.js";

const router = express.Router();

router.use(createUrlRouter);
router.use(getAllUrlsRouter);
router.use(getUrlAnalyticsRouter);
router.use(deleteUrlRouter);

export default router;
