import { AppDataSource } from "../config/dataSource";
import { Category } from "../entities/Category";
import { CategoryRepository } from "../repositories/category.respository";

interface ICategory {
  name: string;
}

const categoriesToPreLoad: ICategory[] = [
  { name: "RPG" },
  { name: "Estrategia" },
  { name: "Acción" },
  { name: "Indie" },
  { name: "Simulación" },
  { name: "Aventura" },
  { name: "Terror" },
  { name: "Deportes" },
  { name: "Multijugador" },
];

export const preLoadCategories = async () => {
  const categories = await CategoryRepository.find();
  if (!categories.length)
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Category)
      .values(categoriesToPreLoad)
      .execute();
  console.log("Categories preloaded");
};
