import express from "express";
import prisma from "../../db/prisma.js";
import { urlListQuery } from "../../validators/url.js";
import { requestValidator } from "../../middleware/requestValidator.js";

const router = express.Router();

router.get(
  "/",
  //requestValidator({ query: urlListQuery }),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;

      const where = {
        deletedAt: null,
      };

      const [urls, total] = await Promise.all([
        prisma.url.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            originalUrl: true,
            shortCode: true,
            clickCount: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.url.count({ where }),
      ]);

      // Append full short URL to each item
      const baseUrl = process.env.BASE_URL;
      const data = urls.map((url) => ({
        ...url,
        shortUrl: `${baseUrl}/${url.shortCode}`,
      }));

      res.status(200).json({
        success: true,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
