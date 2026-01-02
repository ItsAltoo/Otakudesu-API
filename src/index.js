import express from "express";
import dotenv from "dotenv";
import router from "./routes/main-route.js";

dotenv.config();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.redirect("/api/ongoing-anime");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use("/api", router);

export default app;
