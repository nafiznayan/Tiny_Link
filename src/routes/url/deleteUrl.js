import express from 'express';
import prisma from '../../db/prisma.js';
import { shortCodeParams } from '../../validators/url.js';
import { requestValidator } from '../../middleware/requestValidator.js';

const router = express.Router();

router.delete(
  '/:shortCode',
  requestValidator({ params: shortCodeParams }),
  async (req, res, next) => {
    try {
      const { shortCode } = req.params;

      const existing = await prisma.url.findUnique({
        where: { shortCode },
      });

      if (!existing || existing.deletedAt) {
        return res.status(404).json({
          success: false,
          message: 'URL not found',
        });
      }

      await prisma.url.update({
        where: { shortCode },
        data: { deletedAt: new Date() },
      });

      res.status(200).json({
        success: true,
        message: 'URL deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
