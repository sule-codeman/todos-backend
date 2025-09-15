const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

const { JWT_SECRET, COOKIES_SECURE, COOKIE_SAMESITE } = process.env;

module.exports.authenticate = async (req, res, next) => {
  const access = req.cookies.access;
  const refresh = req.cookies.refresh;

  const isTokenMissing = (access && !refresh) || (!access && refresh);

  if (isTokenMissing) {
    return res.status(401).clearCookie("access").clearCookie("refresh").json({ message: "Unauthorized!" });
  }

  const cookies = access && refresh;

  if (!cookies) {
    return res.status(200).json({ cookies: false });
  }

  try {
    const { id, type } = jwt.verify(access, JWT_SECRET);

    const user = await userModel.findById(id);

    const isAccessToken = user && type == "ACCESS";

    if (!isAccessToken) {
      return res.status(401).clearCookie("access").clearCookie("refresh").json({ message: "Unauthorized!" });
    }

    req.id = id;
  } catch {
    try {
      const { id, type } = jwt.verify(refresh, JWT_SECRET);

      const user = await userModel.findById(id);

      const isRefreshToken = user && type == "REFRESH";

      if (!isRefreshToken || !user.active) {
        return res.status(401).clearCookie("access").clearCookie("refresh").json({ message: "Unauthorized!" });
      }

      const tokens = user.signTokens();

      res.cookie("access", tokens.access, {
        httpOnly: true,
        secure: COOKIES_SECURE == "true",
        sameSite: COOKIE_SAMESITE,
      }).cookie("refresh", tokens.refresh, {
        httpOnly: true,
        secure: COOKIES_SECURE == "true",
        sameSite: COOKIE_SAMESITE,
      });

      req.id = id;
    } catch {
      return res.status(401).clearCookie("access").clearCookie("refresh").json({ message: "Unauthorized!" });
    }
  }

  next();
};
