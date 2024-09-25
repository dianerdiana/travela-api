import { db } from "@config/db";
import { LoginInput, RegisterInput } from "./AuthSchema";
import { createUniqueUsername } from "@utils/createUniqueUsername";
import { comparePassword, hashPassword } from "@utils/password";
import { BadRequestError } from "@errors/BadRequestError";

export const AuthService = {
  register: async ({ avatar, email, fullName, phone, password }: RegisterInput) => {
    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Start Transaction
    const newUser = await db.$transaction(async (prisma) => {
      return prisma.user.create({
        data: {
          avatar,
          email,
          fullName,
          phone,
          password: hashedPassword,
          username: createUniqueUsername(fullName),
        },
      });
    });

    return newUser;
  },
  login: async ({ username, password }: LoginInput) => {
    // Start Transaction
    const user = await db.$transaction(async (prisma) => {
      return await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email: username }],
        },
        select: {
          id: true,
          fullName: true,
          username: true,
          email: true,
          password: true,
        },
      });
    });

    const isMatch = await comparePassword(password, user ? user.password : "");

    if (!user || !isMatch) {
      throw new BadRequestError("Username and Password do not match.");
    }

    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
    };
  },
};
