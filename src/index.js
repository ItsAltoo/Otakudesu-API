import express from "express";
import dotenv from "dotenv";
import router from "./routes/main-route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use("/api", router);

app.get("/", (req, res) => {
  res.redirect("/api/ongoing-anime");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
