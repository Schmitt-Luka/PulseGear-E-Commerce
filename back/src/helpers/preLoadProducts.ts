import { AppDataSource } from "../config/dataSource";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product.repository";

interface IProduct {
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  stock: number;
}

const productsToPreLoad: IProduct[] = [
  {
    name: "Pathfinder: Kingmaker",
    price: 39.99,
    description:
      "Un épico RPG clásico que te desafía a explorar y conquistar las Tierras Robadas. Basado en el sistema de reglas de Pathfinder.",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/640820/header.jpg",
    categoryId: 1,
    stock: 20,
  },
  {
    name: "Civilization VI",
    price: 59.99,
    description:
      "Construye un imperio que resista el paso del tiempo. Domina el mundo estableciendo tu civilización desde la Edad de Piedra hasta la era moderna.",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/289070/header.jpg",
    categoryId: 2,
    stock: 15,
  },
  {
    name: "Elden Ring",
    price: 59.99,
    description:
      "Levántate, Sinluz, y déjate guiar por la gracia para alzar el poder del Círculo de Elden y convertirte en Señor del Círculo.",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    categoryId: 3,
    stock: 25,
  },
  {
    name: "Hollow Knight",
    price: 14.99,
    description:
      "Explora las profundidades de un reino olvidado lleno de insectos y héroes en este increíble juego de acción y aventura 2D.",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg",
    categoryId: 4,
    stock: 50,
  },
  {
    name: "Stardew Valley",
    price: 13.99,
    description:
      "Heredaste la vieja granja de tu abuelo en Stardew Valley. Ármate con herramientas manuales y propónte convertir ese campo descuidado en un hogar próspero.",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg",
    categoryId: 5,
    stock: 100,
  },
  {
    name: "God of War",
    price: 49.99,
    description:
      "Adéntrate en los mitos nórdicos. Kratos y su hijo Atreus deben luchar por sobrevivir mientras intentan cumplir una promesa profundamente personal.",
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg",
    categoryId: 3,
    stock: 15,
  },
];

export const preLoadProducts = async () => {
  const products = await ProductRepository.find();
  if (!products.length)
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Product)
      .values(productsToPreLoad)
      .execute();
  console.log("Products preloaded");
};
