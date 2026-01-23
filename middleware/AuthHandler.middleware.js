import ApiError from "../utils/ApiError.util.js";
import { verifyToken } from "../utils/jwt.util.js";

const publicPaths = ["/api/v1/users/login", "/api/v1/users/register"];

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    

    if (publicPaths.includes(req.path)) {
      return next();
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Token missing");
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyToken(token);

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
