import { db } from "@config/db";
import { NotFoundError } from "@errors/NotFoundError";
import {
  CreateCategoryInput,
  DeleteCategoryInput,
  PaginationCategoryInput,
  UpdateCategoryInput,
} from "./CategorySchema";
import { generateSlug } from "@utils/generateSlug";

import fs from "fs";
import path from "path";

const generateUniqueSlug = async (name: string, categoryId?: number): Promise<string> => {
  const slug = generateSlug(name);
  let uniqueSlug = slug;
  let count = 1;

  let existingSlug = await db.category.findUnique({
    where: {
      slug: uniqueSlug,
    },
  });

  while (existingSlug && existingSlug.id !== categoryId) {
    uniqueSlug = `${slug}-${count}`;
    count += 1;

    existingSlug = await db.category.findUnique({
      where: {
        slug: uniqueSlug,
      },
    });
  }

  return uniqueSlug;
};

export const CategoryService = {
  createCategory: async ({ name, icon }: CreateCategoryInput) => {
    const uniqueSlug = await generateUniqueSlug(generateSlug(name));
    const newCategory = await db.category.create({
      data: {
        name,
        slug: uniqueSlug,
        icon: icon ?? null,
      },
    });

    return newCategory;
  },

  getCategories: async ({ pageSize, order, page, sort, search }: PaginationCategoryInput) => {
    const pageNumber = parseInt(page);
    const limit = parseInt(pageSize);
    const sortField = sort;
    const sortOrder = order.toLowerCase() === "desc" ? "desc" : "asc";

    const filters: any = {};

    if (search) {
      const searchTerm = search;

      filters.OR = [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
          slug: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    const categories = await db.category.findMany({
      where: filters,
      skip: (pageNumber - 1) * limit,
      take: limit,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalCount = await db.category.count({ where: filters });

    return {
      total: totalCount,
      page: pageNumber,
      pageSize,
      data: categories,
    };
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

  updateCategory: async ({
    categoryId,
    name,
    icon,
  }: UpdateCategoryInput & { categoryId: number }) => {
    const errorNotFound = new NotFoundError("Category doesn't exist.");

    if (isNaN(categoryId)) {
      throw errorNotFound;
    }

    const uniqueSlug = await generateUniqueSlug(generateSlug(name), categoryId);
    const category = await db.category.findUnique({ where: { id: categoryId } });

    if (!category) {
      throw errorNotFound;
    }

    const updatedCategory = await db.category.update({
      where: { id: categoryId },
      data: { name, slug: uniqueSlug, icon: icon ?? category.icon },
    });

    if (icon) {
      fs.unlink(path.join(__dirname, `../..${icon}`), (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }

    return updatedCategory;
  },

  deleteCategories: async ({ categoryIds }: DeleteCategoryInput) => {
    const filteredCategoryIds = categoryIds.filter((id) => !isNaN(Number(id)));

    await db.category.deleteMany({
      where: {
        id: {
          in: filteredCategoryIds,
        },
      },
    });

    return filteredCategoryIds.length;
  },
};
