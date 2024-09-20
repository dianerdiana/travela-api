import { comparePassword } from "./../../utils/password";
import { db } from "@config/db";
import { hashPassword } from "@utils/password";

import { RegisterType, LoginType } from "./auth.type";

export const authService = {
  register: async ({ avatar, email, fullName, password, phone, username }: RegisterType) => {
    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.create({
      data: {
        avatar,
        email,
        fullName,
        password: hashedPassword,
        phone,
        username,
      },
    });

    return newUser;
  },
  login: async ({ username, password }: LoginType) => {
    const user = await db.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    const comparedPassword = await comparePassword(password, user.password);

    if (comparedPassword) {
      return user;
    } else {
    }
  },
};
