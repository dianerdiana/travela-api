import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};
