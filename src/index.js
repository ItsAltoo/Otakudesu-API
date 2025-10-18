import express from "express";
import dotenv from "dotenv";
import router from "./routes/main-route.js";

// load environment variables from .env
dotenv.config();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
