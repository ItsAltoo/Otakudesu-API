import express from "express";
import { fetchOngoingAnime } from "../controllers/ongoing-anime.js";
import { fetchCompleteAnime } from "../controllers/complete-anime.js";
import { fetchAnimeDetails } from "../controllers/anime.js";
import { fetchAnimeStream } from "../controllers/anime-stream.js";
import { fetchAnimeBatchDownload } from "../controllers/anime-batch.js";

const router = express.Router();

router
  .get("/ongoing-anime", fetchOngoingAnime)
  .get("/ongoing-anime/page/:page", fetchOngoingAnime)
  .get("/complete-anime", fetchCompleteAnime)
  .get("/complete-anime/page/:page", fetchCompleteAnime)
  .get("/anime/:id", fetchAnimeDetails)
  .get("/episode/:id", fetchAnimeStream)
  .get("/batch/:id", fetchAnimeBatchDownload);

export default router;
