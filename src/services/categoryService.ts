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

  getCategory: async (categoryId: number) => {
    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    return category;
  },
};
