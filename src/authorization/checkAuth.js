import createHTTPError from "http-errors";
import { verifyToken } from "../../utils/jwtUtils.js";

const checkAuth = (types) => {
  return async (req, res, next) => {
    // console.log(req.url);
    try {
      let token = req.signedCookies.token;

      if (!token) {
        // console.log("tsds", userAgent);
        token = req.header("authorization")?.split(" ")[1];
        const method = req.method;
        const url = req.baseUrl;
      }
      //   console.log(userAgent);
      if (!token) throw createHTTPError(401, "Token is required");

      const {
        userId,
        role,
        diagnosticId,
        division,
        branchId = null,
        departmentId = null,
      } = await verifyToken(token);

      req.user = {
        userId,
        role,
        diagnosticId,
        division,
        branchId,
        departmentId,
      };

      if (!types || !types.length) return next();

      let i;
      for (i = 0; i < types.length; i++) if (types[i] === role) break;

      if (i === types.length)
        throw createHTTPError(403, "You are not authorized");
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;
