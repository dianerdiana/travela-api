import jwt from "jsonwebtoken";
import { ENV } from "@config/env";

export const generateToken = (userId: number) => {
  if (!ENV.JWT_SECRET) {
    throw new Error("JWT secret is not defined.");
  }

  return jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: "1d" }); // eslint-disable-line
};

export const verifyToken = (token: string) => {
  if (!ENV.JWT_SECRET) {
    throw new Error("JWT secret is not defined.");
  }

  return jwt.verify(token, ENV.JWT_SECRET);
};
