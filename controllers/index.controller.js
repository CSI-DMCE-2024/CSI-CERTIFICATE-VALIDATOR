const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE, USERNAME, PASSWORD } = require("../config");

const Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    console.log( username, password);
    
    

    if (username !== USERNAME || password !== PASSWORD) {
      throw new ApiError("Invalid credentials", 400, "BadRequest");
    }

    const accessToken = await jwt.sign({ username, password }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });
    return res
      .cookie("accessToken", accessToken)
      .json(new ApiResponse({ accessToken }, "Login successful", 200));
  } catch (err) {
    next(err);
  }
};

module.exports = { Login };
