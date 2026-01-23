import jwt from 'jsonwebtoken';
import ApiError from './ApiError.util.js';


const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '1h';


export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
};


export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};
