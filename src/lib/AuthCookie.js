const isDevelopment = process.env.NODE_ENV === "development";
// Common cookie options
const cookieOptions = {
  httpOnly: true, // Prevents JavaScript access
  sameSite: isDevelopment ? "lax" : "strict", //isDevelopment ? "lax" : "strict", // CSRF protection
  secure: isDevelopment ? false : true, // false in development, true in production  // Only sent over HTTPS
  signed: true,
};
export const AuthCookie = {
  setAuthCookies(res, accessToken, refreshToken, path = "/api/v1/patient/") {
    // Access token in memory-only cookie
    // Short lived (15-60 minutes typically)

    res.cookie("access_token", accessToken, {
      ...cookieOptions,
      maxAge: 900000, // 15 minutes
      path: path, // Restricted path
    });
    // console.log(r);
    // Refresh token in HTTP-only cookie
    // Longer lived (days/weeks)
    res.cookie("refresh_token", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 15 days
      path: path, // Restricted path
    });
  },
  removeAuthCookies(res, path = "/api/v1/patient/") {
    res.clearCookie("access_token", {
      ...cookieOptions,
      path: path, // Must match the path used when setting
    });

    // Clear refresh token
    res.clearCookie("refresh_token", {
      ...cookieOptions,
      path: path, // Must match the path used when setting
    });
  },
};
