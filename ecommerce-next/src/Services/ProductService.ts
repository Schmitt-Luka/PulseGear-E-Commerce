import type { Product } from "../Types";

const API_URL = "https://evidence-campsite-stowaway.ngrok-free.dev";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }
    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error en productService:", error);
    return [];
  }
};
