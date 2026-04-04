import express from 'express';
import prisma from '../../db/prisma.js';
import { generateShortCode } from '../../utils/base62.js';
import { createUrl } from '../../validators/url.js';
import { requestValidator } from '../../middleware/requestValidator.js';

const router = express.Router();

router.post(
  '/',
  requestValidator({ body: createUrl }),
  async (req, res, next) => {
    try {
      const { originalUrl } = req.body;

      // Generate a unique short code (retry on collision)
      let shortCode;
      let exists = true;

      while (exists) {
        shortCode = generateShortCode();
        exists = await prisma.url.findUnique({
          where: { shortCode },
        });
      }

      const url = await prisma.url.create({
        data: {
          originalUrl,
          shortCode,
        },
      });

      const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;

      res.status(201).json({
        success: true,
        message: 'Short URL created successfully',
        data: {
          id: url.id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl,
          createdAt: url.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
