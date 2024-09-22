import { LoginInput } from "./../schemas/authSchemas";
import { db } from "@config/db";
import { comparePassword, hashPassword } from "@utils/password";
import { RegisterInput } from "@schemas/authSchemas";
import { createUniqueUsername } from "@utils/index";
import { NotFoundError } from "@errors/NotFoundError";
import { BadRequestError } from "@errors/BadRequestError";

export const authService = {
  register: async ({ avatar, email, fullName, phone, password }: RegisterInput) => {
    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.create({
      data: {
        avatar,
        email,
        fullName,
        phone,
        password: hashedPassword,
        username: createUniqueUsername(fullName),
      },
    });

    return newUser;
  },
  login: async ({ username, password }: LoginInput) => {
    const user = await db.user.findFirst({
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

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
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
