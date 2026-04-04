const errorTypes = {
  ValidationError: 422,
  JsonWebTokenError: 401,
  TokenExpiredError: 401,
};

const errorMessages = {
  TokenExpiredError: "Token expired",
};

export const notFoundError = (req, res, next) => {
  // If request accepts HTML (browser), render 404 page
  if (req.accepts('html')) {
    res.status(404);
    return res.render('layout', {
      body: '',
      title: '404',
      active: '',
    }, (err, layoutHtml) => {
      // Render the 404 page content into layout
      req.app.render('pages/404', { title: '404', active: '' }, (err2, pageHtml) => {
        if (err2) {
          return res.status(404).json({ message: `Not Found -> ${req.originalUrl}` });
        }
        req.app.render('layout', { body: pageHtml, title: '404', active: '' }, (err3, html) => {
          if (err3) {
            return res.status(404).json({ message: `Not Found -> ${req.originalUrl}` });
          }
          res.send(html);
        });
      });
    });
  }

  // For API requests, return JSON
  const error = new Error(`Not Found -> ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  const statusCode =
    res.statusCode === 200
      ? errorTypes[error.name] || error.statusCode || 500
      : res.statusCode;
  res.status(statusCode);
  res.json({
    message: errorMessages[error.name] || error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};
