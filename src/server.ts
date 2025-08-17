import express from "express";
import { getProductWithSingleFlight } from "./db";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.send("ok"));

app.get("/product/:id", async (req, res) => {
  try {
    const data = await getProductWithSingleFlight(req.params.id);
    res.json(data);
  } catch (error) {
    res.sendStatus(500).json({ error: "Internal server error" });
    console.log(error);
  }
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
