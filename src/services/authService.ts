import { hashPassword } from "@utils/password";
import { db } from "@config/db";
import { RegisterInput } from "@schemas/authSchemas";

export const authService = {
  register: async ({ avatar, email, fullName, phone, password }: RegisterInput) => {
    const hashedPassword = await hashPassword(password);
    const newUser = db.user.create({
      data: {
        avatar,
        email,
        fullName,
        phone,
        password: hashedPassword,
        username: fullName,
      },
    });

    return newUser;
  },
};
