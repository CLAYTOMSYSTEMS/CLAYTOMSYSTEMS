import express from "express";
import bodyParser from "body-parser";
import webhookHandler from "./webhookHandler";

const app = express();
app.use(bodyParser.json({ limit: "1mb" }));

app.post("/webhook", webhookHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`MCP escuchando en http://0.0.0.0:${port}`);
});