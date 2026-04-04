import express from 'express';
import prisma from '../../db/prisma.js';

const router = express.Router();

router.get('/:shortCode', async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const url = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url || url.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Short URL not found or has been deleted',
      });
    }

    // Check expiration
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({
        success: false,
        message: 'This short URL has expired',
      });
    }

    // Record the click asynchronously (don't block the redirect)
    const ip = req.ip || req.socket.remoteAddress || null;
    const userAgent = req.get('user-agent') || null;
    const referer = req.get('referer') || null;

    // Fire-and-forget: increment click count + create click record
    prisma
      .$transaction([
        prisma.url.update({
          where: { shortCode },
          data: { clickCount: { increment: 1 } },
        }),
        prisma.click.create({
          data: {
            urlId: url.id,
            ip,
            userAgent,
            referer,
          },
        }),
      ])
      .catch((err) => {
        console.error('Failed to record click:', err.message);
      });

    // 302 redirect
    res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
});

export default router;
