import express from 'express';
import redirectUrlRouter from './redirectUrl.js';

const router = express.Router();

// GET /:shortCode
router.use(redirectUrlRouter);

export default router;
