import express from 'express';
import prisma from '../../db/prisma.js';

const router = express.Router();

// ========================
// Home Page
// ========================
router.get('/', async (req, res, next) => {
  try {
    const [totalLinks, clickAgg] = await Promise.all([
      prisma.url.count({ where: { deletedAt: null } }),
      prisma.url.aggregate({
        where: { deletedAt: null },
        _sum: { clickCount: true },
      }),
    ]);

    const totalClicks = clickAgg._sum.clickCount || 0;

    res.render('layout', {
      body: await renderPage(req, 'pages/home', {
        title: 'Home',
        active: 'home',
        totalLinks,
        totalClicks,
      }),
      title: 'Home',
      active: 'home',
    });
  } catch (error) {
    next(error);
  }
});

// ========================
// Links Page
// ========================
router.get('/links', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = { deletedAt: null };

    const [urls, total] = await Promise.all([
      prisma.url.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          originalUrl: true,
          shortCode: true,
          clickCount: true,
          createdAt: true,
        },
      }),
      prisma.url.count({ where }),
    ]);

    const baseUrl = process.env.BASE_URL;
    const urlsWithShort = urls.map((url) => ({
      ...url,
      shortUrl: `${baseUrl}/${url.shortCode}`,
    }));

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    res.render('layout', {
      body: await renderPage(req, 'pages/links', {
        title: 'My Links',
        active: 'links',
        urls: urlsWithShort,
        pagination,
      }),
      title: 'My Links',
      active: 'links',
    });
  } catch (error) {
    next(error);
  }
});

// ========================
// Analytics Page
// ========================
router.get('/links/:shortCode', async (req, res, next) => {
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
      return res.status(404).render('layout', {
        body: await renderPage(req, 'pages/404', {
          title: '404',
          active: '',
        }),
        title: '404',
        active: '',
      });
    }

    const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;

    res.render('layout', {
      body: await renderPage(req, 'pages/analytics', {
        title: `Analytics — ${url.shortCode}`,
        active: 'links',
        url: {
          ...url,
          shortUrl,
          recentClicks: url.clicks,
        },
      }),
      title: `Analytics — ${url.shortCode}`,
      active: 'links',
    });
  } catch (error) {
    next(error);
  }
});

// ========================
// Helper: render a partial EJS page to string
// ========================
function renderPage(req, view, data) {
  return new Promise((resolve, reject) => {
    req.app.render(view, data, (err, html) => {
      if (err) return reject(err);
      resolve(html);
    });
  });
}

export default router;
