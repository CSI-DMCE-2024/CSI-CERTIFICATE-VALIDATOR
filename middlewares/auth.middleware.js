const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, USERNAME, PASSWORD } = require("../config");

const tokenVerify = (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError("Token not found", 401, "Unauthorized");
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.username !== USERNAME || decoded.password !== PASSWORD) {
      throw new ApiError("Invalid token", 401, "Unauthorized");
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError("Token expired", 401, "Unauthorized"));
    }
    else if (err.name === "JsonWebTokenError") {
      return next(new ApiError("Invalid token", 401, "Unauthorized"));
    }

    next(err);
  }
};

module.exports = tokenVerify;
