// import redis from "./redis"

import { redis } from "./redis";

export type Product = {
  id: string;
  name: string;
  price: number;
};

// export const
export const getProductDetailsFromRedis = async (id: string) => {
  return await redis.get(id);
};

export const saveProductInRedis = async (product: Product) => {
  console.log("Saving process Start");
  await redis.set(product.id, JSON.stringify(product)).then((data) => {
    console.log("Redis saved data success...");
  });
};
