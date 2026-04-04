import createHttpError from "http-errors";

export function requestValidator(validators) {
  return async (req, res, next) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.body) {
        // console.log("Validating body:", req.body);
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      // console.error(error);
      const err = error?.errors?.[0];
      const message = `${err?.path?.[0]} ${[err?.message]}`;
      next(createHttpError(422, message));
    }
  };
}
