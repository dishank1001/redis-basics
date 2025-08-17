import { getProductDetailsFromRedis, saveProductInRedis } from "./cacheAside";
import { redis } from "./redis";

export type Product = {
  id: string;
  name: string;
  price: number;
};

const productTwo: Product = {
  id: "random",
  name: "Random",
  price: 400,
};

const LOCK_MS = 3000;
const EXPIRT_TTL = 10 * 60;
const NO_OF_RETRIES = 4;

const productKey = (id: string) => `product:${id}`;
const lockKey = (id: string) => `lock:product:${id}`;

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getProductWithSingleFlight = async (id: string) => {
  //get keys
  const pkey = productKey(id);
  const lkey = lockKey(id);

  try {
    const dataExistsInRedis = await getProductDetailsFromRedis(pkey);

    console.log("Start data exist in redis?", dataExistsInRedis);

    if (dataExistsInRedis) return JSON.parse(dataExistsInRedis);

    console.log("Start data not exist in redis..");

    const acquired = await redis.set(lkey, "1", "PX", LOCK_MS, "NX");
    console.log("Is Lock aquired?", acquired);

    if (acquired === "OK") {
      console.log("Lock aquired...", acquired);

      try {
        await new Promise((res) => setTimeout(res, 10000));
        await redis.set(pkey, JSON.stringify(productTwo), "EX", EXPIRT_TTL);
        console.log("Lock key set...");

        return productTwo;
      } finally {
        console.log("Lock Key Deleted");

        await redis.del(lkey);
      }

      //fetch form db
    } else {
      for (let i = 0; i < NO_OF_RETRIES; i++) {
        console.log("Lock not aquired retrying...");

        await sleep(100);
        const dataExistsInRedis = await getProductDetailsFromRedis(pkey);
        if (dataExistsInRedis) return JSON.parse(dataExistsInRedis);
      }
    }

    console.log("finally exit");
  } catch (error) {}
};
