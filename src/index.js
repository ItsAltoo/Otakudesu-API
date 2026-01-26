import express from "express";
import dotenv from "dotenv";
import router from "./routes/main-route.js";
import cors from "cors"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use("/api", router);

app.get("/", (req, res) => {
  res.redirect("/api");
});

app.get("/api", (req, res) => {
  res.json({
    status: res.statusCode,
    message: "Otakudesu API is running successfully",
    credit: "Developed by ItsAltoo",
    routes: [
      "/ongoing-anime",
      "/ongoing-anime/page/:page",
      "/complete-anime",
      "/complete-anime/page/:page",
      "/anime/:id",
      "/episode/:id",
      "/batch/:id",
    ],
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app