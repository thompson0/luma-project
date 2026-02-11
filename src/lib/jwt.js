import jwt from "jsonwebtoken";

export function signToken(payload) {
  return jwt.sign(payload, process.env.SESSION_SECRET, { expiresIn: "8h" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.SESSION_SECRET);
  } catch (err) {
    return null;
  }
}