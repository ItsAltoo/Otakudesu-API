import express from "express";
import { fetchOngoingAnime } from "../controllers/ongoing-anime.js";
import { fetchCompleteAnime } from "../controllers/complete-anime.js";
import { fetchAnimeDetails } from "../controllers/anime.js";

const router = express.Router();

router
  .get("/ongoing-anime", fetchOngoingAnime)
  .get("/ongoing-anime/:page", fetchOngoingAnime)
  .get("/complete-anime", fetchCompleteAnime)
  .get("/complete-anime/:page", fetchCompleteAnime)
  .get("/anime/:id", fetchAnimeDetails);
  
export default router;
