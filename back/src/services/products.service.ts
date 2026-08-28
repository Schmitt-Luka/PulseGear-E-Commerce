import { ProductRepository } from "../repositories/product.repository";
import { Product } from "../entities/Product";

export const getProductsService = async (): Promise<Product[]> => {
  return await ProductRepository.find({
    relations: ["category"],
  });
};

export const getProductByIdService = async (id: number): Promise<Product> => {
  const product = await ProductRepository.findOne({
    where: { id },
    relations: ["category"],
  });

  if (!product) {
    const error: any = new Error("Juego no encontrado");
    error.statusCode = 404;
    throw error;
  }
  return product;
};

export const checkProductExists = async (id: number): Promise<boolean> => {
  const product = await ProductRepository.findOneBy({ id });
  return !!product;
};
