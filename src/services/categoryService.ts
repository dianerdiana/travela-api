import { db } from "@config/db";
import { NotFoundError } from "@errors/NotFoundError";
import { CreateCategoryInput } from "@schemas/categorySchemas";

export const categoryService = {
  createCategory: async ({ name, slug, icon }: CreateCategoryInput) => {
    const newCategory = await db.category.create({
      data: {
        name,
        slug,
        icon: icon ?? null,
      },
    });

    return newCategory;
  },

  getCategories: async () => {
    const categories = await db.category.findMany();

    return categories;
  },

  getCategory: async (slug: string | undefined) => {
    const category = await db.category.findFirst({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    return category;
  },
};
