import {
  BadRequestError,
  UnauthenticatedError,
} from "../errors/custom-error.js";
import { verifyJWT } from "../utils/token-utility.js";

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError("authentication invalid");
  }

  try {
    const decodedToken = verifyJWT(token);
    if (!decodedToken) {
      BadRequestError("Authentication failed due to inavalid token.");
    }

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication invalid");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};
