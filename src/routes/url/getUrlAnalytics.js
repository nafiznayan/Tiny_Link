import express from 'express';
import prisma from '../../db/prisma.js';
import { shortCodeParams } from '../../validators/url.js';
import { requestValidator } from '../../middleware/requestValidator.js';

const router = express.Router();

router.get(
  '/:shortCode/analytics',
  requestValidator({ params: shortCodeParams }),
  async (req, res, next) => {
    try {
      const { shortCode } = req.params;

      const url = await prisma.url.findUnique({
        where: { shortCode },
        select: {
          id: true,
          originalUrl: true,
          shortCode: true,
          clickCount: true,
          createdAt: true,
          deletedAt: true,
          clicks: {
            orderBy: { timestamp: 'desc' },
            take: 50,
            select: {
              id: true,
              timestamp: true,
              ip: true,
              userAgent: true,
              referer: true,
            },
          },
        },
      });

      if (!url || url.deletedAt) {
        return res.status(404).json({
          success: false,
          message: 'URL not found',
        });
      }

      const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;

      res.status(200).json({
        success: true,
        data: {
          id: url.id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl,
          clickCount: url.clickCount,
          createdAt: url.createdAt,
          recentClicks: url.clicks,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
