
# Redis Cache-Aside Starter (Node + TypeScript)

This is a **CodeSandbox-ready** starter that demonstrates **cache-aside + stale-while-revalidate + anti-stampede lock** for a Product Detail Page (PDP).

## How to use (CodeSandbox or locally)

1. **Provision Redis** (e.g., Redis Cloud free tier) and copy the `REDIS_URL` (looks like `redis://default:<password>@<host>:<port>`).
2. In **CodeSandbox**:
   - Import this project (or upload the zip).
   - Add a secret/environment variable: `REDIS_URL=<your connection URL>`.
   - Hit **Run**. The server starts on port 3000.
3. **Endpoints to try** (replace `:id` with any string):
   - `GET /product/:id` — reads via cache-aside with stale-while-revalidate.
   - `POST /product/:id/price` JSON body `{ "price": 1234 }`
     - Optional query `?mode=del` (default): update DB then **delete cache** (next read repopulates)
     - Optional query `?mode=writeThrough=1`: update DB **and** refresh cache (write-through)

### Quick curl tests
```bash
# 1) First read is likely a MISS → populates cache
curl http://localhost:3000/product/sku-1

# 2) Subsequent reads are HITS
curl http://localhost:3000/product/sku-1

# 3) Update price (invalidate via DEL)
curl -X POST http://localhost:3000/product/sku-1/price?mode=del   -H 'Content-Type: application/json' -d '{"price": 1499}'

# 4) Read again → should fetch DB and repopulate cache
curl http://localhost:3000/product/sku-1

# 5) Update price (write-through)
curl -X POST 'http://localhost:3000/product/sku-1/price?writeThrough=1'   -H 'Content-Type: application/json' -d '{"price": 1599}'
```

## What this shows
- **Cache-aside** with **HARD TTL** (setex) and a **SOFT TTL** window to serve stale while refreshing in background.
- **Anti-stampede lock** so only **one** request repopulates the cache during a miss under load.
- **Versioned keys** ready for safe invalidation on schema changes.

---

### Files
- `src/server.ts` — Express API with `/product/:id` and update endpoint.
- `src/cache/productCacheAdvanced.ts` — cache-aside + SWR + lock.
- `src/db.ts` — in-memory mock DB with `fetchProductFromDB` and `updateProductInDB`.
- `src/redis.ts` — ioredis client.

Happy hacking! 🚀
